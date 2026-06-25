const quizQuestions = [
    {
        key: "budget",
        question: "What's your budget?",
        options: ["low", "medium", "high"]
    },
    {
        key: "climate",
        question: "What climate do you prefer?",
        options: ["tropical", "mild", "temperate"]
    },
    {
        key: "type",
        question: "Sea, city or nature?",
        options: ["sea", "city", "nature"]
    },
    {
        key: "style",
        question: "What's your travel style?",
        options: ["relax", "adventure", "food", "culture"]
    }
];

let currentQuestionIndex = 0;
let userAnswers = {};

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

document.getElementById('startBtn').addEventListener('click', () => {
    currentQuestionIndex = 0;
    userAnswers = {};
    showScreen('quiz');
    renderQuiz();
});

function renderQuiz() {
    const question = quizQuestions[currentQuestionIndex];
    const container = document.getElementById('quizContainer');

    let optionsHtml = question.options
        .map(opt => `<button class="quiz-option" data-value="${opt}">${opt}</button>`)
        .join('');

    container.innerHTML = `
    <h2>${question.question}</h2>
    <div class="options">${optionsHtml}</div>
  `;

    // обновляем прогресс-бар
    const progress = ((currentQuestionIndex) / quizQuestions.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';

    // обработчики кликов по вариантам ответа
    document.querySelectorAll('.quiz-option').forEach(btn => {
        btn.addEventListener('click', () => {
            userAnswers[question.key] = btn.dataset.value;
            nextQuestion();
        });
    });
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
        renderQuiz();
    } else {
        showResult();
    }
}

function showResult() {
    showScreen('result');

    const result = findBestMatch(userAnswers);

    document.getElementById('resultContainer').innerHTML = `
    
    <img src="${result.country.image}" 
         alt="${result.country.name}" 
         class="result-image">

    <h2>${result.country.name}</h2>

    <p class="match-score">
        Your match: ${result.score}%
    </p>

    <p>
        ${result.country.description}
    </p>

    <button id="restartBtn">
        Try again
    </button>
  `;

    document.getElementById('restartBtn')
        .addEventListener('click', () => {
            showScreen('landing');
        });
}

function findBestMatch(answers) {
    let bestMatch = countries[0];
    let bestScore = -1;

    countries.forEach(country => {
        let score = 0;

        if (country.budget === answers.budget) score++;
        if (country.climate === answers.climate) score++;
        if (country.type === answers.type) score++;
        if (country.style === answers.style) score++;

        if (score > bestScore) {
            bestScore = score;
            bestMatch = country;
        }
    });

    return {
        country: bestMatch,
        score: Math.round((bestScore / quizQuestions.length) * 100)
    };
}