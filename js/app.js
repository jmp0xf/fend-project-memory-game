/*
 * Create a list that holds all of your cards
 */

var cards = [
    "diamond",
    "paper-plane-o",
    "anchor",
    "bolt",
    "cube",
    "leaf",
    "bicycle",
    "bomb",
]

var cardList = cards.concat(cards)

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function resetDeck(cardList) {
    var deck = document.getElementsByClassName("deck")[0];
    
    // Clear card deck
    deck.innerHTML = "";

    // Create card item html node template
    var cardBaseItem = document.createElement("li");
    cardBaseItem.className = "card";
    var icon = document.createElement("i");
    cardBaseItem.appendChild(icon);

    // Shuffle cards
    var shuffledList = shuffle(cardList);

    // Add each card's HTML to the deck node
    for (var i = 0; i < shuffledList.length; i++) {
        var cardItem = cardBaseItem.cloneNode(true);
        cardItem.getElementsByTagName("i")[0].className = "fa fa-" + shuffledList[i];
        cardItem.onclick = cardClickListener;
        deck.appendChild(cardItem);
    }
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

function showCard(cardNode) {
    cardNode.className = "card open show";
}

function lockCard(cardNodes) {
    for (var i = 0; i < cardNodes.length; i++) {
        cardNodes[i].className = "card match";
    }
}

function warnCard(cardNodes) {
    for (var i = 0; i < cardNodes.length; i++) {
        cardNodes[i].className = "card not-match";
    }
}

function hideCard(cardNodes) {
    for (var i = 0; i < cardNodes.length; i++) {
        cardNodes[i].className = "card";
    }
}

var openCardList = []

function addToOpenList(cardNode) {
    openCardList.push(cardNode);
    return openCardList;
}

var moveCount = 0;

/* 
 * Process the two unmatched cards:
 *  - remove last two cards from open card list
 *  - highlight the two unmatched cards
 *  - hide the two unmatched cards
 */
function processUnmatchedCards(openList) {
    var len = openCardList.length;
    var cards = openList.slice(len - 2, len);
    openCardList = openList.slice(0, len - 2);
    warnCard(cards);
    setTimeout(hideCard, 500, cards);
}

function matchCards(cardNodes) {
    return cardNodes[0].getElementsByTagName("i")[0].className == cardNodes[1].getElementsByTagName("i")[0].className;

}

function cardClickListener() {
    // Only process hidden card
    if (this.className != "card") return;

    // Display card's symbol
    showCard(this);

    // Add card node to open card list
    var openList = addToOpenList(this);

    var len = openList.length;
    if (len % 2 == 0) {
        var cards = openList.slice(len - 2, len);

        // Check if the two cards match
        if (matchCards(cards)) {
            lockCard(cards);
        } else {
            processUnmatchedCards(openList);
        }
        incMoveCounter();
    }
    if (openList.length == 16) {
        alert("Congratulations! You Won!");
    }
}

/*
 * Move counter
 */
var moveCounter = document.getElementsByClassName("moves")[0];

function displayMoveCounter() {
    moveCounter.innerHTML = moveCount;
}

function resetMoveCounter() {
    moveCount = 0;
    displayMoveCounter();
}

function incMoveCounter() {
    moveCount++;
    displayMoveCounter();
}

/*
 * Global game function
 */ 
function resetGame() {
    resetDeck(cardList);
    resetMoveCounter();
}

/*
 * Reset button
 */
var resetButton = document.getElementsByClassName("restart")[0];
resetButton.onclick = resetGame;

/*
 * Reset the game after document is loaded
 */
window.onload = resetGame()
