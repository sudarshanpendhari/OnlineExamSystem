import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
function _0x26fb(_0x38bebd,_0x42a631){const _0x2858f9=_0x2858();return _0x26fb=function(_0x26fb9d,_0x57202f){_0x26fb9d=_0x26fb9d-0x188;let _0x5d82b8=_0x2858f9[_0x26fb9d];return _0x5d82b8;},_0x26fb(_0x38bebd,_0x42a631);}const _0xb9cde6=_0x26fb;function _0x2858(){const _0x59d36b=['429WThPAh','198910kEMOfK','2049624unGJUC','5HcCtLh','3019284PIaUOU','2670724KKKtRo','31757IZIjjR','8FYBoeT','1349719pCupCZ','710169034602','1:710169034602:web:47b6b7703fd292e3ebef13','cetapp-5ef90.firebaseapp.com','4773354SdSHEt','AIzaSyCja31wklmLjFLwa4a2NRCiU8lub-MVofw','54pOVGND'];_0x2858=function(){return _0x59d36b;};return _0x2858();}(function(_0x54a331,_0x40992b){const _0x513465=_0x26fb,_0x330c33=_0x54a331();while(!![]){try{const _0x22ad9e=parseInt(_0x513465(0x193))/0x1*(parseInt(_0x513465(0x18c))/0x2)+parseInt(_0x513465(0x18f))/0x3+-parseInt(_0x513465(0x192))/0x4*(-parseInt(_0x513465(0x190))/0x5)+-parseInt(_0x513465(0x18a))/0x6+parseInt(_0x513465(0x195))/0x7*(parseInt(_0x513465(0x194))/0x8)+-parseInt(_0x513465(0x191))/0x9+-parseInt(_0x513465(0x18e))/0xa*(parseInt(_0x513465(0x18d))/0xb);if(_0x22ad9e===_0x40992b)break;else _0x330c33['push'](_0x330c33['shift']());}catch(_0x589beb){_0x330c33['push'](_0x330c33['shift']());}}}(_0x2858,0x78b19));const fconf={'apiKey':_0xb9cde6(0x18b),'authDomain':_0xb9cde6(0x189),'projectId':'cetapp-5ef90','storageBucket':'cetapp-5ef90.appspot.com','messagingSenderId':_0xb9cde6(0x196),'appId':_0xb9cde6(0x188)};
// Initialize Firebase
const app = initializeApp(fconf);
const db = getFirestore(app);
const auth = getAuth();
// Replace with actual category ID and test ID
const catId = localStorage.getItem("catId");
const catname = localStorage.getItem("catName");
const testId = localStorage.getItem("testId");
const collectionName = localStorage.getItem("CollectionName");
// Load ranks from Firestore, sorted by score in descending order
async function loadRanks() {
  document.getElementById("testname").innerText =
    "Results for " + catname + "-" + testId + " Test";
  document.getElementById("title").innerText =
    "Results for " + catname + "-" + testId + " Test";

  const tableBody = document.getElementById("tableb");
  tableBody.innerHTML = ""; // Clear any existing rows

  try {
    // console.log(auth.uid());
    const ranksRef = collection(
      db,
      `${collectionName}/${catId}/TESTS_LIST/TESTS_INFO/${testId}_Ranks`
    );
    const q = query(ranksRef, orderBy("marks", "desc")); // Sort by score in descending order
    const querySnapshot = await getDocs(q);
    let rank = 1; // Initialize rank
    querySnapshot.forEach((doc) => {
      const data = doc.data();

      // Create a row for each document
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${rank++}</td>
                <td>${data.username}</td>
                <td>${data.correct}</td>
                <td>${data.incorrect}</td>
                <td>${data.unattempted}</td>
                <td>${data.marks}</td>
            `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading ranks:", error);
  }
}

// Initialize the ranks loading on page load
document.addEventListener("DOMContentLoaded", loadRanks);
