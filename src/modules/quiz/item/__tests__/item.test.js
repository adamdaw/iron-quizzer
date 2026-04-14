import { createElement } from 'lwc';
import Item from 'quiz/item';

const TRUE_QUESTION = {
    category: 'Entertainment: Video Games',
    type: 'boolean',
    difficulty: 'easy',
    question: 'Is the sky blue?',
    correct_answer: 'True',
    incorrect_answers: ['False']
};

const FALSE_QUESTION = {
    category: 'Entertainment: Video Games',
    type: 'boolean',
    difficulty: 'easy',
    question: 'Is the sky green?',
    correct_answer: 'False',
    incorrect_answers: ['True']
};

function createItem(question) {
    const element = createElement('quiz-item', { is: Item });
    element.question = question;
    document.body.appendChild(element);
    return element;
}

afterEach(() => {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
});

describe('rendering', () => {
    it('displays the question text', () => {
        const el = createItem(TRUE_QUESTION);
        expect(el.shadowRoot.querySelector('.question__text').textContent).toBe(
            'Is the sky blue?'
        );
    });

    it('renders a True button and a False button', () => {
        const el = createItem(TRUE_QUESTION);
        const buttons = el.shadowRoot.querySelectorAll('button');
        expect(buttons).toHaveLength(2);
        expect(buttons[0].textContent).toBe('True');
        expect(buttons[1].textContent).toBe('False');
    });

    it('shows no feedback initially', () => {
        const el = createItem(TRUE_QUESTION);
        expect(el.shadowRoot.querySelector('.question__feedback')).toBeNull();
    });

    it('buttons are enabled initially', () => {
        const el = createItem(TRUE_QUESTION);
        const buttons = el.shadowRoot.querySelectorAll('button');
        expect(buttons[0].disabled).toBe(false);
        expect(buttons[1].disabled).toBe(false);
    });

    it('resets answered state when question prop changes', async () => {
        const el = createItem(TRUE_QUESTION);
        el.shadowRoot.querySelectorAll('button')[0].click();
        await Promise.resolve();
        expect(
            el.shadowRoot.querySelector('.question__feedback')
        ).not.toBeNull();

        el.question = FALSE_QUESTION;
        await Promise.resolve();
        expect(el.shadowRoot.querySelector('.question__feedback')).toBeNull();
        expect(el.shadowRoot.querySelector('.question__text').textContent).toBe(
            'Is the sky green?'
        );
    });
});

describe('True button', () => {
    it('shows Correct when the correct answer is True', async () => {
        const el = createItem(TRUE_QUESTION);
        el.shadowRoot.querySelectorAll('button')[0].click();
        await Promise.resolve();
        expect(
            el.shadowRoot.querySelector('.question__feedback').textContent
        ).toBe('Correct!');
    });

    it('shows Incorrect when the correct answer is False', async () => {
        const el = createItem(FALSE_QUESTION);
        el.shadowRoot.querySelectorAll('button')[0].click();
        await Promise.resolve();
        expect(
            el.shadowRoot.querySelector('.question__feedback').textContent
        ).toBe('Incorrect!');
    });

    it('disables both buttons after answering', async () => {
        const el = createItem(TRUE_QUESTION);
        el.shadowRoot.querySelectorAll('button')[0].click();
        await Promise.resolve();
        const buttons = el.shadowRoot.querySelectorAll('button');
        expect(buttons[0].disabled).toBe(true);
        expect(buttons[1].disabled).toBe(true);
    });
});

describe('False button', () => {
    it('shows Correct when the correct answer is False', async () => {
        const el = createItem(FALSE_QUESTION);
        el.shadowRoot.querySelectorAll('button')[1].click();
        await Promise.resolve();
        expect(
            el.shadowRoot.querySelector('.question__feedback').textContent
        ).toBe('Correct!');
    });

    it('shows Incorrect when the correct answer is True', async () => {
        const el = createItem(TRUE_QUESTION);
        el.shadowRoot.querySelectorAll('button')[1].click();
        await Promise.resolve();
        expect(
            el.shadowRoot.querySelector('.question__feedback').textContent
        ).toBe('Incorrect!');
    });
});

describe('feedback class', () => {
    it('applies question__feedback--correct on a correct answer', async () => {
        const el = createItem(TRUE_QUESTION);
        el.shadowRoot.querySelectorAll('button')[0].click();
        await Promise.resolve();
        expect(
            el.shadowRoot
                .querySelector('.question__feedback')
                .classList.contains('question__feedback--correct')
        ).toBe(true);
    });

    it('applies question__feedback--incorrect on a wrong answer', async () => {
        const el = createItem(TRUE_QUESTION);
        el.shadowRoot.querySelectorAll('button')[1].click();
        await Promise.resolve();
        expect(
            el.shadowRoot
                .querySelector('.question__feedback')
                .classList.contains('question__feedback--incorrect')
        ).toBe(true);
    });
});

describe('answer event', () => {
    it('dispatches answer event with correct:true when right answer selected', async () => {
        const el = createItem(TRUE_QUESTION);
        const handler = jest.fn();
        el.addEventListener('answer', handler);
        el.shadowRoot.querySelectorAll('button')[0].click();
        await Promise.resolve();
        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler.mock.calls[0][0].detail).toEqual({ correct: true });
    });

    it('dispatches answer event with correct:false when wrong answer selected', async () => {
        const el = createItem(TRUE_QUESTION);
        const handler = jest.fn();
        el.addEventListener('answer', handler);
        el.shadowRoot.querySelectorAll('button')[1].click();
        await Promise.resolve();
        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler.mock.calls[0][0].detail).toEqual({ correct: false });
    });
});
