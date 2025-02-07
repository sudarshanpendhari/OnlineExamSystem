// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import {
  getFirestore,
  query,
  collection,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

function _0x26fb(_0x38bebd,_0x42a631){const _0x2858f9=_0x2858();return _0x26fb=function(_0x26fb9d,_0x57202f){_0x26fb9d=_0x26fb9d-0x188;let _0x5d82b8=_0x2858f9[_0x26fb9d];return _0x5d82b8;},_0x26fb(_0x38bebd,_0x42a631);}const _0xb9cde6=_0x26fb;function _0x2858(){const _0x59d36b=['429WThPAh','198910kEMOfK','2049624unGJUC','5HcCtLh','3019284PIaUOU','2670724KKKtRo','31757IZIjjR','8FYBoeT','1349719pCupCZ','710169034602','1:710169034602:web:47b6b7703fd292e3ebef13','cetapp-5ef90.firebaseapp.com','4773354SdSHEt','AIzaSyCja31wklmLjFLwa4a2NRCiU8lub-MVofw','54pOVGND'];_0x2858=function(){return _0x59d36b;};return _0x2858();}(function(_0x54a331,_0x40992b){const _0x513465=_0x26fb,_0x330c33=_0x54a331();while(!![]){try{const _0x22ad9e=parseInt(_0x513465(0x193))/0x1*(parseInt(_0x513465(0x18c))/0x2)+parseInt(_0x513465(0x18f))/0x3+-parseInt(_0x513465(0x192))/0x4*(-parseInt(_0x513465(0x190))/0x5)+-parseInt(_0x513465(0x18a))/0x6+parseInt(_0x513465(0x195))/0x7*(parseInt(_0x513465(0x194))/0x8)+-parseInt(_0x513465(0x191))/0x9+-parseInt(_0x513465(0x18e))/0xa*(parseInt(_0x513465(0x18d))/0xb);if(_0x22ad9e===_0x40992b)break;else _0x330c33['push'](_0x330c33['shift']());}catch(_0x589beb){_0x330c33['push'](_0x330c33['shift']());}}}(_0x2858,0x78b19));const fconf={'apiKey':_0xb9cde6(0x18b),'authDomain':_0xb9cde6(0x189),'projectId':'cetapp-5ef90','storageBucket':'cetapp-5ef90.appspot.com','messagingSenderId':_0xb9cde6(0x196),'appId':_0xb9cde6(0x188)};
// Initialize Firebase
const app = initializeApp(fconf);

//inputs
const db = getFirestore(app);
// alert("ji");
const submit = document.getElementById("submit");

async function getUserNameByEmail(email) {
  try {
    const q = query(collection(db, "user"), where("email", "==", email));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    } else {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      return userData.name;
    }
  } catch (e) {
    console.error("Error getting document:", e.message, e);
  }
}
submit.addEventListener("click", function (event) {
  localStorage.clear();

  event.preventDefault();
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // Signed in
      const user = userCredential.user;
      // ...
      const name = await getUserNameByEmail(email);
      localStorage.setItem("user", name);
      navigateToCats();
      alert("success");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
});

function navigateToCats() {
  window.location.href = `courses.html`;
}
