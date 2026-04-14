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
        expect(el.shadowRoot.querySelector('h2').textContent).toBe(
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
        expect(el.shadowRoot.querySelector('.feedback')).toBeNull();
    });
});

describe('True button', () => {
    it('shows Correct when the correct answer is True', async () => {
        const el = createItem(TRUE_QUESTION);
        el.shadowRoot.querySelectorAll('button')[0].click();
        await Promise.resolve();
        expect(el.shadowRoot.querySelector('.feedback').textContent).toBe(
            'Correct!'
        );
    });

    it('shows Incorrect when the correct answer is False', async () => {
        const el = createItem(FALSE_QUESTION);
        el.shadowRoot.querySelectorAll('button')[0].click();
        await Promise.resolve();
        expect(el.shadowRoot.querySelector('.feedback').textContent).toBe(
            'Incorrect!'
        );
    });
});

describe('False button', () => {
    it('shows Correct when the correct answer is False', async () => {
        const el = createItem(FALSE_QUESTION);
        el.shadowRoot.querySelectorAll('button')[1].click();
        await Promise.resolve();
        expect(el.shadowRoot.querySelector('.feedback').textContent).toBe(
            'Correct!'
        );
    });

    it('shows Incorrect when the correct answer is True', async () => {
        const el = createItem(TRUE_QUESTION);
        el.shadowRoot.querySelectorAll('button')[1].click();
        await Promise.resolve();
        expect(el.shadowRoot.querySelector('.feedback').textContent).toBe(
            'Incorrect!'
        );
    });
});
