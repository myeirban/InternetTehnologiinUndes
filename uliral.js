let questions = [];
let currentIndex = 0;
let shuffledIndices = [];

const questionContainer = document.getElementById("question-container");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const backBtn = document.getElementById("back-btn");

// Fetch questions from JSON file
async function loadQuestions() {
  try {
    const response = await fetch("uliral.json");
    const data = await response.json();
    questions = Object.values(data);

    // Create and shuffle indices
    shuffledIndices = Array.from({ length: questions.length }, (_, i) => i);
    shuffleArray(shuffledIndices);

    renderQuestion();
  } catch (error) {
    console.error("Error loading questions:", error);
    questionContainer.innerHTML =
      '<p class="error-message">Асуултуудыг ачахад алдаа гарлаа</p>';
  }
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function renderQuestion() {
  if (currentIndex >= questions.length) {
    questionContainer.innerHTML =
      '<p class="end-message">Бүх асуултууд дууссан!</p>';
    nextBtn.style.display = "none";
    return;
  }

  const questionIndex = shuffledIndices[currentIndex];
  const question = questions[questionIndex];

  questionContainer.innerHTML = `
    <div class="question-box">
      <p class="question-line">${question.question}</p>
      <p class="answer-line" style="display: none">Хариу: ${question.answer}</p>
      <p class="explanation-line" style="display: none">Тайлбар: ${question.explanation}</p>
      <button class="show-answer-btn" onclick="toggleAnswer()">Хариуг үзэх</button>
    </div>
  `;

  // Update button states
  prevBtn.style.display = currentIndex > 0 ? "block" : "none";
  nextBtn.style.display =
    currentIndex < questions.length - 1 ? "block" : "none";
}

function toggleAnswer() {
  const answerLine = document.querySelector(".answer-line");
  const explanationLine = document.querySelector(".explanation-line");
  const showAnswerBtn = document.querySelector(".show-answer-btn");

  if (answerLine.style.display === "none") {
    answerLine.style.display = "block";
    explanationLine.style.display = "block";
    showAnswerBtn.textContent = "Хариуг нуух";
  } else {
    answerLine.style.display = "none";
    explanationLine.style.display = "none";
    showAnswerBtn.textContent = "Хариуг үзэх";
  }
}

nextBtn.onclick = () => {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion();
  }
};

prevBtn.onclick = () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
};

backBtn.onclick = () => {
  window.location.href = "../../index.html";
};

// Add keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    prevBtn.click();
  } else if (e.key === "ArrowRight") {
    nextBtn.click();
  } else if (e.key === "Enter") {
    // Toggle answer visibility when Enter is pressed
    const answerLines = document.querySelectorAll(
      ".answer-line, .explanation-line"
    );
    answerLines.forEach((line) => {
      line.style.display = line.style.display === "none" ? "block" : "none";
    });
  }
});

// Load questions when the page loads
loadQuestions();
