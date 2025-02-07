// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

function _0x26fb(_0x38bebd,_0x42a631){const _0x2858f9=_0x2858();return _0x26fb=function(_0x26fb9d,_0x57202f){_0x26fb9d=_0x26fb9d-0x188;let _0x5d82b8=_0x2858f9[_0x26fb9d];return _0x5d82b8;},_0x26fb(_0x38bebd,_0x42a631);}const _0xb9cde6=_0x26fb;function _0x2858(){const _0x59d36b=['429WThPAh','198910kEMOfK','2049624unGJUC','5HcCtLh','3019284PIaUOU','2670724KKKtRo','31757IZIjjR','8FYBoeT','1349719pCupCZ','710169034602','1:710169034602:web:47b6b7703fd292e3ebef13','cetapp-5ef90.firebaseapp.com','4773354SdSHEt','AIzaSyCja31wklmLjFLwa4a2NRCiU8lub-MVofw','54pOVGND'];_0x2858=function(){return _0x59d36b;};return _0x2858();}(function(_0x54a331,_0x40992b){const _0x513465=_0x26fb,_0x330c33=_0x54a331();while(!![]){try{const _0x22ad9e=parseInt(_0x513465(0x193))/0x1*(parseInt(_0x513465(0x18c))/0x2)+parseInt(_0x513465(0x18f))/0x3+-parseInt(_0x513465(0x192))/0x4*(-parseInt(_0x513465(0x190))/0x5)+-parseInt(_0x513465(0x18a))/0x6+parseInt(_0x513465(0x195))/0x7*(parseInt(_0x513465(0x194))/0x8)+-parseInt(_0x513465(0x191))/0x9+-parseInt(_0x513465(0x18e))/0xa*(parseInt(_0x513465(0x18d))/0xb);if(_0x22ad9e===_0x40992b)break;else _0x330c33['push'](_0x330c33['shift']());}catch(_0x589beb){_0x330c33['push'](_0x330c33['shift']());}}}(_0x2858,0x78b19));const fconf={'apiKey':_0xb9cde6(0x18b),'authDomain':_0xb9cde6(0x189),'projectId':'cetapp-5ef90','storageBucket':'cetapp-5ef90.appspot.com','messagingSenderId':_0xb9cde6(0x196),'appId':_0xb9cde6(0x188)};

// Initialize Firebase
const app = initializeApp(fconf);
const db = getFirestore(app);

const submit = document.getElementById('submit');

async function addUser(collegeName, email, name) {
  try {
    // Add a new document with an auto-generated ID
    const docRef = await addDoc(collection(db, "user"), {
      collegeName: collegeName,
      email: email,
      mobile: "xxxxxxxx",
      name: name
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document to Firestore:", e);
  }
}
async function incrementUserCount() {
  const totalUsersDocRef = doc(db, "user", "TOTAL_USERS");

  try {
      // Increment the count field by 1
      await updateDoc(totalUsersDocRef, {
          COUNT: increment(1)
      });
      console.log("User count incremented successfully");
  } catch (e) {
      console.error("Error incrementing user count:", e);
  }
}
submit.addEventListener("click", async function (event) {
  localStorage.clear();
  event.preventDefault();
  const email = document.getElementById('email').value;
  const collegeName = document.getElementById('college').value;
  const name = document.getElementById('name').value;
  const password = document.getElementById('password').value;

  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up successfully
      const user = userCredential.user;
      alert("Creating account...");
      // Call addUser only after successful authentication
      addUser(collegeName, email, name);
      incrementUserCount();
      const dialog = document.getElementById('rightClickDialog');
      dialog.showModal();
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.error("Error creating account:", errorMessage);
      alert(errorMessage);
    });


});
document.getElementById('closeDialog').addEventListener('click', () => {
  navigateToLogin(); // Hide dialog box
});
function navigateToLogin() {
  window.location.href = `index.html`;
}
