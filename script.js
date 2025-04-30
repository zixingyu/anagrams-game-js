let targetWord = "";
let guesses = [];
let correct = 0;
let incorrect = 0;
let score = 0;
let stats = JSON.parse(localStorage.getItem("stats")) || {
    gamesPlayed: 0,
    highestScore: 0,
    lowestScore: Infinity,
    totalCorrect: 0,
    totalIncorrect: 0,
};

function updateStatsUI() {
    document.getElementById("games-played").textContent = stats.gamesPlayed;
    document.getElementById("high-score").textContent = stats.highestScore;
    document.getElementById("low-score").textContent =
        stats.lowestScore === Infinity ? 0 : stats.lowestScore;
    document.getElementById("avg-correct").textContent = (
        stats.totalCorrect / stats.gamesPlayed || 0
    ).toFixed(1);
    document.getElementById("avg-incorrect").textContent = (
        stats.totalIncorrect / stats.gamesPlayed || 0
    ).toFixed(1);
}

function updateScoreUI() {
    document.getElementById("score").textContent = score;
}

function updateGuessedWords() {
    for (let i = 3; i <= 7; i++) {
        document.getElementById(`group-${i}`).textContent = "";
    }

    guesses.forEach((word) => {
        const len = word.length;
        if (len >= 3 && len <= 7) {
            const span = document.createElement("span");
            span.textContent = word + " ";
            document.getElementById(`group-${len}`).appendChild(span);
        }
    });
}


function shuffleWord(word) {
    return word
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");
}

function updateLettersDisplay() {
    const display = document.getElementById("letters-display");
    display.innerHTML = "";

    const shuffled = shuffleWord(targetWord).split("");
    shuffled.forEach((letter, idx) => {
        const span = document.createElement("span");
        span.textContent = letter.toUpperCase();
        span.classList.add("letter");
        span.dataset.index = idx;
        span.addEventListener("click", () => {
            if (!span.classList.contains("used")) {
                document.getElementById("guess-input").value += letter;
                span.classList.add("used");
            }
        });
        display.appendChild(span);
    });
}


function resetGameUI() {
    guesses = [];
    correct = 0;
    incorrect = 0;
    score = 0;
    document.getElementById("feedback").textContent = "";
    updateGuessedWords();
    updateScoreUI();
    document.getElementById("guess-input").value = "";
    document.getElementById("guess-form").classList.remove("disabled");
    document.getElementById("shuffle-btn").disabled = false;
}

function finalizeGame() {
    stats.gamesPlayed++;
    stats.totalCorrect += correct;
    stats.totalIncorrect += incorrect;
    stats.highestScore = Math.max(stats.highestScore, score);
    stats.lowestScore = Math.min(stats.lowestScore, score);
    localStorage.setItem("stats", JSON.stringify(stats));
    updateStatsUI();
    document.getElementById("feedback").textContent = "You guessed the full word!";
    document.getElementById("guess-form").classList.add("disabled");
    document.getElementById("shuffle-btn").disabled = true;
}

function getScoreForLength(len) {
    return [0, 1, 2, 4, 8, 15, 30][len] || 0;
}

async function checkDictionaryWord(word) {
    //console.log("Sending word to API:", word);
    try {
        const res = await fetch("https://cs4640.cs.virginia.edu/homework/checkword.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ word }),
        });

        const text = await res.text(); 
        //console.log("Raw response:", text);

        if (!res.ok || text.trim() === "") {
            console.warn(`Server error for "${word}" — Status ${res.status}`);
            return false;
        }

        const result = JSON.parse(text);
        //console.log("Parsed result:", result);

        return result.valid;

    } catch (err) {
        console.error(" API or JSON error:", err);
        return false;
    }
}



function isValidLettersOnly(guess) {
    const temp = targetWord.split("");
    for (const letter of guess) {
        const index = temp.indexOf(letter);
        if (index === -1) return false;
        temp.splice(index, 1);
    }
    return true;
}

document.getElementById("guess-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = document.getElementById("guess-input");
    const guess = input.value.toLowerCase();
    input.value = "";
    //reset the clickable letters (remove .used class)
    document.querySelectorAll(".letter").forEach((el) => {
        el.classList.remove("used");
    });

    if (!isValidLettersOnly(guess)) {
        incorrect++;
        document.getElementById("feedback").textContent = "Invalid letters used!";
        return;
    }

    if (guesses.includes(guess)) {
        document.getElementById("feedback").textContent = "Word already guessed!";
        return;
    }

    let isValid = guess === targetWord;
    if (!isValid) {
        isValid = await checkDictionaryWord(guess);
    }

    if (!isValid) {
        incorrect++;
        document.getElementById("feedback").textContent = "Not in dictionary!";
        return;
    }

    guesses.push(guess);
    correct++;
    score += getScoreForLength(guess.length);
    updateGuessedWords();
    updateScoreUI();

    if (guess === targetWord) {
        finalizeGame();
    } else if (guess.length === 7) {
        document.getElementById("feedback").textContent = "Good try, but that’s not the target word!";
    } else {
        document.getElementById("feedback").textContent = "Nice!";
    }

});


document.getElementById("new-game-btn").addEventListener("click", () => {
    stats.gamesPlayed++;
    stats.totalCorrect += correct;
    stats.totalIncorrect += incorrect;
    stats.highestScore = Math.max(stats.highestScore, score);
    stats.lowestScore = Math.min(stats.lowestScore, score);
    localStorage.setItem("stats", JSON.stringify(stats));
    updateStatsUI();

    getRandomWord((data) => {
        targetWord = data.word;
        //console.log("New target word:", targetWord);
        resetGameUI();
        updateLettersDisplay();
    });
});


document.getElementById("shuffle-btn").addEventListener("click", updateLettersDisplay);

document.getElementById("clear-btn").addEventListener("click", () => {
    localStorage.clear();
    stats = {
        gamesPlayed: 0,
        highestScore: 0,
        lowestScore: Infinity,
        totalCorrect: 0,
        totalIncorrect: 0,
    };
    updateStatsUI();
    getRandomWord((data) => {
        targetWord = data.word;
        resetGameUI();
        updateLettersDisplay();
    });
});

window.addEventListener("DOMContentLoaded", () => {
    updateStatsUI();
    getRandomWord((data) => {
        targetWord = data.word;
        //console.log("Game started with target word:", targetWord);
        updateLettersDisplay();
    });
});

