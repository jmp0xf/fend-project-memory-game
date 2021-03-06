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

/*
 * Card deck
 */

var Deck = function (cards) {
    this.cardList = cards.concat(cards);
    this.node = document.getElementsByClassName("deck")[0];

    // Create card item html node template
    this.cardBaseItem = document.createElement("li");
    this.cardBaseItem.className = "card";
    var icon = document.createElement("i");
    this.cardBaseItem.appendChild(icon);
};

Deck.prototype.reset = function () {
    // Clear card deck
    this.node.innerHTML = "";

    // Shuffle cards
    var shuffledList = shuffle(this.cardList);

    // Add each card's HTML to the deck node
    shuffledList.forEach(function (card) {
        var cardItem = this.cardBaseItem.cloneNode(true);
        cardItem.getElementsByTagName("i")[0].className = "fa fa-" + card;
        cardItem.onclick = this.cardClickListener;
        this.node.appendChild(cardItem);
    }.bind(this));
};

Deck.prototype.setCardClickListener = function (cardClickListener) {
    this.cardClickListener = cardClickListener;
};

/*
 * Move counter
 */
var MoveCounter = function (scorePanel) {
    this.moveCount = 0;
    this.movesLabel = document.getElementsByClassName("moves")[0];
    this.scorePanel = scorePanel;
};

MoveCounter.prototype.refresh = function () {
    this.movesLabel.innerHTML = this.moveCount;
};

MoveCounter.prototype.reset = function () {
    this.updateMoveCount(0);
};

MoveCounter.prototype.updateMoveCount = function (moveCount) {
    this.moveCount = moveCount;
    this.refresh();
    this.scorePanel.calcScore(moveCount);
};

MoveCounter.prototype.incMoveCount = function () {
    this.updateMoveCount(this.moveCount + 1);
};

/*
 * Score panel
 */
var ScorePanel = function () {
    this.score = 0;
    this.starsNode = document.getElementsByClassName("stars")[0];

    // Create star icon item
    this.starItem = document.createElement("li");
    var starIcon = document.createElement("i");
    starIcon.className = "fa fa-star";
    this.starItem.appendChild(starIcon);
};

ScorePanel.prototype.refresh = function () {
    // Clear score panel stars
    this.starsNode.innerHTML = "";

    // Add each star HTML to the panel
    for (var i = 0; i < this.score; i++) {
        this.starsNode.appendChild(this.starItem.cloneNode(true));
    }
};

ScorePanel.prototype.reset = function () {
    this.updateScore(3);
};

ScorePanel.prototype.updateScore = function (score) {
    this.score = score;
    this.refresh();
};

// Calculate the score in terms of move count
ScorePanel.prototype.calcScore = function (move) {
    if (move < 16) {
        this.updateScore(3);
    } else if (move < 32) {
        this.updateScore(2);
    } else {
        this.updateScore(1);
    }
};

/*
 * Timer
 */
var Timer = function () {
    this.reset();
};

Timer.prototype.reset = function () {
    this.startTime = Date.now();
};

Timer.prototype.stop = function () {
    return (Date.now() - this.startTime) / 1000;
};

/*
 * Game engine
 */
var Game = function (cards) {
    this.openCardList = [];
    this.timer = new Timer();
    this.deck = new Deck(cards);
    this.deck.setCardClickListener(this.makeCardClickListener(this));
    this.scorePanel = new ScorePanel();
    this.moveCounter = new MoveCounter(this.scorePanel);
    // Reset button
    this.resetButton = document.getElementsByClassName("restart")[0];
    this.resetButton.onclick = this.reset.bind(this);
};

Game.prototype.reset = function () {
    // Clear open card list
    this.openCardList = [];
    this.deck.reset();
    this.moveCounter.reset();
    this.scorePanel.reset();
};

Game.prototype.incMoveCount = function () {
    this.moveCounter.incMoveCount();
};

Game.prototype.getMoveCount = function () {
    return this.moveCounter.moveCount;
};

Game.prototype.getScore = function () {
    return this.scorePanel.score;
};

Game.prototype.resetTimer = function () {
    return this.timer.reset();
};

Game.prototype.getTime = function () {
    return this.timer.stop();
};

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

Game.prototype.showCard = function (cardNode) {
    cardNode.className = "card open show";
};

Game.prototype.lockCard = function (cardNodes) {
    cardNodes.forEach(function (cardNode) {
        cardNode.className = "card match";
    });
};

Game.prototype.highlightCard = function (cardNodes) {
    cardNodes.forEach(function (cardNode) {
        cardNode.className = "card not-match";
    });
};

Game.prototype.hideCard = function (cardNodes) {
    cardNodes.forEach(function (cardNode) {
        cardNode.className = "card";
    });
};

Game.prototype.addToOpenList = function (cardNode) {
    this.openCardList.push(cardNode);
};

Game.prototype.getLastTwoOpenCards = function () {
    var len = this.openCardList.length;
    return this.openCardList.slice(len - 2, len);
};

/*
 * Process the two unmatched cards:
 *  - remove last two cards from open card list
 *  - highlight the two unmatched cards
 *  - hide the two unmatched cards
 */
Game.prototype.processUnmatchedCards = function () {
    var len = this.openCardList.length;
    var cardNodes = this.openCardList.slice(len - 2, len);
    this.openCardList = this.openCardList.slice(0, len - 2);
    this.highlightCard(cardNodes);
    setTimeout(this.hideCard, 500, cardNodes);
};

Game.prototype.matchCards = function (cardNodes) {
    return cardNodes[0].getElementsByTagName("i")[0].className === cardNodes[1].getElementsByTagName("i")[0].className;

};

Game.prototype.isFinished = function () {
    return this.openCardList.length == 16;
};

Game.prototype.autoSetupTimer = function () {
    // If first card clicked, start the timer
    if (this.openCardList === 1) {
        this.resetTimer();
    }
};

Game.prototype.isOpenCard = function (cardNode) {
    return cardNode.className !== "card"
};

Game.prototype.makeCardClickListener = function (game) {
    return function () {
        game.autoSetupTimer();

        // Only process hidden card
        if (game.isOpenCard(this)) {
            return;
        }

        // Display card's symbol
        game.showCard(this);

        // Add card node to open card list
        game.addToOpenList(this);

        var cnt = game.openCardList.length;

        if (cnt % 2 === 0) {
            var cardNodes = game.getLastTwoOpenCards();

            // Check if the two cards match
            if (game.matchCards(cardNodes)) {
                game.lockCard(cardNodes);
            } else {
                game.processUnmatchedCards();
            }
            game.incMoveCount();
        }
        if (game.isFinished()) {
            var again = confirm(
                "Congratulations! You Won!\n" +
                "With " + game.getMoveCount() + " Moves and " + game.getScore() + " Stars in " + game.getTime() + " Secs.\n" +
                "Woooooo!\n" +
                "Play again?"
            );
            if (again) {
                game.reset();
            }
        }
    }
};

// Initialize game engine
var game = new Game(CARDS);

/*
 * Reset the game after document is loaded
 */
window.onload = game.reset.bind(game);