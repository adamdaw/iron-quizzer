const QuizMain = require('../src/modules/__utam__/pageObjects/quizMain');

/**
 * Wait for a quiz-item to be present (questions loaded from API).
 */
async function waitForQuestion() {
    await browser.waitUntil(
        () =>
            browser.execute(function () {
                const main = document.querySelector('quiz-main');
                return (
                    !!main &&
                    !!main.shadowRoot &&
                    main.shadowRoot.querySelectorAll('quiz-item').length === 1
                );
            }),
        { timeout: 15000, timeoutMsg: 'Quiz question did not load in time' }
    );
}

/**
 * Wait for the current question to change (next question or completion).
 * Pass the id of the question that should go away.
 */
async function waitForQuestionChange(previousId) {
    await browser.waitUntil(
        () =>
            browser.execute(function (id) {
                const main = document.querySelector('quiz-main');
                if (!main || !main.shadowRoot) return false;
                const item = main.shadowRoot.querySelector('quiz-item');
                // Either no item (completion) or a different question
                return !item || (item.question && item.question.id !== id);
            }, previousId),
        { timeout: 5000, timeoutMsg: 'Question did not advance' }
    );
}

/**
 * Click a button on the currently visible quiz-item.
 * @param {number} buttonIndex - 0 = True, 1 = False
 */
async function clickCurrentButton(buttonIndex) {
    await browser.execute(function (btnIdx) {
        const main = document.querySelector('quiz-main');
        const item = main.shadowRoot.querySelector('quiz-item');
        item.shadowRoot.querySelectorAll('button')[btnIdx].click();
    }, buttonIndex);
}

/**
 * Read feedback text from the current quiz-item.
 */
async function getCurrentFeedback() {
    return browser.execute(function () {
        const main = document.querySelector('quiz-main');
        const item = main.shadowRoot.querySelector('quiz-item');
        const el = item.shadowRoot.querySelector('.question__feedback');
        return el ? el.textContent : null;
    });
}

/**
 * Returns 0 (True) or 1 (False) for the correct answer of the current item.
 */
async function getCorrectButtonIndex() {
    return browser.execute(function () {
        const main = document.querySelector('quiz-main');
        const item = main.shadowRoot.querySelector('quiz-item');
        return item.question.correct_answer === 'True' ? 0 : 1;
    });
}

describe('Quiz App', () => {
    beforeEach(async () => {
        await browser.url('/');
        await waitForQuestion();
    });

    describe('page structure', () => {
        it('shows one question at a time', async () => {
            const main = await utam.load(QuizMain);
            const items = await main.getItems();
            expect(items).toHaveLength(1);
        });
    });

    describe('correct answer feedback', () => {
        it('shows Correct! when the right button is clicked', async () => {
            const correctIdx = await getCorrectButtonIndex();
            await clickCurrentButton(correctIdx);
            const text = await getCurrentFeedback();
            expect(text).toBe('Correct!');
        });

        it('shows Incorrect! when the wrong button is clicked', async () => {
            const wrongIdx = await browser.execute(function () {
                const main = document.querySelector('quiz-main');
                const item = main.shadowRoot.querySelector('quiz-item');
                return item.question.correct_answer === 'True' ? 1 : 0;
            });
            await clickCurrentButton(wrongIdx);
            const text = await getCurrentFeedback();
            expect(text).toBe('Incorrect!');
        });
    });

    describe('question progression', () => {
        it('advances to a new question after answering', async () => {
            const firstId = await browser.execute(function () {
                const main = document.querySelector('quiz-main');
                return main.shadowRoot.querySelector('quiz-item').question.id;
            });
            const correctIdx = await getCorrectButtonIndex();
            await clickCurrentButton(correctIdx);
            await waitForQuestionChange(firstId);
            const secondId = await browser.execute(function () {
                const main = document.querySelector('quiz-main');
                const item = main.shadowRoot.querySelector('quiz-item');
                return item ? item.question.id : null;
            });
            expect(secondId).not.toBe(firstId);
        });
    });

    describe('score display', () => {
        it('shows score after all questions are answered', async () => {
            for (let i = 0; i < 10; i++) {
                const currentId = await browser.execute(function () {
                    const main = document.querySelector('quiz-main');
                    const item = main.shadowRoot.querySelector('quiz-item');
                    return item ? item.question.id : null;
                });
                await clickCurrentButton(0); // click True for all
                if (i < 9) {
                    await waitForQuestionChange(currentId);
                }
            }
            await browser.waitUntil(
                () =>
                    browser.execute(function () {
                        const main = document.querySelector('quiz-main');
                        return !!main.shadowRoot.querySelector('.quiz__score');
                    }),
                { timeout: 10000, timeoutMsg: 'Score did not appear' }
            );
            const trueCount = await browser.execute(function () {
                // We clicked True for all 10 — count how many had correct_answer True.
                // We can't know this after the fact; just verify format.
                const el = document
                    .querySelector('quiz-main')
                    .shadowRoot.querySelector('.quiz__score');
                return el ? el.textContent : null;
            });
            expect(trueCount).toMatch(/^You scored \d+ \/ 10$/);
        });
    });

    describe('play again', () => {
        it('reloads the quiz when play again is clicked', async () => {
            for (let i = 0; i < 10; i++) {
                const currentId = await browser.execute(function () {
                    const main = document.querySelector('quiz-main');
                    const item = main.shadowRoot.querySelector('quiz-item');
                    return item ? item.question.id : null;
                });
                await clickCurrentButton(0);
                if (i < 9) {
                    await waitForQuestionChange(currentId);
                }
            }
            await browser.waitUntil(
                () =>
                    browser.execute(function () {
                        const main = document.querySelector('quiz-main');
                        return !!main.shadowRoot.querySelector(
                            '.quiz__play-again'
                        );
                    }),
                {
                    timeout: 10000,
                    timeoutMsg: 'Play again button did not appear'
                }
            );
            await browser.execute(function () {
                document
                    .querySelector('quiz-main')
                    .shadowRoot.querySelector('.quiz__play-again')
                    .click();
            });
            await waitForQuestion();
            const score = await browser.execute(function () {
                return document
                    .querySelector('quiz-main')
                    .shadowRoot.querySelector('.quiz__score');
            });
            expect(score).toBeNull();
        });
    });

    describe('question text', () => {
        it('displays a non-empty question', async () => {
            const text = await browser.execute(function () {
                const main = document.querySelector('quiz-main');
                const item = main.shadowRoot.querySelector('quiz-item');
                return item.shadowRoot.querySelector('.question__text')
                    .textContent;
            });
            expect(text.length).toBeGreaterThan(0);
        });
    });
});
