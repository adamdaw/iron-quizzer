import { createElement } from 'lwc';
import Main from 'quiz/main';

// Flush pending microtasks. Works with both real and fake timers
// because Promise.resolve() is a native microtask, not a timer.
const flushPromises = async () => {
    for (let i = 0; i < 10; i++) {
        await Promise.resolve();
    }
};

const MOCK_RESULTS = Array.from({ length: 10 }, (_, i) => ({
    category: 'Entertainment: Video Games',
    type: 'boolean',
    difficulty: 'easy',
    question:
        i === 0 ? 'Question with &quot;quotes&quot;' : `Question ${i + 1}`,
    correct_answer: i < 9 ? 'True' : 'False',
    incorrect_answers: [i < 9 ? 'False' : 'True']
}));

function mockFetchSuccess(results = MOCK_RESULTS) {
    global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({ response_code: 0, results })
    });
}

function mockFetchFailure() {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
}

async function createMain() {
    const el = createElement('quiz-main', { is: Main });
    document.body.appendChild(el);
    await flushPromises();
    return el;
}

afterEach(() => {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
    jest.restoreAllMocks();
    jest.useRealTimers();
});

// ─── Loading / fetch ──────────────────────────────────────────────────────────

describe('loading state', () => {
    it('shows loading indicator while fetching', () => {
        global.fetch = jest.fn(() => new Promise(() => {}));
        const el = createElement('quiz-main', { is: Main });
        document.body.appendChild(el);
        expect(el.shadowRoot.querySelector('.quiz__loading')).not.toBeNull();
        expect(el.shadowRoot.querySelector('quiz-item')).toBeNull();
    });
});

describe('successful fetch', () => {
    beforeEach(() => mockFetchSuccess());

    it('hides loading indicator and shows first question after fetch', async () => {
        const el = await createMain();
        expect(el.shadowRoot.querySelector('.quiz__loading')).toBeNull();
        expect(el.shadowRoot.querySelector('quiz-item')).not.toBeNull();
    });

    it('shows question 1 first', async () => {
        const el = await createMain();
        expect(el.shadowRoot.querySelector('quiz-item').question.id).toBe(1);
    });

    it('decodes HTML entities in question text', async () => {
        const el = await createMain();
        expect(el.shadowRoot.querySelector('quiz-item').question.question).toBe(
            'Question with "quotes"'
        );
    });

    it('shows progress text for question 1', async () => {
        const el = await createMain();
        expect(el.shadowRoot.querySelector('.quiz__progress').textContent).toBe(
            'Question 1 of 10'
        );
    });

    it('does not show score initially', async () => {
        const el = await createMain();
        expect(el.shadowRoot.querySelector('.quiz__score')).toBeNull();
    });
});

describe('failed fetch', () => {
    beforeEach(() => mockFetchFailure());

    it('shows error message', async () => {
        const el = await createMain();
        expect(el.shadowRoot.querySelector('.quiz__error')).not.toBeNull();
    });

    it('shows retry button', async () => {
        const el = await createMain();
        expect(el.shadowRoot.querySelector('.quiz__retry')).not.toBeNull();
    });

    it('retries fetch when retry button clicked', async () => {
        const el = await createMain();
        mockFetchSuccess();
        el.shadowRoot.querySelector('.quiz__retry').click();
        await flushPromises();
        expect(el.shadowRoot.querySelector('quiz-item')).not.toBeNull();
        expect(el.shadowRoot.querySelector('.quiz__error')).toBeNull();
    });
});

// ─── Question progression and scoring ────────────────────────────────────────

describe('question progression', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        mockFetchSuccess();
    });

    // Dispatch an answer event on the currently visible quiz-item, then
    // advance fake timers past both transition timeouts and flush microtasks.
    async function answerCurrent(el, correct) {
        el.shadowRoot
            .querySelector('quiz-item')
            .dispatchEvent(new CustomEvent('answer', { detail: { correct } }));
        jest.advanceTimersByTime(2000); // past 1500 + 400 ms
        await flushPromises();
    }

    it('advances to question 2 after answering question 1', async () => {
        const el = await createMain();
        await answerCurrent(el, true);
        expect(el.shadowRoot.querySelector('quiz-item').question.id).toBe(2);
    });

    it('updates progress text after advancing', async () => {
        const el = await createMain();
        await answerCurrent(el, true);
        expect(el.shadowRoot.querySelector('.quiz__progress').textContent).toBe(
            'Question 2 of 10'
        );
    });

    it('applies exiting class during fade-out', async () => {
        const el = await createMain();
        el.shadowRoot
            .querySelector('quiz-item')
            .dispatchEvent(
                new CustomEvent('answer', { detail: { correct: true } })
            );
        jest.advanceTimersByTime(1600); // past 1500 but before 1900
        await flushPromises();
        expect(
            el.shadowRoot
                .querySelector('.quiz__question-wrap')
                .classList.contains('quiz__question-wrap--exiting')
        ).toBe(true);
    });

    it('shows score after all 10 questions answered', async () => {
        const el = await createMain();
        for (let i = 0; i < 10; i++) {
            await answerCurrent(el, i < 7); // 7 correct
        }
        expect(el.shadowRoot.querySelector('.quiz__score').textContent).toBe(
            'You scored 7 / 10'
        );
    });

    it('shows play again button after completion', async () => {
        const el = await createMain();
        for (let i = 0; i < 10; i++) {
            await answerCurrent(el, true);
        }
        expect(el.shadowRoot.querySelector('.quiz__play-again')).not.toBeNull();
    });

    it('reloads to question 1 when play again clicked', async () => {
        const el = await createMain();
        for (let i = 0; i < 10; i++) {
            await answerCurrent(el, true);
        }
        el.shadowRoot.querySelector('.quiz__play-again').click();
        await flushPromises();
        expect(el.shadowRoot.querySelector('quiz-item').question.id).toBe(1);
        expect(el.shadowRoot.querySelector('.quiz__score')).toBeNull();
    });

    it('isComplete is false when no questions are loaded', async () => {
        mockFetchSuccess([]);
        const el = await createMain();
        // _questions = [], _currentIndex = 0 → isComplete branch: 0 >= 0 true,
        // but length > 0 false → isComplete false → no score shown
        expect(el.shadowRoot.querySelector('.quiz__score')).toBeNull();
    });
});
