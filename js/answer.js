import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
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

// Initialize Firebase
const app = initializeApp(fconf);
const db = getFirestore(app);
const auth = getAuth(app);

let questions = JSON.parse(localStorage.getItem("questionsset"));
async function loadQuestionsFromFirestore(categoryId, testId) {
  try {
    renderQuestions(questions);
  } catch (error) {
    console.error("Error loading questions:", error);
  }
}
const answerList = JSON.parse(localStorage.getItem("questionAnswerList"));
function renderQuestions(questions) {
  const questionContainer = document.querySelector(".question");
  questionContainer.innerHTML = ""; // Clear any existing content

  questions.forEach((question, index) => {
    const selectedOption = answerList[index]; // user's selected option index or undefined

    const correctOptionIndex = question.correctOption;
    let label = "";

    // Determine label based on user selection
    if (selectedOption === null) {
      label = '<span class="label unattempted">Unattempted</span>';
    } else if (Number(selectedOption) - 1 === correctOptionIndex) {
      label = '<span class="label correct-label">Correct</span>';
    } else {
      label = '<span class="label incorrect-label">Incorrect</span>';
    }

    const questionHTML = `
            <div class="question-item">
                <p><strong>${index + 1}. ${
      question.question
    }</strong> ${label}</p>
                ${question.options
                  .map(
                    (option, i) => `
                    <div class="option" id="option-${index}-${i}">
                        <input type="radio" id="option${
                          i + 1
                        }" name="question${index}" value="${i}">
                        <label for="option${i + 1}">${String.fromCharCode(
                      97 + i
                    )}) ${option}</label>
                    </div>
                `
                  )
                  .join("")}
            </div>
        `;
    questionContainer.insertAdjacentHTML("beforeend", questionHTML);

    // Style each option based on the answer state
    question.options.forEach((_, i) => {
      const optionElement = document.getElementById(`option-${index}-${i}`);

      if (selectedOption !== null) {
        if (Number(selectedOption) - 1 === i) {
          if (i === correctOptionIndex) {
            optionElement.classList.add("correct");
            document.querySelector(
              `input[name="question${index}"][value="${i}"]`
            ).checked = true;
            // User's answer is correct
          } else {
            document.querySelector(
              `input[name="question${index}"][value="${i}"]`
            ).checked = true;

            optionElement.classList.add("incorrect"); // User's answer is incorrect
          }
        }
        if (i === correctOptionIndex) {
          optionElement.classList.add("correct"); // Correct option styling
        }
      } else {
        if (i === correctOptionIndex) {
          optionElement.classList.add("correct"); // Unattempted question with correct answer shown
        }
      }
    });
  });
  const u = localStorage.getItem("user");
  const collection = localStorage.getItem("CollectionName");
  //localStorage.clear();
  localStorage.setItem("user", u);
  localStorage.setItem("CollectionName", collection);
}

// Load questions on document load
document.addEventListener("DOMContentLoaded", () => {
  const selectedCatId = localStorage.getItem("catId");
  const selectedTestId = localStorage.getItem("testId");
  const catname = localStorage.getItem("catName");
  document.getElementById("testname").innerText =
    "Answers for " + catname + "-" + selectedTestId + " Test";
  document.getElementById("title").innerText =
    "Results for " + catname + "-" + selectedTestId + " Test";

  loadQuestionsFromFirestore(selectedCatId, selectedTestId);
});
