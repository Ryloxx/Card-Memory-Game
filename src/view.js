import { CardType } from "./model.js";
import { Difficulty } from "./model.js";
export class View {
  cards = [];
  /**
   * Create a view for the model
   * @param {string} viewSelector  - Html element selector where to attach the view.
   */
  constructor(viewSelector) {
    this.viewElem = document.querySelector(viewSelector);
  }
  /**
   * List of card to display. An event trigger will be dispatched when their elemnt is clicked.
   * This method also rest the view before adding the cards.
   * @param {...CardType} cardList - List of cards, length must be a perfect square for a better rendering
   * @param {string} eventTriggerName - String wich will be used to create the event trigger
   */
  displayCards(cardList, eventTriggerName) {
    while (this.viewElem.firstChild) {
      this.viewElem.removeChild(this.viewElem.firstChild);
    }
    this.cards = [];
    this.viewElem.setAttribute("class", "container-fluid row");
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
        cardView.cardElem.setAttribute("class", "btn-block");
      }
      this.viewElem.appendChild(container);
    }
    this.update();
  }
  /**
   * Card click handler, meant to be bind to an object that contains a card element and a card type
   * @param {string} eventTriggerName - Event trigger name wich will be dispatched on click
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
   * Update the view with the latest modification to the cards
   */
  update() {
    for (let cardView of this.cards) {
      if (cardView.card.discarded) {
        cardView.cardElem.textContent = "Found";
        continue;
      }
      if (cardView.card.selected) {
        cardView.cardElem.textContent = cardView.card.type.name;
        cardView.faceup = true;
        continue;
      }
      cardView.cardElem.textContent = "*";
    }
  }
  /**
   * Return a valid CardView object which represent a card to render.
   * @param {CardType} card The card to render
   */
  cardViewFact(card) {
    return {
      cardElem: document.createElement("button"),
      card: card,
    };
  }
  /**
   * Face up the specified CardView
   * @param {cardViewFact()} cardView - CardView to face up
   */
  faceupCard(cardView) {
    cardView.cardElem.textContent = cardView.card.type.name;
  }
  /**
   * Prompt the game over
   */
  displayEnd() {
    alert("GAME OVER");
  }
  /**
   * Display button to get the difficulty of the game
   * @param {string} eventTriggerName - Event to trigger when a difficulty button is pressed
   */
  askDifficulty(eventTriggerName) {
    for (let difficulty of Difficulty.types) {
      let difficultyButton = {
        difficultyButtonElem: document.createElement("button"),
        difficulty: difficulty,
      };
      difficultyButton.difficultyButtonElem.textContent = difficulty.name;
      this.viewElem.appendChild(difficultyButton.difficultyButtonElem);
      difficultyButton.difficultyButtonElem.addEventListener(
        "click",
        (event) => {
          this.difficultyButtonHandler.call(difficultyButton, eventTriggerName);
        }
      );
    }
  }
  difficultyButtonHandler(eventTriggerName) {
    let customEvent = new CustomEvent(eventTriggerName, {
      bubbles: true,
      detail: {
        chosenDifficulty: this.difficulty,
      },
    });
    this.difficultyButtonElem.dispatchEvent(customEvent);
  }
}
