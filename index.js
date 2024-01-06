const nameLetters = ["S", "E", "R", "K", "A", "N"];
let letterIndexes = [0, 1, 2, 3, 4, 5];

// Store the current game state.
let gameState = {
    cards: [],
    unflippedCards: [],
    score: 0,
    message: "",
    result: ""
};

function createCards() {
    const cardsContainer = document.getElementById("cards-container");
    cardsContainer.innerHTML = "";

    nameLetters.forEach((letter, index) => {
        const card = document.createElement("div");
        card.className = "card";
        card.dataset.index = index.toString();
        card.innerHTML = `<img src="../images/${letter}.svg" class="letter-image" alt="Letter Character: ${letter}" width="100%" height="100%">`;
        card.addEventListener("click", () => unflipCard(card));
        cardsContainer.appendChild(card);
    });
}

function shuffleCards() {
    const imageElements = document.querySelectorAll("img.letter-image");
    for (let i = letterIndexes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letterIndexes[i], letterIndexes[j]] = [letterIndexes[j], letterIndexes[i]];
    }
    for (let i = 0; i < nameLetters.length; i++) {
        const letter = nameLetters[letterIndexes[i]];
        imageElements[i].src = `../images/${letter}.svg`;
        gameState.cards.push(letter);
    }
}

function unflipCard(card) {
    if (gameState.result) {
        return;
    }
    if (gameState.unflippedCards.length < gameState.cards.length) {
        const index = parseInt(card.dataset.index);
        const letter = gameState.cards[index];
        // If an unflipped card is already clicked, do nothing.
        if (gameState.unflippedCards.includes(letter)) {
            return;
        }
        gameState.unflippedCards.push(letter);

        // Check if the flipped cards match the correct sequence.
        if (arraysMatch(gameState.unflippedCards, nameLetters)) {
            gameState.score = Math.round((100 / 6) * gameState.unflippedCards.length);
            card.getElementsByTagName("img")[0].src = `../images/${letter}.svg`;
            updateScore();
            if (gameState.score === 100) {
                // Fully correct sequence, end the game.
                gameState.result = "success";
                endGame();
            }
        } else if (!arraysEqual(gameState.unflippedCards, nameLetters.slice(0, gameState.unflippedCards.length))) {
            // Incorrect sequence, end the game.
            gameState.result = "failure";
            endGame();
        }
    }
}

function arraysEqual(arr1, arr2) {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
}

// Check if the beginning of one array matches another array.
function arraysMatch(arr1, arr2) {
    return arraysEqual(arr1, arr2.slice(0, arr1.length));
}

// Update the score on the page.
function updateScore() {
    const scoreElement = document.querySelector(".score");
    scoreElement.textContent = `Score: ${gameState.score}`;
}

function updateGameMessage(className = null) {
    const messageElement = document.getElementById("game-message");
    messageElement.classList = className;
    messageElement.innerText = gameState.message;
}

function flipAllCards() {
    const imageElements = document.querySelectorAll("img.letter-image");
    for (let i = 0; i < nameLetters.length; i++) {
        imageElements[i].src = "../images/flipped.svg";
        imageElements[i].alt = "Flipped Letter Character";
    }
    gameState.unflippedCards = [];
}

function unflipAllCards() {
    const imageElements = document.querySelectorAll("img.letter-image");
    for (let i = 0; i < nameLetters.length; i++) {
        const letter = nameLetters[letterIndexes[i]];
        imageElements[i].src = `../images/${letter}.svg`;
        gameState.cards.push(letter);
    }
}

function startGame(element = null) {
    if (element) {
        element.disabled = true;
        element.nextElementSibling.disabled = false;
    }
    gameState.cards = [];
    gameState.unflippedCards = [];
    gameState.score = 0;

    shuffleCards();
    updateScore();

    // Flip cards face down after 2 seconds.
    setTimeout(() => {
        flipAllCards();
    }, 2000);

}

// Function to end the game
function endGame() {
    let message, className;
    if (gameState.result === "success") {
        message = "Congratulations! You have an excellent memory.";
        className = "success-text";
    } else if (gameState.result === "failure") {
        message = "Game Over! You made a wrong attempt.";
        className = "failure-text";
    }
    gameState.message = message
    unflipAllCards();
    updateGameMessage(className);
}

function restartGame() {
    gameState.message = "";
    gameState.result = "";
    updateGameMessage();
    startGame();
}

// Initialize the game by creating cards.
createCards();
