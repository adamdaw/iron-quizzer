const QuizMain = require('../src/modules/__utam__/pageObjects/quizMain');

/**
 * Click a button inside a specific quiz-item via shadow DOM JS.
 * @param {number} itemIndex - 0-based index of the quiz-item
 * @param {number} buttonIndex - 0-based index of button (0=True, 1=False)
 */
async function clickItemButton(itemIndex, buttonIndex) {
    await browser.execute(
        function (idx, btnIdx) {
            const main = document.querySelector('quiz-main');
            const items = main.shadowRoot.querySelectorAll('quiz-item');
            const buttons = items[idx].shadowRoot.querySelectorAll('button');
            buttons[btnIdx].click();
        },
        itemIndex,
        buttonIndex
    );
}

/**
 * Read feedback text from a specific quiz-item.
 * Returns null if the feedback element is not present.
 */
async function getItemFeedback(itemIndex) {
    return browser.execute(function (idx) {
        const main = document.querySelector('quiz-main');
        const items = main.shadowRoot.querySelectorAll('quiz-item');
        const el = items[idx].shadowRoot.querySelector('.feedback');
        return el ? el.textContent : null;
    }, itemIndex);
}

describe('Quiz App', () => {
    beforeEach(async () => {
        await browser.url('/');
    });

    describe('page structure', () => {
        it('renders exactly 10 quiz items', async () => {
            const main = await utam.load(QuizMain);
            const items = await main.getItems();
            expect(items).toHaveLength(10);
        });
    });

    describe('True button — question 1 (correct answer: True)', () => {
        it('shows Correct! when clicked', async () => {
            await clickItemButton(0, 0);
            const text = await getItemFeedback(0);
            expect(text).toBe('Correct!');
        });
    });

    describe('False button — question 1 (correct answer: True)', () => {
        it('shows Incorrect! when clicked', async () => {
            await clickItemButton(0, 1);
            const text = await getItemFeedback(0);
            expect(text).toBe('Incorrect!');
        });
    });

    describe('True button — question 10 (correct answer: False)', () => {
        it('shows Incorrect! when clicked', async () => {
            await clickItemButton(9, 0);
            const text = await getItemFeedback(9);
            expect(text).toBe('Incorrect!');
        });
    });

    describe('False button — question 10 (correct answer: False)', () => {
        it('shows Correct! when clicked', async () => {
            await clickItemButton(9, 1);
            const text = await getItemFeedback(9);
            expect(text).toBe('Correct!');
        });
    });

    describe('question text', () => {
        it('displays a non-empty question for every item', async () => {
            const texts = await browser.execute(function () {
                const main = document.querySelector('quiz-main');
                return Array.from(
                    main.shadowRoot.querySelectorAll('quiz-item')
                ).map(
                    (item) => item.shadowRoot.querySelector('h2').textContent
                );
            });
            expect(texts).toHaveLength(10);
            texts.forEach((t) => expect(t.length).toBeGreaterThan(0));
        });
    });
});
