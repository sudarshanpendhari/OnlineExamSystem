// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
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
let selectedCatIndex = 0; // Define selectedCatIndex
let categoryModelList = []; // Define categoryModelList to store category data
let testList = []; // Array to hold test data

// Load categories on document load
document.addEventListener("DOMContentLoaded", () => {
    loadCategories();
});
const user=urlParams.get('user');
// Function to load categories from Firestore and render them in the HTML
async function loadCategories() {
    try {
        // Select the row container for categories
        const categoryContainer = document.querySelector(".row");
        categoryContainer.innerHTML = ""; // Clear previous content

        // Fetch categories from Firestore
        const querySnapshot = await getDocs(collection(db, "QUIZ"));
        const docList = {};

        // Store documents in a dictionary for easy access
        querySnapshot.forEach((doc) => {
            docList[doc.id] = doc;
        });

        // Get 'Categories' document
        const catListDoc = docList["Categories"];
        if (!catListDoc) return;

        const catData = catListDoc.data();
        const catCount = catData["COUNT"];

        // Iterate through categories based on count
        for (let i = 1; i <= catCount; i++) {
            const catId = catData[`CAT${i}_ID`];
            const catDoc = docList[catId];

            if (catDoc) {
                const { NAME: catName, IMG_LINK: imgLink, NO_OF_TESTS:noOfTests } = catDoc.data();

                // Store category data in categoryModelList for later use
                categoryModelList.push({ id: catId, name: catName, noOfTests: noOfTests }); // Assuming 3 tests for now

                // Create and append HTML dynamically for each category
                const categoryCard = document.createElement("div");
                categoryCard.classList.add("col-md-3");

                categoryCard.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <img class="imgLink" alt="${catName} Icon" height="50" src="${imgLink}" width="50" />
                            <div class="progress">
                                <div class="progress-bar" style="width: 50%;"></div>
                            </div>
                            <p class="catName">${catName}</p>
                            <button class="btn take-test-btn" noofTest="${noOfTests}" data-cat-id="${catId}">Take Test</button>
                        </div>
                    </div>
                `;

                // Append the category card to the container
                categoryContainer.appendChild(categoryCard);
            }
        }

        // Attach event listeners to "Take Test" buttons programmatically
        const testButtons = document.querySelectorAll(".take-test-btn");
        testButtons.forEach((button) => {
            const catId = button.getAttribute("data-cat-id"); // Get the associated catId from the button's data attribute
            const noofTest = button.getAttribute("noofTest");
            button.addEventListener("click", () => navigateToSets(catId,noofTest));
        });
    } catch (error) {
        console.error("Error loading categories: ", error);
    }
}

// Function to navigate to sets page with the selected category ID
function navigateToSets(catId,noofTest) {
    window.location.href = `sets.html?catId=${catId}&nooftests=${noofTest}`;
}
