import { buildCustomElementConstructor } from 'lwc';
import QuizMain from 'quiz/main';

customElements.define('quiz-main', buildCustomElementConstructor(QuizMain));
