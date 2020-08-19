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
   * @param {...CardType} cardList - List of cards, length must be a perfect square for a better rendering
   * @param {string} eventTriggerName - String wich will be used to create the event trigger
   */
  displayCards(cardList, eventTriggerName) {
    this.viewElem.setAttribute("class", "container-fluid row")
    let n = Math.floor(Math.sqrt(cardList.length));
    for (let i = 0; i < n; i++) {
      let container = document.createElement("div");
      container.setAttribute("class", `container col-${12/n}`);
      for (let j = 0; j < n; j++) {
        let cardElem = document.createElement("div");
        let card = {
          cardElem: cardElem,
          cardType: cardList[i*n+j],
        };

        container.appendChild(cardElem);
        this.cards.push(card);
        
        cardElem.addEventListener("click", (event) => {
          this.clickHandler.call(card, eventTriggerName);
        });
        cardElem.setAttribute("class", "btn");
        cardElem.textContent = card.cardType.name;
      }
      this.viewElem.appendChild(container);
    }
  }
  /**
   * Card click handler, meant to be bind to an object that contains a card element and a card type
   * @param {string} eventTriggerName - Event trigger name wich will be dispatched on click
   */

  clickHandler(eventTriggerName) {
    console.log(this);
    let customEvent = new CustomEvent(eventTriggerName, {
      bubbles: true,
      detail: {
        clickedCard: this,
      },
    });
    this.cardElem.dispatchEvent(customEvent);
  }
  /**
   * Update the view with the currently stored cards
   */
  
}
