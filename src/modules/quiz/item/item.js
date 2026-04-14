import { LightningElement, api } from 'lwc';

export default class Item extends LightningElement {
    _question = {};
    _answered = null;

    @api
    get question() {
        return this._question;
    }

    set question(value) {
        this._question = value;
        this._answered = null;
    }

    get isAnswered() {
        return this._answered !== null;
    }

    get feedbackText() {
        if (this._answered === 'correct') return 'Correct!';
        if (this._answered === 'incorrect') return 'Incorrect!';
        return null;
    }

    get feedbackClass() {
        return `question__feedback question__feedback--${this._answered}`;
    }

    handleAnswer(event) {
        const selected = event.target.dataset.value;
        const correct = selected === this._question.correct_answer;
        this._answered = correct ? 'correct' : 'incorrect';
        this.dispatchEvent(new CustomEvent('answer', { detail: { correct } }));
    }
}
