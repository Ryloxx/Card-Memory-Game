import { Model } from "./model.js";
import { View, Timer } from "./view.js";
const view = new View("#game");
const timer = new Timer("#timer");
var interaction = true;
var game;
//Ask game difficulty
view.askDifficulty("difficultyClick");

//Listen for the response
window.addEventListener("difficultyClick", (event) => {
  let difficulty = event.detail.chosenDifficulty;
  //Initialize a game with the chosen difficulty
  game = new Model(difficulty);
  //Display the cards
  view.displayCards(game.cards, "cardClick");
  //Start the timer
  timer.start();
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
          //Check if the game is over
          if (game.getResult()) {
            //Stop the timer and display it
            timer.stop();
            view.displayEnd(
              `You finished in ${Timer.formatIntToMinSec(timer.timer)}`
            );
            //Update the best score
            view.updateBestScore(game.getDifficulty().name, timer.timer);
            timer.reset();
            view.askDifficulty("difficultyClick");
          }
          interaction = true;
        }, 500);
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
