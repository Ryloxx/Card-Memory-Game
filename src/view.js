import { CardType } from "./model.js";
import { Difficulty } from "./model.js";
export class View {
  cards = [];
  /**
   * Create a view for the model, it is composed of the game view and a game summary
   * to display the  currently best score of the player in the different difficulty.
   * @param {string} viewSelector  - Html element selector where to attach the view.
   */
  constructor(viewSelector) {
    this.viewElem = document.querySelector(viewSelector);
    this.gameSummaryViewElem = document.createElement("div");
    this.gameViewElem = document.createElement("div");
    this.viewElem.appendChild(this.gameViewElem);
    this.viewElem.appendChild(this.gameSummaryViewElem);
    this.viewElem.setAttribute("class", " row my-auto bg-secondary rounded");
    this.gameViewElem.setAttribute(
      "class",
      "p-5 row col-9 my-auto  bg-warning rounded"
    );
    this.gameSummaryViewElem.setAttribute("class", " col  my-auto  rounded");
    this.bestScore = {};
    for (let type of Difficulty.types) {
      let bestScoreForDiff = {
        bestScoreForDiffElem: document.createElement("div"),
        bestScoreForDiffValue: undefined,
      };
      this.gameSummaryViewElem.appendChild(
        bestScoreForDiff.bestScoreForDiffElem
      );
      this.bestScore[type.name] = bestScoreForDiff;
      this.updateBestScore(type.name);
    }
    //this.gameSummaryViewElem.textContent = "Best Time";
  }
  /**
   * List of card to display. An event trigger will be dispatched when their elemnt is clicked.
   * This method also rest the view before adding the cards.
   * @param {...CardType} cardList - List of cards, length must be a perfect square for a better rendering.
   * @param {string} eventTriggerName - String wich will be used to create the event trigger.
   */
  displayCards(cardList, eventTriggerName) {
    this.reset();
    let n = Math.floor(Math.sqrt(cardList.length));
    cardList = this.shuffle(cardList);
    for (let i = 0; i < n; i++) {
      let container = document.createElement("div");
      container.setAttribute("class", `container col-${12 / n}`);
      for (let j = 0; j < n; j++) {
        let cardView = this.cardViewFact(cardList[i * n + j]);
        container.appendChild(cardView.cardElem);
        this.cards.push(cardView);

        cardView.cardElem.addEventListener("click", (event) => {
          this.clickHandler.call(cardView, eventTriggerName);
        });
        cardView.cardElem.setAttribute("class", "btn-block rounded");
      }
      this.gameViewElem.appendChild(container);
    }
    this.update();
  }
  /**
   * Card click handler, meant to be bind to an object that contains a card element and a card type.
   * @param {string} eventTriggerName - Event trigger name wich will be dispatched on click.
   */

