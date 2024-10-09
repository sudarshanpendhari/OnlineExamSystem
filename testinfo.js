// Get the test ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const selectedCatId = urlParams.get('catId'); // Extract the catId from the URL
const selectedTestId = urlParams.get('testId'); // Extract the testId from the URL
const duration=urlParams.get('duration');
const pm=urlParams.get('PM');
const nm=urlParams.get('NM');

// Back to Tests Button functionality
document.getElementById("backtotests").addEventListener("click", () => {
    // Navigate back to sets.html and send the catId
    window.location.href = `sets.html?catId=${selectedCatId}`;
});

// Next Button functionality
document.getElementById("next").addEventListener("click", () => {
    // Navigate to test.html and send both catId and testId
    window.location.href = `test.html?catId=${selectedCatId}&testId=${selectedTestId}&duration=${duration}&PM=${pm}&NM=${nm}`;
});
