import { Model } from "./model.js";
import { View, Timer } from "./view.js";
const view = new View("#game");
const timer = new Timer("#timer");
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
          if (game.getResult()) {
            //Stop the timer and display it
            timer.stop();
            let min = timer.getMin();
            let sec = timer.getSec();
            min = min > 0 ? min + "minutes" : "";
            sec = (min > 0 ? `and ${sec}` : sec) + " seconds.";
            view.displayEnd(`You finished in ${min} ${sec}`);
            timer.reset();
            view.askDifficulty("difficultyClick");
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
