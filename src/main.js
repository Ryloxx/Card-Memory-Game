import { Model, Difficulty } from "./model.js";
import { View } from "./view.js";

const game = new Model(Difficulty.EASY);
const view = new View("#game");
view.displayCards(game.cards, "cardClick");

window.addEventListener("cardClick", (event) =>{
    game.selectCard(event.detail.clickedCard.card);
    view.update();
});
