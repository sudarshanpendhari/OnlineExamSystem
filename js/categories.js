// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCja31wklmLjFLwa4a2NRCiU8lub-MVofw",
  authDomain: "cetapp-5ef90.firebaseapp.com",
  projectId: "cetapp-5ef90",
  storageBucket: "cetapp-5ef90.appspot.com",
  messagingSenderId: "710169034602",
  appId: "1:710169034602:web:47b6b7703fd292e3ebef13",
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Global variables
let selectedCatIndex = 0; // Define selectedCatIndex
let categoryModelList = []; // Define categoryModelList to store category data
let testList = []; // Array to hold test data
const urlParams = new URLSearchParams(window.location.search);
let courseName = localStorage.getItem("CollectionName");
// Load categories on document load
document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("user");
  document.getElementById("uname").innerText = user;
  loadCategories();
});

// Function to load categories from Firestore and render them in the HTML
async function loadCategories() {
  try {
    const categoryContainer = document.querySelector(".row");
    categoryContainer.innerHTML = ""; // Clear previous content
    const user = urlParams.get("uname");

    // Fetch categories from Firestore
    const querySnapshot = await getDocs(collection(db, courseName));
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
        const {
          NAME: catName,
          img_Link: imgLink,
          NO_OF_TESTS: noOfTests,
        } = catDoc.data();

        // Store category data in categoryModelList for later use
        categoryModelList.push({
          id: catId,
          name: catName,
          noOfTests: noOfTests,
        });

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
                            <button class="btn take-test-btn" data-cat-id="${catId}" data-cat-name="${catName}" data-no-of-tests="${noOfTests}">Take Test</button>
                        </div>
                    </div>
                `;

        categoryContainer.appendChild(categoryCard);
      }
    }

    // Attach event listeners to "Take Test" buttons programmatically
    document.querySelectorAll(".take-test-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const catId = e.target.getAttribute("data-cat-id");
        const catName = e.target.getAttribute("data-cat-name");
        const noOfTests = e.target.getAttribute("data-no-of-tests");

        // Save data to local storage
        if (localStorage.length === 0) {
          localStorage.setItem("user", user);
        }
        localStorage.setItem("catId", catId);
        localStorage.setItem("catName", catName);
        localStorage.setItem("noOfTests", noOfTests);

        // Redirect to sets.html without query parameters
        window.location.href = "sets.html";
      });
    });
  } catch (error) {
    console.error("Error loading categories: ", error);
  }
}
