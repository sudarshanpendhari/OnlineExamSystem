import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  query,
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
console.log("hi");
let courseModelList = [];

// Load course on document load
document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("user");
  document.getElementById("uname").innerText = user;
  loadCourses();
  if (localStorage.getItem("questions") == null) {
    loadQuestionsFromFirestore();
  }
});

let questions = [];
async function loadQuestionsFromFirestore() {
  try {
    const questions = []; // Clear the questions array
    const q = query(collection(db, "Questions"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const category = data.CATEGORY;
      const test = data.TEST;

      // Iterate through each question in the 'questions' array
      Object.keys(data.questions).forEach((key) => {
        const questionData = data.questions[key];
        questions.push({
          question: questionData.Question,
          options: [
            questionData.A,
            questionData.B,
            questionData.C,
            questionData.D,
          ],
          isMath: questionData.isMath,
          correctOption: questionData.Answer - 1, // Adjusting to zero-based index
          category: category,
          test: test,
        });
      });
    });

    console.log(questions);
    localStorage.setItem("questions", JSON.stringify(questions));
  } catch (error) {
    console.error("Error loading questions:", error);
  }
}

// Function to load course from Firestore and render them in the HTML
async function loadCourses() {
  try {
    const courseContainer = document.querySelector(".row");
    courseContainer.innerHTML = ""; // Clear previous content

    // Fetch course from Firestore
    const querySnapshot = await getDocs(collection(db, "Course"));
    const docList = {};

    // Store documents in a dictionary for easy access
    querySnapshot.forEach((doc) => {
      docList[doc.id] = doc;
    });
    // Get 'course' document
    const courseListDoc = docList["Courses"];
    if (!courseListDoc) return;

    const courseData = courseListDoc.data();
    const courseCount = courseData["COUNT"];
    //console.log(courseData,courseCount);
    // Iterate through course based on count
    for (let i = 1; i <= courseCount; i++) {
      const courseId = courseData[`Course${i}_ID`];
      const courseDoc = docList[courseId];
      console.log(courseId);
      if (courseDoc) {
        const { CollectionName: CollectionName, CourseName: CourseName } =
          courseDoc.data();

        // Store course data in courseModelList for later use
        courseModelList.push({
          CollectionName: CollectionName,
          CourseName: CourseName,
        });

        // Create and append HTML dynamically for each course
        const courseCard = document.createElement("div");
        courseCard.classList.add("col-md-3");

        courseCard.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            
                            <div class="progress">
                                <div class="progress-bar" style="width: 50%;"></div>
                            </div>
                            <p class="courseName">${CourseName}</p>
                            <button class="btn take-test-btn" " data-course-name="${CourseName}" data-collectionName="${CollectionName}">Visit</button>
                        </div>
                    </div>
                `;

        courseContainer.appendChild(courseCard);
      }
    }

    // Attach event listeners to "Take Test" buttons programmatically
    document.querySelectorAll(".take-test-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const CourseName = e.target.getAttribute("data-course-name");
        const CollectionName = e.target.getAttribute("data-collectionName");

        // Save data to local storage
        if (localStorage.length === 0) {
          localStorage.setItem("user", user);
        }
        localStorage.setItem("CollectionName", CollectionName);
        localStorage.setItem("CourseName", CourseName);

        // Redirect to sets.html without query parameters
        window.location.href = "categories.html";
      });
    });
  } catch (error) {
    console.error("Error loading course: ", error);
  }
}
