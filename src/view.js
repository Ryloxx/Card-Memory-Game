import { CardType } from "./model.js";
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
        cardView.cardElem.setAttribute("class", "btn");
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
  update() {
    for (let cardView of this.cards) {
      if (cardView.card.discarded) {
        cardView.cardElem.textContent = "Found";
        continue;
      }
      if (cardView.card.selected) {
        cardView.cardElem.textContent = cardView.card.name;
        continue;
      }
      cardView.cardElem.textContent = "*";
    }
  }
  cardViewFact(card) {
    return {
      cardElem: document.createElement("button"),
      card: card,
      faceup: false,
    };
  }
}
