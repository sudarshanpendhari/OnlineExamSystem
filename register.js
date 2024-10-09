// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import {getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js"; 
// Your web app's Firebase configuration
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
//inputs

// alert("ji");
const submit = document.getElementById('submit');

async function addUser(collegeName, email, name, password) {
    try {
      // Add a new document with an auto-generated ID
      const docRef = await addDoc(collection(db, "user"), {
        collegeName: collegeName,
        email: email,
        mobile: "xxxxxxxx",
        name: name,
        password: password
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

submit.addEventListener("click", async function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const collegeName = document.getElementById('college').value;
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
   // const mobile = document.getElementById('mobile').value;
    
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            alert("creating account....");
            navigateToLogin();
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
            alert(errorMessage);
        });

       addUser(collegeName,email,name,password); 
          
});
function navigateToLogin(user) {
  window.location.href = `index.html`;
}