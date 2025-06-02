import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
function _0x26fb(_0x38bebd, _0x42a631) {
  const _0x2858f9 = _0x2858();
  return (
    (_0x26fb = function (_0x26fb9d, _0x57202f) {
      _0x26fb9d = _0x26fb9d - 0x188;
      let _0x5d82b8 = _0x2858f9[_0x26fb9d];
      return _0x5d82b8;
    }),
    _0x26fb(_0x38bebd, _0x42a631)
  );
}
const _0xb9cde6 = _0x26fb;
function _0x2858() {
  const _0x59d36b = [
    "429WThPAh",
    "198910kEMOfK",
    "2049624unGJUC",
    "5HcCtLh",
    "3019284PIaUOU",
    "2670724KKKtRo",
    "31757IZIjjR",
    "8FYBoeT",
    "1349719pCupCZ",
    "710169034602",
    "1:710169034602:web:47b6b7703fd292e3ebef13",
    "cetapp-5ef90.firebaseapp.com",
    "4773354SdSHEt",
    "AIzaSyCja31wklmLjFLwa4a2NRCiU8lub-MVofw",
    "54pOVGND",
  ];
  _0x2858 = function () {
    return _0x59d36b;
  };
  return _0x2858();
}
(function (_0x54a331, _0x40992b) {
  const _0x513465 = _0x26fb,
    _0x330c33 = _0x54a331();
  while (!![]) {
    try {
      const _0x22ad9e =
        (parseInt(_0x513465(0x193)) / 0x1) *
          (parseInt(_0x513465(0x18c)) / 0x2) +
        parseInt(_0x513465(0x18f)) / 0x3 +
        (-parseInt(_0x513465(0x192)) / 0x4) *
          (-parseInt(_0x513465(0x190)) / 0x5) +
        -parseInt(_0x513465(0x18a)) / 0x6 +
        (parseInt(_0x513465(0x195)) / 0x7) *
          (parseInt(_0x513465(0x194)) / 0x8) +
        -parseInt(_0x513465(0x191)) / 0x9 +
        (-parseInt(_0x513465(0x18e)) / 0xa) *
          (parseInt(_0x513465(0x18d)) / 0xb);
      if (_0x22ad9e === _0x40992b) break;
      else _0x330c33["push"](_0x330c33["shift"]());
    } catch (_0x589beb) {
      _0x330c33["push"](_0x330c33["shift"]());
    }
  }
})(_0x2858, 0x78b19);
const fconf = {
  apiKey: _0xb9cde6(0x18b),
  authDomain: _0xb9cde6(0x189),
  projectId: "cetapp-5ef90",
  storageBucket: "cetapp-5ef90.appspot.com",
  messagingSenderId: _0xb9cde6(0x196),
  appId: _0xb9cde6(0x188),
};

// Initialize Firebase
const app = initializeApp(fconf);
const db = getFirestore(app);
const auth = getAuth(app);

// Initialize State
let currentQuestionIndex = 0;

let questions = [];
questions = JSON.parse(localStorage.getItem("questionsset"));
let questionStates = [];
// Timer variables
let u = localStorage.getItem("user");
let timerInterval;
let remainingMinutes = localStorage.getItem("duration"); // Initialize with exam duration in minutes
let remainingSeconds = 0; // Initialize with 0 seconds

// Load questions from Firestore based on category and test
async function loadQuestionsFromFirestore(categoryId, testId) {
  try {
    questions.forEach((q) => {
      questionStates.push("notViewed");
    });
    // Display the first question if available and generate navigation buttons
    if (questions.length > 0) {
      generateQuestionNavButtons(); // Generate the navigation buttons based on questions array
      loadQuestion(0); // Load the first question
      updateSidebar(); // Update sidebar button states
      startTimer(); // Start the timer when the exam begins
    } else {
      console.error("No questions found for this category and test.");
    }
  } catch (error) {
    console.error("Error loading questions:", error);
  }
}

// Function to generate navigation buttons dynamically
function generateQuestionNavButtons() {
  const questionNav = document.querySelector(".question-nav");
  questionNav.innerHTML = ""; // Clear any existing buttons

  questions.forEach((_, index) => {
    const button = document.createElement("button");
    button.innerText = index + 1; // Set button text to question number
    button.classList.add("question-button"); // Add a class for easy styling
    button.addEventListener("click", () => loadQuestion(index)); // Load the respective question on click
    questionNav.appendChild(button); // Append button to the nav container
  });
}

