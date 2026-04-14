import { createElement } from 'lwc';
import Main from 'quiz/main';

function createMain() {
    const element = createElement('quiz-main', { is: Main });
    document.body.appendChild(element);
    return element;
}

afterEach(() => {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
});

describe('rendering', () => {
    it('renders exactly 10 quiz items', () => {
        const el = createMain();
        expect(el.shadowRoot.querySelectorAll('quiz-item')).toHaveLength(10);
    });

    it('passes question data to every item', () => {
        const el = createMain();
        el.shadowRoot.querySelectorAll('quiz-item').forEach((item) => {
            expect(item.question).toBeDefined();
            expect(item.question.question).toBeTruthy();
            expect(item.question.correct_answer).toMatch(/^(True|False)$/);
        });
    });

    it('all questions are boolean type', () => {
        const el = createMain();
        el.shadowRoot.querySelectorAll('quiz-item').forEach((item) => {
            expect(item.question.type).toBe('boolean');
        });
    });

    it('all questions are from the Video Games category', () => {
        const el = createMain();
        el.shadowRoot.querySelectorAll('quiz-item').forEach((item) => {
            expect(item.question.category).toBe('Entertainment: Video Games');
        });
    });
});

describe('questions getter', () => {
    it('returns an array of 10 questions', () => {
        const el = createMain();
        // Verify via rendered output — 10 items means getter returned 10 records
        expect(el.shadowRoot.querySelectorAll('quiz-item')).toHaveLength(10);
    });

    it('last question has correct_answer of False', () => {
        const el = createMain();
        const items = el.shadowRoot.querySelectorAll('quiz-item');
        expect(items[9].question.correct_answer).toBe('False');
    });
});
