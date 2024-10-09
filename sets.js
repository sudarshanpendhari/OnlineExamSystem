// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
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

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
console.log("hi");

// Global variables
let selectedCatId = "";
let not="";
let testList = []; // Array to hold the test data

// Load tests on document load
document.addEventListener("DOMContentLoaded", () => {
    // Get the category ID from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    selectedCatId = urlParams.get('catId'); // Extract the catId from the URL
    not=urlParams.get('nooftests');
    console.log(selectedCatId);
    if (selectedCatId) {
        loadTests(selectedCatId,not);
    } else {
        console.error("No category ID found in the URL.");
    }
});

// Function to load tests for a given category ID from Firestore and render them in the HTML
async function loadTests(catId, nooftests) {
    try {
        // Select the container for displaying test sets
        const testContainer = document.querySelector(".test-row");

        // Check if the testContainer exists
        if (!testContainer) {
            console.error("Test container not found. Make sure your HTML has an element with class 'test-row'.");
            return; // Exit the function if the container doesn't exist
        }

        testContainer.innerHTML = ""; // Clear previous content

        // Fetch tests from Firestore for the given category ID
        const querySnapshot = await getDocs(collection(db, `QUIZ/${catId}/TESTS_LIST`));

        // Check if there are any tests
        if (querySnapshot.empty) {
            console.warn("No tests found for this category.");
            testContainer.innerHTML = "<p>No tests available.</p>"; // Display message if no tests found
            return; // Exit if no tests are found
        }

        // Iterate through the test documents
        querySnapshot.forEach((doc) => {
            const testData = doc.data(); // Get test data for each document
            console.log("Test Data:", testData);

            // Iterate through the tests based on the number of tests (nooftests)
            for (let i = 1; i <= nooftests; i++) {
                const testIdKey = `TEST${i}_ID`; // Dynamic key for test ID
                const testTimeKey = `TEST${i}_TIME`; // Dynamic key for test time

                // Check if the dynamic keys exist in the testData
                if (testData[testIdKey] && testData[testTimeKey]) {
                    const testId = testData[testIdKey];
                    const duration = testData[testTimeKey];
                    const posmarks = testData.PosMarks || 2;
                    const negmarks = testData.NegMarks || 0;

                    // Store test data in the testList for later use
                    testList.push({
                        id: testId, // Test ID
                        duration: duration,
                        questions: testData.QUESTIONS,
                        posmarks: posmarks,
                        negmarks: negmarks,
                    });

                    // Create and append HTML dynamically for each test
                    const testCard = document.createElement("div");
                    testCard.classList.add("col-md-4");

                    testCard.innerHTML = `
                        <div class="card test-card">
                            <div class="card-body">
                                <h5 class="test-name">${testId}</h5> <!-- Using test ID as name -->
                                <p class="test-details">Duration: ${duration} mins</p>
                                <button class="btn btn-primary start-test-btn" duration="${duration}" pm="${posmarks}" nm="${negmarks}" data-test-id="${testId}">Start Test</button>
                            </div>
                        </div>
                    `;

                    // Append the test card to the container
                    testContainer.appendChild(testCard);
                }
            }
        });

        // Attach event listeners to "Start Test" buttons programmatically
        const startTestButtons = document.querySelectorAll(".start-test-btn");
        startTestButtons.forEach((button) => {
            const testId = button.getAttribute("data-test-id");
            const duration = button.getAttribute("duration");
            const posmarks = button.getAttribute("pm");
            const negmarks = button.getAttribute("nm");
            // Get the associated test ID from the button's data attribute
            button.addEventListener("click", () => navigateToTest(testId, duration, posmarks, negmarks));
            console.log(`Attached event listener to: ${testId}`);
        });
    } catch (error) {
        console.error("Error loading tests: ", error);
    }
}

// Function to navigate to test page with the selected test ID
function navigateToTest(testId, duration, posmarks, negmarks) {
    window.location.href = `testinfo.html?catId=${selectedCatId}&testId=${testId}&duration=${duration}&PM=${posmarks}&NM=${negmarks}`;
}
