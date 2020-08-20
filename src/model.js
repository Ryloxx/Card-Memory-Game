/**
 * Card type of the game
 */
export class CardType {
  static BANANA = Object.freeze(new CardType("BANANA"));
  static APPLE = Object.freeze(new CardType("APPLE"));
  static WATERMELON = Object.freeze(new CardType("WATERMELON"));
  static CHERRY = Object.freeze(new CardType("CHERRY"));
  static ORANGE = Object.freeze(new CardType("ORANGE"));
  static PEACH = Object.freeze(new CardType("PEACH"));
  static types = CardType.getTypes();

  constructor(cardType) {
    this.name = cardType;
  }
  toString() {
    return `CardType.${this.name}`;
  }
  static getTypes() {
    return Object.freeze([
      CardType.APPLE,
      CardType.BANANA,
      CardType.CHERRY,
      CardType.ORANGE,
      CardType.PEACH,
      CardType.WATERMELON,
    ]);
  }
}
/**
 * Different difficulty of the game
 */
export class Difficulty {
  static EASY = Object.freeze(new Difficulty("EASY", 4));
  static MEDIUM = Object.freeze(new Difficulty("MEDIUM", 16));
  static HARD = Object.freeze(new Difficulty("HARD", 36));
  static types = Difficulty.getTypes();
  constructor(name, cardCount) {
    this.name = name;
    this.cardCount = cardCount;
  }
  toString() {
    return `Difficulty.${this.name}`;
  }
  static getTypes() {
    return Object.freeze([Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD]);
  }
}
/**
 * Game engine
 */
export class Model {
  cache = {};
  #cards;
  select1;
  /**
   * Initiate a new game with the specified difficulty.
   * @param {Difficulty} difficulty - The difficulty
   */
  constructor(difficulty) {
    this.difficulty = difficulty;
    this.#cards = this.createRandomCards(difficulty.cardCount);
  }
  /**
   * Create an array of random selected card from the CardType enum
   * @param {Number} cardCount  - Number of card to create
   */
  createRandomCards(cardCount) {
    let res = [];
    let types = CardType.types;
    for (let i = 0; i < Math.floor(cardCount / 2); i++) {
      let randomIndex = Math.floor(Math.random() * types.length);
      res.push(this.cardFact(types[randomIndex]));
      res.push(this.cardFact(types[randomIndex]));
    }
    return res;
  }
  /**
   * Return an immutable array of the cards for the game
   */
  get cards() {
    if ("cards" in this.cache) {
      return this.cache.cards;
    }
    this.cache.cards = Object.freeze(this.#cards);
    return this.cache.cards;
  }
  /**
   * Create a valid card for the game
   * @param {CardType} type - The card type
   */
  cardFact(type) {
    return {
      type: type,
      selected: false,
      discarded: false,
    };
  }
  /**
   * Select the specifed card and update the game state
   * @param {cardFact()} card - The selected card
   */
  selectCard(card) {
    if (card.discarded) {
      return card;
    }

    card.selected = true;
    if (this.select1) {
      if (card !== this.select1) {
        if (card.type === this.select1.type) {
          card.discarded = true;
          this.select1.discarded = true;
        } else {
        }
        this.select1.selected = false;
        card.selected = false;
        this.select1 = undefined;
      }
    } else {
      this.select1 = card;
    }
    return card;
  }
  /**
   * Check if the game is over
   */
  checkEnd() {
    return this.#cards.reduce((a, b) => {
      return a && b.discarded;
    }, true);
  }
  /**
   * Return if the game has already one card selected
   */
  alreadySelectedOne() {
    return Boolean(this.select1);
  }
  /**
   * Return if the game is over.
   */
  getResult() {
    return this.checkEnd();
  }
  /**
   * Return the difficulty of the game
   */
  getDifficulty() {
    return this.difficulty;
  }
}
