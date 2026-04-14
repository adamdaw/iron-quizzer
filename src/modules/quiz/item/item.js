import { LightningElement, api, track } from 'lwc';

export default class Item extends LightningElement {
    @api question = '';
    @track feedback = '';

    compareTrueAnswer() {
        this.feedback =
            this.question.correct_answer === 'True' ? 'Correct!' : 'Incorrect!';
    }

    compareFalseAnswer() {
        this.feedback =
            this.question.correct_answer === 'False'
                ? 'Correct!'
                : 'Incorrect!';
    }
}