  clickHandler(eventTriggerName) {
    let customEvent = new CustomEvent(eventTriggerName, {
      bubbles: true,
      detail: {
        clickedCard: this,
      },
    });
    this.cardElem.dispatchEvent(customEvent);
  }
  /**
   * Shuffle array data
   * @param {Array} - Array to shuffle
   */
  shuffle(arr) {
    let l = arr.length;
    let res = Object.assign([], arr);
    for (let i = 0; i < l - 1; i++) {
      let index = i + Math.floor(Math.random() * (l - 1 - i));
      let temp = res[i];
      res[i] = res[index];
      res[index] = temp;
    }
    return res;
  }
  /**
   * Update the view with the latest modification to the cards.
   */
  update() {
    for (let cardView of this.cards) {
      if (cardView.card.discarded) {
        cardView.cardElem.textContent = "Found";
        continue;
      }
      if (cardView.card.selected) {
        cardView.cardElem.textContent = cardView.card.type.name;
        continue;
      }
      cardView.cardElem.textContent = "*";
    }
  }
  /**
   * Return a valid CardView object which represent a card to render.
   * @param {CardType} card The card to render.
   */
  cardViewFact(card) {
    return {
      cardElem: document.createElement("button"),
      card: card,
    };
  }
  /**
   * Face up the specified CardView.
   * @param {cardViewFact()} cardView - CardView to face up.
   */
  faceupCard(cardView) {
    cardView.cardElem.textContent = cardView.card.type.name;
  }
  /**
   * Prompt a message, meant to be used when the game is over.
   * @param {string} message - Message to display.
   */
  displayEnd(message) {
    alert(message);
  }
  /**
   * Display button to get the difficulty of the game.
   * @param {string} eventTriggerName - Event to trigger when a difficulty button is pressed.
   */
  askDifficulty(eventTriggerName) {
    this.reset();
    let difficultyLabel = document.createElement("div");
    difficultyLabel.textContent = "Difficulty";
    this.gameViewElem.appendChild(difficultyLabel);
    difficultyLabel.setAttribute("class", "m-auto ");
    for (let difficulty of Difficulty.types) {
      let difficultyButton = {
        difficultyButtonElem: document.createElement("button"),
        difficulty: difficulty,
      };
      difficultyButton.difficultyButtonElem.textContent = difficulty.name;
      difficultyButton.difficultyButtonElem.setAttribute(
        "class",
        "m-auto bnt rounded"
      );
      this.gameViewElem.appendChild(difficultyButton.difficultyButtonElem);
      difficultyButton.difficultyButtonElem.addEventListener(
        "click",
        (event) => {
          this.difficultyButtonHandler.call(difficultyButton, eventTriggerName);
        }
      );
    }
  }
  /**
   * The handler for the difficulty button click.
   * @param {string} eventTriggerName Event to trigger inside the handler.
   */
  difficultyButtonHandler(eventTriggerName) {
    let customEvent = new CustomEvent(eventTriggerName, {
      bubbles: true,
      detail: {
        chosenDifficulty: this.difficulty,
      },
    });
    this.difficultyButtonElem.dispatchEvent(customEvent);
  }
  /**
   * Reset the view components.
   */
  reset() {
    while (this.gameViewElem.firstChild) {
      this.gameViewElem.removeChild(this.gameViewElem.firstChild);
    }
    this.cards = [];
  }
  /**
   * Update the best score.
   * @param {string} difficultyName - Name of the difficulty to update.
   */
  updateBestScore(difficultyName, score) {
    console.log(difficultyName);
    console.log(this.bestScore);
    let scoreToUpdate = this.bestScore[difficultyName];
    scoreToUpdate.bestScoreForDiffElem.textContent = difficultyName + ": ";
    let res = "";
    if (isNaN(parseInt(score))) {
      if (scoreToUpdate.bestScoreForDiffValue === undefined) {
        res = "/";
      } else {
        res = scoreToUpdate.bestScoreForDiffValue;
      }
    } else {
      if (scoreToUpdate.bestScoreForDiffValue === undefined) {
        res = score;
        scoreToUpdate.bestScoreForDiffValue = res;
      } else {
        res = Math.min(score, scoreToUpdate.bestScoreForDiffValue);
        scoreToUpdate.bestScoreForDiffValue = res;
      }
    }
    scoreToUpdate.bestScoreForDiffElem.textContent +=
      typeof res == "number" ? Timer.formatIntToMinSec(res) : res;
  }
}

export class Timer {
  timer = 0;
  running = false;
  constructor(timerSelector) {
    this.timerElem = document.querySelector(timerSelector);
    setInterval(() => {
      this.update();
    }, 1000);
    this.timerElem.textContent = Timer.formatIntToMinSec(this.timer);
  }
  /**
   * Format an integer to a minute second string "xxm:xxs".
   * @param {number} intTime The integer to format.
   */
  static formatIntToMinSec(intTime) {
    intTime = Math.floor(intTime);
    let sec = Timer.getSec(intTime);
    let min = Timer.getMin(intTime);
    min = min <= 9 ? "0" + min : String(min);
    sec = sec <= 9 ? "0" + sec : String(sec);
    return `${min}m:${sec}s`;
  }
  /**
   * Start the timer.
   */
  start() {
    this.running = true;
  }
  /**
   * Reset the timer.
   */
  reset() {
    this.running = false;
    this.timer = 0;
    this.updateView();
  }
  /**
   * Stop the timer.
   */
  stop() {
    this.running = false;
  }
  /**
   * Update the timer.
   */
  update() {
    if (this.running) {
      this.timer += 1;
      this.updateView();
    }
  }
  /**
   * Return the min part of the time provided.
   */
  static getMin(intTime) {
    return Math.floor((intTime - Timer.getSec(intTime)) / 60);
  }
  /**
   * Return the seconds part of the time provided.
   */
  static getSec(intTime) {
    return intTime % 60;
  }
  /**
   * Update the view of the timer.
   */
  updateView() {
    this.timerElem.textContent = Timer.formatIntToMinSec(this.timer);
  }
}
