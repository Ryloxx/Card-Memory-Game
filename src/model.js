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
  static EASY = Object.freeze(new Difficulty("EASY"));
  static MEDIUM = Object.freeze(new Difficulty("MEDIUM"));
  static HARD = Object.freeze(new Difficulty("HARD"));
  static types = Difficulty.getTypes();
  constructor(name) {
    this.name = name;
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
  cach = {};
  #cards;
  constructor(difficulty) {
    this.difficulty = difficulty;
    switch (this.difficulty) {
      case Difficulty.EASY:
        this.cardCount = 4 * 4;
        break;
      case Difficulty.MEDIUM:
        this.cardCount = 6 * 6;
        break;
      case Difficulty.HARD:
        this.cardCount = 8 * 8;
        break;
      default:
        throw Error("Difficulty not supported");
    }
    this.#cards = this.createRandomCards(this.cardCount);
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
      res.push(types[randomIndex]);
      res.push(types[randomIndex]);
    }
    return res;
  }
  /**
   * Return an immutable array of the currently selected cards for the game
   */
  get cards() {
    if ("cards" in this.cach) {
      return this.cach.cards;
    }
    this.cach.cards = Object.freeze(this.#cards);
    return this.cach.cards;
  }
}