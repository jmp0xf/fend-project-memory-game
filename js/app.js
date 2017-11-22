"use strict";

/*
 * Create a list that holds all of your cards
 */

var CARDS = [
    "diamond",
    "paper-plane-o",
    "anchor",
    "bolt",
    "cube",
    "leaf",
    "bicycle",
    "bomb"
];

var openCardList = [];

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

var Deck = function(cards) {
    this.cardList = cards.concat(cards);
    this.node = document.getElementsByClassName("deck")[0];

    // Create card item html node template
    this.cardBaseItem = document.createElement("li");
    this.cardBaseItem.className = "card";
    var icon = document.createElement("i");
    this.cardBaseItem.appendChild(icon);
};

Deck.prototype.reset = function() {
    // Clear open card list
    openCardList = [];

    // Clear card deck
    this.node.innerHTML = "";

    // Shuffle cards
    var shuffledList = shuffle(this.cardList);

    // Add each card's HTML to the deck node
    shuffledList.forEach(function(deck) {
        return function(card) {
            var cardItem = deck.cardBaseItem.cloneNode(true);
            cardItem.getElementsByTagName("i")[0].className = "fa fa-" + card;
            cardItem.onclick = cardClickListener;
            deck.node.appendChild(cardItem);
        };
    }(this));
};

var deck = new Deck(CARDS);

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
    cardNodes.forEach(function (cardNode) {
        cardNode.className = "card match";
    });
}

function highlightCard(cardNodes) {
    cardNodes.forEach(function (cardNode) {
        cardNode.className = "card not-match";
    });
}

function hideCard(cardNodes) {
    cardNodes.forEach(function (cardNode) {
        cardNode.className = "card";
    });
}

function addToOpenList(cardNode) {
    openCardList.push(cardNode);
    return openCardList;
}

/*
 * Process the two unmatched cards:
 *  - remove last two cards from open card list
 *  - highlight the two unmatched cards
 *  - hide the two unmatched cards
 */
function processUnmatchedCards(openList) {
    var len = openCardList.length;
    var cardNodes = openList.slice(len - 2, len);
    openCardList = openList.slice(0, len - 2);
    highlightCard(cardNodes);
    setTimeout(hideCard, 500, cardNodes);
}

function matchCards(cardNodes) {
    return cardNodes[0].getElementsByTagName("i")[0].className === cardNodes[1].getElementsByTagName("i")[0].className;

}

function cardClickListener() {
    // Only process hidden card
    if (this.className !== "card") {
        return;
    }

    // Display card's symbol
    showCard(this);

    // Add card node to open card list
    var openList = addToOpenList(this);

    var len = openList.length;

    // If first card clicked, start the timer
    if (len==1) {
        timer.reset();
    }

    if (len % 2 === 0) {
        var cardNodes = openList.slice(len - 2, len);

        // Check if the two cards match
        if (matchCards(cardNodes)) {
            lockCard(cardNodes);
        } else {
            processUnmatchedCards(openList);
        }
        moveCounter.incMoveCount();
    }
    if (openList.length === 16) {
        var again = confirm(
            "Congratulations! You Won!\n" +
            "With " + moveCounter.moveCount + " Moves and " + scorePanel.score + " Stars in " + timer.stop() + " Secs.\n" +
            "Woooooo!\n" +
            "Play again?"
        );
        if (again) {
            resetGame();
        }
    }
}

/*
 * Move counter
 */
var MoveCounter = function() {
    this.moveCount = 0;
    this.movesLabel = document.getElementsByClassName("moves")[0];
};

MoveCounter.prototype.refresh = function() {
    this.movesLabel.innerHTML = this.moveCount;
};

MoveCounter.prototype.reset = function() {
    this.updateMoveCount(0);
};

MoveCounter.prototype.updateMoveCount = function(moveCount) {
    this.moveCount = moveCount;
    this.refresh();
    scorePanel.calcScore(moveCount);
};

MoveCounter.prototype.incMoveCount = function() {
    this.updateMoveCount(this.moveCount+1);
};

var moveCounter = new MoveCounter();

/*
 * Score panel
 */
var ScorePanel = function() {
    this.score = 0;
    this.starsNode = document.getElementsByClassName("stars")[0];

    // Create star icon item
    this.starItem = document.createElement("li");
    var starIcon = document.createElement("i");
    starIcon.className = "fa fa-star";
    this.starItem.appendChild(starIcon);
};

ScorePanel.prototype.refresh = function() {
    // Clear score panel stars
    this.starsNode.innerHTML = "";

    // Add each star HTML to the panel
    for (var i=0; i<this.score; i++) {
        this.starsNode.appendChild(this.starItem.cloneNode(true));
    }
};

ScorePanel.prototype.reset = function() {
    this.updateScore(3);
};

ScorePanel.prototype.updateScore = function(score) {
    this.score = score;
    this.refresh();
};

// Calculate the score in terms of move count
ScorePanel.prototype.calcScore = function(move) {
    if (move<16) {
        this.updateScore(3);
    } else if (move<32) {
        this.updateScore(2);
    } else {
        this.updateScore(1);
    }
};

var scorePanel = new ScorePanel();

/*
 * Timer
 */
var Timer = function() {
    this.reset();
};

Timer.prototype.reset = function() {
    this.startTime = Date.now();
};

Timer.prototype.stop = function() {
    return (Date.now() - this.startTime) / 1000;
};

var timer = new Timer();

/*
 * Global game function
 */
function resetGame() {
    deck.reset();
    moveCounter.reset();
    scorePanel.reset();
}

/*
 * Reset button
 */
var resetButton = document.getElementsByClassName("restart")[0];
resetButton.onclick = resetGame;

/*
 * Reset the game after document is loaded
 */
window.onload = resetGame();