// Load question based on index
function loadQuestion(index) {
  currentQuestionIndex = index;
  const question = questions[index];
  document.getElementById("qnumber").innerText = index + 1;

  if (question.isMath === 0) {
    // Plain text question
    document.getElementById("question").innerText = question.question;
  } else if (question.isMath === 1) {
    // Convert text into mathematical form (using any Math rendering library, e.g., MathJax)
    const questionElement = document.getElementById("question");
    questionElement.innerText = ""; // Clear current text
    MathJax.typesetClear([questionElement]); // Clear previous MathJax rendering
    questionElement.innerHTML = `\\(${question.question}\\)`;
    MathJax.typesetPromise([questionElement]);
  } else if (question.isMath === 2) {
    // Display image question
    document.getElementById(
      "question"
    ).innerHTML = `<img src="${question.question}" alt="Math Question" class="img-fluid"/>`;
  }

  question.options.forEach((option, i) => {
    document.getElementById(`option${i + 1}text`).innerText = option;
    document.getElementById(`option${i + 1}`).checked = false;
  });

  if (
    questionStates[currentQuestionIndex] !== "solved" &&
    questionStates[currentQuestionIndex] !== "markedForReview"
  ) {
    questionStates[currentQuestionIndex] = "viewed";
  }

  if (
    questionStates[index] === "solved" ||
    questionStates[index] === "markedForReview"
  ) {
    const savedAnswer = localStorage.getItem(`question${index}`);
    if (savedAnswer)
      document.getElementById(`option${savedAnswer}`).checked = true;
  }

  updateSidebar();
}

let fullscreenExitCount = 0;

function openFullscreen() {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.error(
        "Error attempting to enable full-screen mode:",
        err.message
      );
    });
  }
}

// Detect full-screen exit
function onFullscreenChange() {
  if (!document.fullscreenElement) {
    fullscreenExitCount++;

    if (fullscreenExitCount >= 2) {
      // Automatically submit exam after two fullscreen exits
      submitTest();
    } else {
      stopExamDueToFullscreenExit();
    }
  }
}

// Show the exam start dialog
function showExamStartDialog() {
  const dialog = document.getElementById("examStartDialog");

  dialog.style.display = "flex";
}

// Start the exam in full-screen mode
function startExam() {
  openFullscreen();
  document.getElementById("examStartDialog").style.display = "none";
  initializeExam();
}

function initializeExam() {
  console.log("Exam started");
}

// Show warning dialog on first fullscreen exit
function stopExamDueToFullscreenExit() {
  clearInterval(timerInterval);

  const dialog = document.getElementById("fullscreenWarningDialog");
  dialog.style.display = "flex";
}

// Resume exam when user goes back to fullscreen
function resumeExam() {
  openFullscreen();
  document.getElementById("fullscreenWarningDialog").style.display = "none";
  timerInterval = setInterval(updateTimer, 1000);
  initializeExam();
}

// Timer functionality
function startTimer() {
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  if (remainingSeconds === 0 && remainingMinutes === 0) {
    clearInterval(timerInterval); // Stop the timer
    submitTest(); // Submit the exam automatically
    return; // Exit the function
  }

  if (remainingSeconds === 0) {
    // Move to the previous minute
    remainingMinutes--;
    remainingSeconds = 59;
  } else {
    // Decrease the seconds
    remainingSeconds--;
  }

  document.getElementById("timer").innerText = formatTime(
    remainingMinutes,
    remainingSeconds
  );
}

function formatTime(minutes, seconds) {
  return `${padZero(minutes)}:${padZero(seconds)}`;
}

function padZero(value) {
  return value < 10 ? `0${value}` : value;
}

// Event listeners
document.getElementById("startExamButton").addEventListener("click", startExam);
document
  .getElementById("resumeExamButton")
  .addEventListener("click", resumeExam);
document.addEventListener("fullscreenchange", onFullscreenChange);
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.length === 1 || localStorage.getItem("catId") === null) {
    const dialog = document.getElementById("localempty");
    const dialog2 = document.querySelector("exam-dialog-content");
    document.getElementById("foot").classList.remove("footer");
    document.getElementById("submit").style.position = "revert";
    document.getElementById("saveandnext").style.position = "revert";
    dialog.style.display = "flex";
    dialog2.style.display = "none";
  } else {
    const dialog = document.getElementById("localempty");
    dialog.style.display = "none";
  }
  document.getElementById("backSubmit").addEventListener("click", () => {
    window.location.href = "categories.html";
  });
  const selectedCatId = localStorage.getItem("catId");
  const selectedTestId = localStorage.getItem("testId");
  const cn = localStorage.getItem("catName");
  const u = localStorage.getItem("user");

  loadQuestionsFromFirestore(selectedCatId, selectedTestId);
  document.getElementById("title").innerText = `${cn}: ${selectedTestId}`;
  document.getElementById("profilenm").innerText = u;

  document.getElementById("saveandnext").addEventListener("click", saveAndNext);
  document.getElementById("mark").addEventListener("click", markForReview);
  document.getElementById("clear").addEventListener("click", clearResponse);
  document.getElementById("submit").addEventListener("click", submitTest);

  showExamStartDialog();
});

// Save the current answer and move to the next question
function saveAndNext() {
  saveResponse();

  if (currentQuestionIndex < questions.length - 1) {
    loadQuestion(currentQuestionIndex + 1);
  } else {
    alert("Going to question 1");
    loadQuestion(0);
  }
}

