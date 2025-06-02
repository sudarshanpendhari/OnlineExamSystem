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

    for (let i = 1; i <= courseCount; i++) {
      const courseId = courseData[`Course${i}_ID`];
      const courseDoc = docList[courseId];
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
        // Open categories.html in a new tab
        const newTab = window.open("categories.html", "_blank");
      });
    });
  } catch (error) {
    console.error("Error loading course: ", error);
  }
}
