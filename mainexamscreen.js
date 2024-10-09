// Import the necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, collection, getDocs, query } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCja31wklmLjFLwa4a2NRCiU8lub-MVofw",
    authDomain: "cetapp-5ef90.firebaseapp.com",
    projectId: "cetapp-5ef90",
    storageBucket: "cetapp-5ef90.appspot.com",
    messagingSenderId: "710169034602",
    appId: "1:710169034602:web:47b6b7703fd292e3ebef13"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Sample JSON Data for Questions (initially empty)
let questions = [];

// Initialize State
let currentQuestionIndex = 0;
const questionStates = [];

// Load questions from Firestore based on category and test
async function loadQuestionsFromFirestore(categoryId, testId) {
    questions.length = 0; // Clear the questions array
    questionStates.length = 0; // Clear the question states array

    try {
        const q = query(
            collection(db, "Questions")
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Create a question object
            if (data.CATEGORY === categoryId && data.TEST === testId) {
                questions.push({
                    question: data.Question,
                    options: [data.A, data.B, data.C, data.D],
                    correctOption: data.Answer - 1 // Assuming Answer is a one-based index in Firestore
                });
                // Initialize question state as 'notViewed'
                questionStates.push('notViewed');
            }
        });

        // Display the first question if available and generate navigation buttons
        if (questions.length > 0) {
            generateQuestionNavButtons(); // Generate the navigation buttons based on questions array
            loadQuestion(0); // Load the first question
            updateSidebar(); // Update sidebar button states
        } else {
            console.error("No questions found for this category and test.");
        }
    } catch (error) {
        console.error("Error loading questions:", error);
    }
}

// Function to generate navigation buttons dynamically
function generateQuestionNavButtons() {
    const questionNav = document.querySelector('.question-nav');
    questionNav.innerHTML = ''; // Clear any existing buttons

    questions.forEach((_, index) => {
        const button = document.createElement('button');
        button.innerText = index + 1; // Set button text to question number
        button.classList.add('question-button'); // Add a class for easy styling
        button.addEventListener('click', () => loadQuestion(index)); // Load the respective question on click
        questionNav.appendChild(button); // Append button to the nav container
    });
}

// Load question based on index
function loadQuestion(index) {
    currentQuestionIndex = index;
    const question = questions[index];
    document.getElementById('qnumber').innerText = index + 1;
    document.getElementById('question').innerText = question.question;

    question.options.forEach((option, i) => {
        document.getElementById(`option${i + 1}text`).innerText = option;
        document.getElementById(`option${i + 1}`).checked = false; // Clear previous selections
    });

    if (questionStates[currentQuestionIndex] !== 'solved' && questionStates[currentQuestionIndex] !== 'markedForReview') {
        questionStates[currentQuestionIndex] = 'viewed';
    }

    // Highlight selected option if already answered
    if (questionStates[index] === 'solved' || questionStates[index] === 'markedForReview') {
        const savedAnswer = localStorage.getItem(`question${index}`);
        if (savedAnswer) document.getElementById(`option${savedAnswer}`).checked = true;
    }

    updateSidebar();
}

// Load categoryId and testId from URL
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedCatId = urlParams.get('catId'); // Extract catId from the URL
    const selectedTestId = urlParams.get('testId'); // Extract testId from the URL

    loadQuestionsFromFirestore(selectedCatId, selectedTestId);

    // Event Listeners for navigation buttons (moved here to ensure DOM is loaded)
    document.getElementById('saveandnext').addEventListener('click', saveAndNext);
    document.getElementById('mark').addEventListener('click', markForReview);
    document.getElementById('clear').addEventListener('click', clearResponse);
    document.getElementById('submit').addEventListener('click', submitTest);
});

// Save the current answer and move to the next question
function saveAndNext() {
    saveResponse();

    if (currentQuestionIndex < questions.length - 1) {
        loadQuestion(currentQuestionIndex + 1);
    } else {
        alert('Going to question 1');
        loadQuestion(0);
    }
}

// Save the current response
function saveResponse() {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (selectedOption) {
        const optionIndex = selectedOption.id.replace('option', '');
        localStorage.setItem(`question${currentQuestionIndex}`, optionIndex); // Save selected option
        questionStates[currentQuestionIndex] = 'solved';
    }
}

// Mark the current question for review
function markForReview() {
    questionStates[currentQuestionIndex] = 'markedForReview';
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (selectedOption) {
        const optionIndex = selectedOption.id.replace('option', '');
        localStorage.setItem(`question${currentQuestionIndex}`, optionIndex); // Save selected option
    }

    if (currentQuestionIndex < questions.length - 1) {
        loadQuestion(currentQuestionIndex + 1);
    } else {
        alert('Going to question 1');
        loadQuestion(0);
    }

    updateSidebar(currentQuestionIndex);
}

// Clear the current response
function clearResponse() {
    document.querySelectorAll('input[name="option"]').forEach(input => (input.checked = false));
    questionStates[currentQuestionIndex] = 'viewed';
    localStorage.removeItem(`question${currentQuestionIndex}`);
    updateSidebar();
}

// Update the sidebar to reflect the state of the given question index
function updateSidebar(index = null) {
    const questionButtons = document.querySelectorAll('.question-nav button');
    if (index === null) {
        questionButtons.forEach((button, idx) => {
            updateSidebarButton(button, idx);
        });
    } else {
        updateSidebarButton(questionButtons[index], index);
        if (index !== 0) {
            updateSidebarButton(questionButtons[index - 1], index - 1);
        }
    }
}

// Function to update the state of a single button in the sidebar
function updateSidebarButton(button, index) {
    button.classList.remove('bg-success', 'bg-danger', 'bg-primary', 'bg-warning', 'bg-info', 'bg-light');
    switch (questionStates[index]) {
        case 'notViewed':
            button.style.backgroundColor = "white"; // White
            break;
        case 'viewed':
            button.style.backgroundColor = "red"; // Yellow
            break;
        case 'solved':
            button.style.backgroundColor = "green"; // Green
            break;
        case 'markedForReview':
            button.style.backgroundColor = "purple"; // Violet
            break;
        default:
            button.style.backgroundColor = "white"; // Default to light for unknown states
    }
}

// Submit the test and show result
function submitTest() {
    let correctCount = 0;

    questions.forEach((question, index) => {
        const savedAnswer = localStorage.getItem(`question${index}`);
        if (savedAnswer && parseInt(savedAnswer) - 1 === question.correctOption) {
            correctCount++;
        }
    });

    alert(`You scored ${correctCount} out of ${questions.length}`);
}
const urlParams = new URLSearchParams(window.location.search);
const time=urlParams.get('time');
console.log(time);
// Timer Functionality
const timerElement = document.getElementById('time');
let timeRemaining = time * 60; // 5 minutes

function updateTimer() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerElement.innerText = `00 : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;

    if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        submitTest();
    } else {
        timeRemaining--;
    }
}

const timerInterval = setInterval(updateTimer, 1000);
