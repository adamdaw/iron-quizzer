/* eslint-disable no-alert */
import { LightningElement, api } from 'lwc';

export default class Item extends LightningElement {
    @api question = '';

    compareTrueAnswer() {
        if (this.question.correct_answer === 'True') {
            alert('Correct!');
        } else {
            alert('Incorrect!');
        }
    }

    compareFalseAnswer() {
        if (this.question.correct_answer === 'False') {
            alert('Correct!');
        } else {
            alert('Incorrect!');
        }
    }
}
