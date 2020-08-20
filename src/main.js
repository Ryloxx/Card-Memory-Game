import { Model, Difficulty } from "./model.js";
import { View } from "./view.js";
const view = new View("#game");
var interaction = true;
//Ask game difficulty
view.askDifficulty("difficultyClick");

//Listen for the response
window.addEventListener("difficultyClick", (event) => {
  let difficulty = event.detail.chosenDifficulty;
  //Initialize the game with the chosen difficulty
  const game = new Model(difficulty);
  //Display the card
  view.displayCards(game.cards, "cardClick");
  //Listen for palyer click on the cards
  window.addEventListener("cardClick", (event) => {
    //Handel the cards picked by the player
    if (interaction) {
      //Face up the picked card
      let cardView = event.detail.clickedCard;
      view.faceupCard(cardView);
      //If the player already has selected a card, delay the update of the game model to let the player see the second pick
      //Interactions with the view are disabled while doing so
      if (game.alreadySelectedOne()) {
        interaction = false;
        setTimeout(() => {
          game.selectCard(cardView.card);
          view.update();
          if (game.getResult()) {
            view.displayEnd();
          }
          interaction = true;
        }, 1000);
      } else {
        //Else just update directly
        game.selectCard(cardView.card);
        view.update();
      }
    }
    event.stopPropagation();
  });

  event.stopPropagation();
});