// Save the current response
function saveResponse() {
  const selectedOption = document.querySelector('input[name="option"]:checked');
  if (selectedOption) {
    const optionIndex = selectedOption.id.replace("option", "");
    // Get existing array or initialize a new one
    let answerList =
      JSON.parse(localStorage.getItem("questionAnswerList")) || [];

    // Update the answer for the current question index
    answerList[currentQuestionIndex] = optionIndex;

    // Save updated array back to localStorage
    localStorage.setItem("questionAnswerList", JSON.stringify(answerList));
    questionStates[currentQuestionIndex] = "solved";
  }
}

// Mark the current question for review
function markForReview() {
  questionStates[currentQuestionIndex] = "markedForReview";
  const selectedOption = document.querySelector('input[name="option"]:checked');
  if (selectedOption) {
    const optionIndex = selectedOption.id.replace("option", "");
    // Get existing array or initialize a new one
    let answerList =
      JSON.parse(localStorage.getItem("questionAnswerList")) || [];

    // Update the answer for the current question index
    answerList[currentQuestionIndex] = optionIndex;

    // Save updated array back to localStorage
    localStorage.setItem("questionAnswerList", JSON.stringify(answerList));
  }

  if (currentQuestionIndex < questions.length - 1) {
    loadQuestion(currentQuestionIndex + 1);
  } else {
    alert("Going to question 1");
    loadQuestion(0);
  }

  updateSidebar(currentQuestionIndex);
}

// Clear the current response
function clearResponse() {
  document
    .querySelectorAll('input[name="option"]')
    .forEach((input) => (input.checked = false));
  questionStates[currentQuestionIndex] = "viewed";
  // Update the array in localStorage
  let answerList = JSON.parse(localStorage.getItem("questionAnswerList")) || [];

  // Remove the answer for current question
  answerList[currentQuestionIndex] = null;

  // Save updated array
  localStorage.setItem("questionAnswerList", JSON.stringify(answerList));
  updateSidebar();
}

// Update the sidebar to reflect the state of the given question index
function updateSidebar(index = null) {
  const questionButtons = document.querySelectorAll(".question-nav button");
  if (index === null) {
    questionButtons.forEach((button, idx) => {
      updateSidebarButton(button, idx);
    });
  } else {
    updateSidebarButton(questionButtons[index], index);
  }
}

// Function to update the state of a single button in the sidebar
function updateSidebarButton(button, index) {
  button.classList.remove(
    "bg-success",
    "bg-danger",
    "bg-primary",
    "bg-warning",
    "bg-info",
    "bg-light"
  );
  switch (questionStates[index]) {
    case "notViewed":
      button.style.backgroundColor = "white";
      break;
    case "viewed":
      button.style.backgroundColor = "red";
      break;
    case "solved":
      button.style.backgroundColor = "green";
      break;
    case "markedForReview":
      button.style.backgroundColor = "purple";
      break;
    default:
      button.style.backgroundColor = "white";
  }
}
document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  const dialog = document.getElementById("rightClickDialog");
  dialog.showModal(); // Show dialog box
});

// Close dialog on button click
document.getElementById("closeDialog").addEventListener("click", () => {
  document.getElementById("rightClickDialog").close(); // Hide dialog box
});
// Submit the test and show result
function submitTest() {
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  // Get saved answers from localStorage array
  const answerList =
    JSON.parse(localStorage.getItem("questionAnswerList")) || [];

  questions.forEach((question, index) => {
    const savedAnswer = answerList[index];

    if (savedAnswer !== undefined && savedAnswer !== null) {
      if (Number(savedAnswer) - 1 === question.correctOption) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    } else {
      unansweredCount++;
    }
  });

  const totalScore = correctCount * 2; // Assuming +4 for correct, -1 for incorrect
  const initialDurationInSeconds =
    parseInt(localStorage.getItem("duration")) * 60; // Initial duration in seconds
  const timerElement = document.getElementById("timer").innerText.split(":");
  const remainingMinutes = parseInt(timerElement[0]);
  const remainingSeconds = parseInt(timerElement[1]);
  const remainingTimeInSeconds = remainingMinutes * 60 + remainingSeconds;
  const timeTaken = initialDurationInSeconds - remainingTimeInSeconds;

  // Save result data to localStorage for result.js to access
  localStorage.setItem("correctCount", correctCount);
  localStorage.setItem("incorrectCount", incorrectCount);
  localStorage.setItem("unansweredCount", unansweredCount);
  localStorage.setItem("totalScore", totalScore);
  localStorage.setItem("timeTaken", timeTaken);
  // Open result.html in a new tab
  const newTab = window.open("result.html", "_blank");

  // Try to close the current tab
  window.close();

  // If window.close() does not work (usually the case if tab not opened by script),
  // redirect current tab to blank page instead
  setTimeout(() => {
    if (!window.closed) {
      window.location.href = "about:blank";
    }
  }, 5);
}
