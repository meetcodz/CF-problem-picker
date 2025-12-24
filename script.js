const generateBtn = document.getElementById("genbtn");
const ratingSelect = document.getElementById("rating");

const titleEl = document.getElementById("title");
const ratingEl = document.getElementById("ratingtext");
const tagsEl = document.getElementById("tagstext");
const solveBtn = document.getElementById("solvebtn");
const statusEl = document.getElementById("status");
const resultEl = document.querySelector(".result");


function getSelectedTags() {
    const checked = document.querySelectorAll(".tag input:checked");
    return Array.from(checked).map(el => el.value);
}

function setLoadingState() {
    statusEl.textContent = "Searching...";
    titleEl.textContent = "Finding a problem...";
    ratingEl.textContent = "";
    tagsEl.textContent = "";
    solveBtn.style.display = "none";
}

function showError(message) {
    statusEl.textContent = "Error";
    titleEl.textContent = message;
    ratingEl.textContent = "";
    tagsEl.textContent = "";
    solveBtn.style.display = "none";
}

generateBtn.addEventListener("click", async () => {
    const rating = Number(ratingSelect.value);
    const selectedTags = getSelectedTags();

    if (selectedTags.length === 0) {
        alert("Please select at least one tag.");
        return;
    }
     resultEl.classList.add("active");
    setLoadingState();

    try {
        const response = await fetch("https://codeforces.com/api/problemset.problems");
        const data = await response.json();

        if (data.status !== "OK") {
            showError("Failed to fetch problems.");
            return;
        }

        const problems = data.result.problems;

        const filtered = problems.filter(problem => {
            if (problem.rating !== rating) return false;
            return selectedTags.every(tag => problem.tags.includes(tag));
        });

        if (filtered.length === 0) {
            showError("No problem found for this selection.");
            return;
        }

        const problem = filtered[Math.floor(Math.random() * filtered.length)];

        statusEl.textContent = "Generated!";
        titleEl.textContent = problem.name;
        ratingEl.textContent = `Rating: ${problem.rating}`;
        tagsEl.textContent = `Tags: ${problem.tags.join(", ")}`;

        const url = `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`;

        solveBtn.style.display = "inline-block";
        solveBtn.onclick = () => window.open(url, "_blank");

    } catch (error) {
        showError("Something went wrong. Try again.");
        console.error(error);
    }
});
