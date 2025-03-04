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
// Initialize Firebase and Firestore
const app = initializeApp(fconf);
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
                            <img class="imgLink" alt="${catName} Icon" src="${imgLink}"  />
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
