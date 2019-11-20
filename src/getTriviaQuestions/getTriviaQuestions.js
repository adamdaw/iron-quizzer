async export default getTriviaQuestions()
    {
    let response = await fetch('https://opentdb.com/api.php?amount=10&category=15&difficulty=easy&type=boolean');
    let data = await response.json()
        return data;
    }
    