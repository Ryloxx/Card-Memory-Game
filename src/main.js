import { Model, Difficulty } from "./model.js";
import { View } from "./view.js";

const game = new Model(Difficulty.MEDIUM);
const view = new View("#game");
view.displayCards(game.cards, "cardClick");

window.addEventListener("cardClick", (event) =>{
    console.log(event.detail);
});
