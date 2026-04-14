import { LightningElement } from 'lwc';

const API_URL = 'https://opentdb.com/api.php?amount=10&type=boolean';
const FEEDBACK_DURATION_MS = 1500;
const TRANSITION_DURATION_MS = 400;

function decodeHtml(str) {
    return new DOMParser().parseFromString(str, 'text/html').body.textContent;
}

export default class Main extends LightningElement {
    _questions = [];
    _loading = true;
    _error = null;
    _currentIndex = 0;
    _score = 0;
    _exiting = false;

    connectedCallback() {
        this._fetchQuestions();
    }

    _fetchQuestions() {
        this._loading = true;
        this._error = null;
        this._currentIndex = 0;
        this._score = 0;
        this._exiting = false;

        fetch(API_URL)
            .then((res) => res.json())
            .then((data) => {
                this._questions = data.results.map((q, idx) => ({
                    ...q,
                    id: idx + 1,
                    question: decodeHtml(q.question)
                }));
                this._loading = false;
            })
            .catch(() => {
                this._error = 'Failed to load questions. Please try again.';
                this._loading = false;
            });
    }

    get currentQuestion() {
        return this._questions[this._currentIndex] || null;
    }

    get isLoading() {
        return this._loading;
    }

    get loadError() {
        return this._error;
    }

    get isComplete() {
        return (
            this._currentIndex >= this._questions.length &&
            this._questions.length > 0
        );
    }

    get progressText() {
        return `Question ${this._currentIndex + 1} of ${this._questions.length}`;
    }

    get scoreText() {
        return `You scored ${this._score} / ${this._questions.length}`;
    }

    get questionWrapperClass() {
        return this._exiting
            ? 'quiz__question-wrap quiz__question-wrap--exiting'
            : 'quiz__question-wrap';
    }

    handleAnswer(event) {
        if (event.detail.correct) {
            this._score += 1;
        }
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
            this._exiting = true;
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            setTimeout(() => {
                this._currentIndex += 1;
                this._exiting = false;
            }, TRANSITION_DURATION_MS);
        }, FEEDBACK_DURATION_MS);
    }

    handlePlayAgain() {
        this._fetchQuestions();
    }
}
