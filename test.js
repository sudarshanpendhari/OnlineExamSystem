// After your existing code for loading tests and rendering UI
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

let questions = [];
let questionsl;
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
                questionsl=questionsl+1;
            }
        });

        // Display the first question if available and generate navigation buttons
        if (questions.length > 0) {
             // Update sidebar button states
        } else {
            console.error("No questions found for this category and test.");
        }
    } catch (error) {
        console.error("Error loading questions:", error);
    }
}
console.log(questions);console.log(questionsl);
;
// Get the test ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const selectedCatId = urlParams.get('catId'); // Extract the catId from the URL
const selectedTestId = urlParams.get('testId'); // Extract the testId from the URL
const duration=urlParams.get('duration');
const pm=urlParams.get('PM');
const nm=urlParams.get('NM');

document.addEventListener("DOMContentLoaded", () => {
    loadQuestionsFromFirestore(selectedCatId,selectedTestId);
    document.getElementById('time').innerText = duration;
    document.getElementById('time1').innerText = duration;
    document.getElementById('posmark').innerText = pm;
    document.getElementById('negmark').innerText = nm;
    console.log(questions.length);
    document.getElementById('maxmarks').innerText = parseInt(questions.length) * parseInt(pm);
    document.getElementById('noofq').innerText = questionsl;
});

// Previous Button functionality
document.getElementById("previous").addEventListener("click", () => {
    // Navigate to testinfo.html and send the catId and testId
    window.location.href = `testinfo.html?catId=${selectedCatId}&testId=${selectedTestId}`;
});

// Ready to Begin Button functionality
document.getElementById("ready").addEventListener("click", () => {
    // Navigate to mainexamscreen.html and send the catId and testId
    window.location.href = `mainexamscreen.html?catId=${selectedCatId}&testId=${selectedTestId}&time=${duration}`;
});
