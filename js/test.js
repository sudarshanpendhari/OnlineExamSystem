// Import the necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

function _0x26fb(_0x38bebd,_0x42a631){const _0x2858f9=_0x2858();return _0x26fb=function(_0x26fb9d,_0x57202f){_0x26fb9d=_0x26fb9d-0x188;let _0x5d82b8=_0x2858f9[_0x26fb9d];return _0x5d82b8;},_0x26fb(_0x38bebd,_0x42a631);}const _0xb9cde6=_0x26fb;function _0x2858(){const _0x59d36b=['429WThPAh','198910kEMOfK','2049624unGJUC','5HcCtLh','3019284PIaUOU','2670724KKKtRo','31757IZIjjR','8FYBoeT','1349719pCupCZ','710169034602','1:710169034602:web:47b6b7703fd292e3ebef13','cetapp-5ef90.firebaseapp.com','4773354SdSHEt','AIzaSyCja31wklmLjFLwa4a2NRCiU8lub-MVofw','54pOVGND'];_0x2858=function(){return _0x59d36b;};return _0x2858();}(function(_0x54a331,_0x40992b){const _0x513465=_0x26fb,_0x330c33=_0x54a331();while(!![]){try{const _0x22ad9e=parseInt(_0x513465(0x193))/0x1*(parseInt(_0x513465(0x18c))/0x2)+parseInt(_0x513465(0x18f))/0x3+-parseInt(_0x513465(0x192))/0x4*(-parseInt(_0x513465(0x190))/0x5)+-parseInt(_0x513465(0x18a))/0x6+parseInt(_0x513465(0x195))/0x7*(parseInt(_0x513465(0x194))/0x8)+-parseInt(_0x513465(0x191))/0x9+-parseInt(_0x513465(0x18e))/0xa*(parseInt(_0x513465(0x18d))/0xb);if(_0x22ad9e===_0x40992b)break;else _0x330c33['push'](_0x330c33['shift']());}catch(_0x589beb){_0x330c33['push'](_0x330c33['shift']());}}}(_0x2858,0x78b19));const fconf={'apiKey':_0xb9cde6(0x18b),'authDomain':_0xb9cde6(0x189),'projectId':'cetapp-5ef90','storageBucket':'cetapp-5ef90.appspot.com','messagingSenderId':_0xb9cde6(0x196),'appId':_0xb9cde6(0x188)};
// Initialize Firebase
const app = initializeApp(fconf);
const db = getFirestore(app);
const auth = getAuth(app);

let questions = [];
questions = JSON.parse(localStorage.getItem("questions"));
let questionsl; // Initialize questions length
let questionset = [];

// Load questions from Firestore based on category and test
async function loadQuestionsFromFirestore(categoryId, testId) {
  questionsl = 0;
  try {
    questions.forEach((q) => {
      if (q.category == categoryId && q.test == testId) {
        questionset.push(q);
        questionsl++;
      }
    });
    console.log(JSON.stringify(questionset));
    localStorage.setItem("questionsset", JSON.stringify(questionset));

    document.getElementById("maxmarks").innerText =
      parseInt(questionsl) * parseInt(pm);
    document.getElementById("noofq").innerText = questionsl;
    // Display the first question if available and generate navigation buttons
    if (questions.length > 0) {
      // Additional code for rendering questions can be added here
    } else {
      console.error("No questions found for this category and test.");
    }
  } catch (error) {
    console.error("Error loading questions:", error);
  }
}

// Get test and category information from local storage
const selectedCatId = localStorage.getItem("catId");
const selectedTestId = localStorage.getItem("testId");
const duration = localStorage.getItem("duration");
const pm = localStorage.getItem("posMarks");
const nm = localStorage.getItem("negMarks");
const cn = localStorage.getItem("catName");
const u = localStorage.getItem("user");

document.addEventListener("DOMContentLoaded", () => {
  loadQuestionsFromFirestore(selectedCatId, selectedTestId);
  document.getElementById("time").innerText = duration;
  document.getElementById("time1").innerText = duration;
  document.getElementById("posmark").innerText = pm;
  document.getElementById("negmark").innerText = nm;
  document.getElementById("t12").innerText = `${cn}: ${selectedTestId}`;
  document.getElementById("un").innerText = u;
});

// Previous Button functionality
document.getElementById("previous").addEventListener("click", () => {
  // Set data to local storage instead of using URL parameters
  localStorage.setItem("catId", selectedCatId);
  localStorage.setItem("testId", selectedTestId);
  localStorage.setItem("duration", duration);
  localStorage.setItem("catName", cn);
  localStorage.setItem("user", u);

  // Navigate to testinfo.html
  window.location.href = "testinfo.html";
});

// Ready to Begin Button functionality
document.getElementById("ready").addEventListener("click", () => {
  // Set data to local storage instead of using URL parameters
  localStorage.setItem("catId", selectedCatId);
  localStorage.setItem("testId", selectedTestId);
  localStorage.setItem("duration", duration);
  localStorage.setItem("catName", cn);
  localStorage.setItem("user", u);

  // Navigate to mainexamscreen.html
  window.location.href = "mainexamscreen.html";
});
