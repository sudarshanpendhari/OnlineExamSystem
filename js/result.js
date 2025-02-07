// Import necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDocs,
  query,
  where,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

function _0x26fb(_0x38bebd,_0x42a631){const _0x2858f9=_0x2858();return _0x26fb=function(_0x26fb9d,_0x57202f){_0x26fb9d=_0x26fb9d-0x188;let _0x5d82b8=_0x2858f9[_0x26fb9d];return _0x5d82b8;},_0x26fb(_0x38bebd,_0x42a631);}const _0xb9cde6=_0x26fb;function _0x2858(){const _0x59d36b=['429WThPAh','198910kEMOfK','2049624unGJUC','5HcCtLh','3019284PIaUOU','2670724KKKtRo','31757IZIjjR','8FYBoeT','1349719pCupCZ','710169034602','1:710169034602:web:47b6b7703fd292e3ebef13','cetapp-5ef90.firebaseapp.com','4773354SdSHEt','AIzaSyCja31wklmLjFLwa4a2NRCiU8lub-MVofw','54pOVGND'];_0x2858=function(){return _0x59d36b;};return _0x2858();}(function(_0x54a331,_0x40992b){const _0x513465=_0x26fb,_0x330c33=_0x54a331();while(!![]){try{const _0x22ad9e=parseInt(_0x513465(0x193))/0x1*(parseInt(_0x513465(0x18c))/0x2)+parseInt(_0x513465(0x18f))/0x3+-parseInt(_0x513465(0x192))/0x4*(-parseInt(_0x513465(0x190))/0x5)+-parseInt(_0x513465(0x18a))/0x6+parseInt(_0x513465(0x195))/0x7*(parseInt(_0x513465(0x194))/0x8)+-parseInt(_0x513465(0x191))/0x9+-parseInt(_0x513465(0x18e))/0xa*(parseInt(_0x513465(0x18d))/0xb);if(_0x22ad9e===_0x40992b)break;else _0x330c33['push'](_0x330c33['shift']());}catch(_0x589beb){_0x330c33['push'](_0x330c33['shift']());}}}(_0x2858,0x78b19));const fconf={'apiKey':_0xb9cde6(0x18b),'authDomain':_0xb9cde6(0x189),'projectId':'cetapp-5ef90','storageBucket':'cetapp-5ef90.appspot.com','messagingSenderId':_0xb9cde6(0x196),'appId':_0xb9cde6(0x188)};
// Initialize Firebase
const app = initializeApp(fconf);
const db = getFirestore(app);
const collectionName = localStorage.getItem("CollectionName");
document.addEventListener("DOMContentLoaded", async () => {
  // Retrieve result data from localStorage
  if (localStorage.length === 1) {
    const dialog = document.getElementById("localempty");
    dialog.style.display = "flex";
  } else {
    const dialog = document.getElementById("localempty");
    dialog.style.display = "none";
  }
  document.getElementById("backSubmit").addEventListener("click", () => {
    window.location.href = "categories.html";
  });
  const correctCount = parseInt(localStorage.getItem("correctCount"));
  const incorrectCount = parseInt(localStorage.getItem("incorrectCount"));
  const unansweredCount = parseInt(localStorage.getItem("unansweredCount"));
  const totalScore = parseFloat(localStorage.getItem("totalScore"));
  const timeTaken = parseInt(localStorage.getItem("timeTaken"));

  // Convert time taken to minutes and seconds format
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  // Set result data in result.html
  document.getElementById("correct").innerText = correctCount;
  document.getElementById("inc").innerText = incorrectCount;
  document.getElementById("notans").innerText = unansweredCount;
  document.getElementById("posneg").innerText = `${totalScore}`;
  document.getElementById("score").innerText = `${totalScore}`;
  document.getElementById("timereq").innerText = formattedTime;

  // Get URL parameters
  const testName = localStorage.getItem("testId");
  const username = localStorage.getItem("user");
  const catId = localStorage.getItem("catId");
  const testId = localStorage.getItem("testId");

  // Add rank data to Firestore only if user hasn't attempted before
  try {
    const ranksRef = collection(
      db,
      `${collectionName}/${catId}/TESTS_LIST/TESTS_INFO/${testId}_Ranks`
    );
    const existingQuery = query(ranksRef, where("username", "==", username));
    const existingDocs = await getDocs(existingQuery);

    if (existingDocs.empty) {
      // Add new rank entry if user doesn't exist in collection
      await addDoc(ranksRef, {
        username: username,
        correct: correctCount,
        incorrect: incorrectCount,
        unattempted: unansweredCount,
        marks: totalScore,
      });
      console.log("Rank entry added to Firestore.");
    } else {
      console.log("User has already attempted the test. No new entry added.");
    }
  } catch (error) {
    console.error("Error adding rank data to Firestore:", error);
  }
  document.getElementById("rank").addEventListener("click", () => {
    window.location.href = "ranks.html";
  });
  document.getElementById("checkAns").addEventListener("click", () => {
    window.location.href = "answer.html";
  });

  // Add/update test result in User collection
  try {
    const usersRef = collection(db, "user");
    const userQuery = query(usersRef, where("name", "==", username));
    const userDocs = await getDocs(userQuery);

    if (!userDocs.empty) {
      // Get user document ID
      const userDocId = userDocs.docs[0].id;
      const testResultsRef = collection(db, `user/${userDocId}/TestResults`);

      // Check if a matching document exists in TestResults subcollection
      const testResultsQuery = query(
        testResultsRef,
        where("course", "==", "MHT-CET"),
        where("categoryId", "==", catId),
        where("testId", "==", testId)
      );
      const testResultsDocs = await getDocs(testResultsQuery);

      if (!testResultsDocs.empty) {
        // Update existing document with new maxMarks
        const existingDoc = testResultsDocs.docs[0];
        await updateDoc(existingDoc.ref, { lastMarks: totalScore });
        console.log(
          "Existing test result updated in User's TestResults subcollection."
        );
      } else {
        // Add a new document to TestResults subcollection if no match found
        await addDoc(testResultsRef, {
          course: "MHT-CET",
          categoryId: catId,
          testId: testId,
          lastMarks: totalScore,
        });
        console.log("Test result added to User's TestResults subcollection.");
      }
    } else {
      console.log("User document not found in User collection.");
    }
  } catch (error) {
    console.error(
      "Error adding/updating test results in User collection:",
      error
    );
  }
});
