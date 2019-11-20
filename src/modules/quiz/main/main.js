import { LightningElement, track } from 'lwc';

export default class Main extends LightningElement {
    @track quiz = {
        response_code: 0,
        results: [
            {
                category: 'Entertainment: Video Games',
                type: 'boolean',
                difficulty: 'easy',
                question:
                    'Peter Molyneux was the founder of Bullfrog Productions.',
                correct_answer: 'True',
                incorrect_answers: ['False']
            },
            {
                category: 'Entertainment: Video Games',
                type: 'boolean',
                difficulty: 'easy',
                question:
                    '"Undertale" is an RPG created by Toby Fox and released in 2015.',
                correct_answer: 'True',
                incorrect_answers: ['False']
            },
            {
                category: 'Entertainment: Video Games',
                type: 'boolean',
                difficulty: 'easy',
                question: 'Luigi is taller than Mario?',
                correct_answer: 'True',
                incorrect_answers: ['False']
            },
            {
                category: 'Entertainment: Video Games',
                type: 'boolean',
                difficulty: 'easy',
                question: '"Half-Life 2" runs on the Source Engine.',
                correct_answer: 'True',
                incorrect_answers: ['False']
            },
            {
                category: 'Entertainment: Video Games',
                type: 'boolean',
                difficulty: 'easy',
                question:
                    'Pac-Man was invented by the designer Toru Iwatani while he was eating pizza.',
                correct_answer: 'True',
                incorrect_answers: ['False']
            },
            {
                category: 'Entertainment: Video Games',
                type: 'boolean',
                difficulty: 'easy',
                question:
                    'In &quot;Super Mario Bros.&quot;, the clouds and bushes have the same artwork and are just different colors.',
                correct_answer: 'True',
                incorrect_answers: ['False']
            },
            {
                category: 'Entertainment: Video Games',
                type: 'boolean',
                difficulty: 'easy',
                question:
                    'Deus Ex (2000) does not feature the World Trade Center because it was destroyed by terrorist attacks according to the plot of the game.',
                correct_answer: 'True',
                incorrect_answers: ['False']
            },
            {
                category: 'Entertainment: Video Games',
                type: 'boolean',
                difficulty: 'easy',
                question:
                    'The 2005 video game "Call of Duty 2: Big Red One" is not available on PC.',
                correct_answer: 'True',
                incorrect_answers: ['False']
            },
            {
                category: 'Entertainment: Video Games',
                type: 'boolean',
                difficulty: 'easy',
                question:
                    'In Pok&eacute;mon, Bulbasaur is the only starter pokemon that is a Grass/Poison type.',
                correct_answer: 'True',
                incorrect_answers: ['False']
            },
            {
                category: 'Entertainment: Video Games',
                type: 'boolean',
                difficulty: 'easy',
                question:
                    'In "Undertale", the main character of the game is Sans.',
                correct_answer: 'False',
                incorrect_answers: ['True']
            }
        ]
    };

    get questions() {
        return this.quiz.results;
    }
}
