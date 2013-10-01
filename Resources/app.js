// require Platino
var platino = require("co.lanica.platino");

// Create a new window
var gameWindow = Ti.UI.createWindow();

// Create game view
var game = platino.createGameView();

// Create a game scene
var scene = platino.createScene();
scene.color(0.8,0,0); // Make the scene red

// Add your scene to game view
game.pushScene(scene);

// Variables
var card = [];  // To hold the cards to be turned over
var cardMask = [];  // For the images used to mask the cards
var cardImages = [1,1,2,2,3,3,4,4,5,5,6,6]; // For each of the 12 cards, 2 of each image
var pairs = 0; // To count pairs as they are made
var totalCards = 0; // To keep track of the total number of cards
var secondCard = 0; // Track if a second card is turned over
var pairCheck = false; // Track whether or not a pair should be checked for
var lastCard; // Forward declaration for the last card player turned over
var x = -60; // X to be used when positioning cards
var y = 20; // Y to be used when positioning cards

// Text to show whether or not a pair has been made once the second card is turned over
var pairText = platino.createTextSprite({text:"", fontSize:24, width:200, height:60, x:80,y:420});
pairText.color(1,1,1); // Make the pair text white
scene.add(pairText); // Add the pair text to the scene

// Main logic for flipping a card and checking for a match
var flipCard = function(target){
    if(pairCheck===false && secondCard===0){
        cardMask[target.number].alpha=0;
        lastCard = target;
        pairCheck = true;
    }
    else if(pairCheck===true){
        if(secondCard===0){
            // Flip the 2nd card
            cardMask[target.number].alpha=0;
            secondCard = 1;
            // If cards aren't a pair, flip them both back over
            if(lastCard.myName != target.myName){
				// Update text to show no pair was found
				pairText.text = "Not a pair!";
                // Timer so cards stay visible for 1 second before flipping back over
                setTimeout(function(){
                pairText.text = " "; // Make pair text blank again
                pairCheck = false;
                secondCard = 0;
                cardMask[lastCard.number].alpha=1;
                cardMask[target.number].alpha=1;
                },1000);
            }
                else if(lastCard.myName===target.myName && lastCard.number!=target.number){
                    // Update text to show that a pair was found
					pairText.text = "Pair Found!";
                    pairs = pairs+1; // Count the pair
                    setTimeout(function(){
                    pairText.text = " ";
                    pairCheck = false;
                    secondCard = 0;
                    scene.remove(lastCard);
                    scene.remove(target);
                    lastCard.dispose();
                    target.dispose();
                    cardMask[lastCard.number].dispose();
                    cardMask[target.number].dispose();
                    if(pairs===6){
                        var winText = platino.createTextSprite({text:"All pairs Found!", fontSize:40, width:300, height:100, x:25,y:180});
                        winText.color(1,1,1);
                        scene.add(winText);
                    }
                },1000);                
            }
            // Logic to prevent the same card from being selected twice in a row
            else if(lastCard.myName===target.myName && lastCard.number===target.number){
                secondCard=0;
            }
        }
    }
};

// Place cards
for (var xRow=0;xRow<3;xRow++){
    x = x+90;
    y = -20;
    
    for (yRow=0;yRow<4;yRow++){
        y=y+90;
        
        //assign each image random location on grid
        var temp = Math.floor((Math.random()*cardImages.length));//cardImages.length+1));
        card[totalCards] = platino.createSprite({image:"graphics/"+cardImages[temp]+".png"});//({image:"graphics/"+cardImages[temp]+".png"});
        scene.add(card[totalCards]);
        
        //position
        card[totalCards].x = x;
        card[totalCards].y = y;
        
        //name cards
        card[totalCards].myName = cardImages[temp];
        card[totalCards].number = totalCards;
        
        //Remove card from cardImages table
        cardImages.splice(temp, 1);
        
        // Set cover to hide card image
        cardMask[totalCards] = platino.createSprite({image:"graphics/card.png"});
        cardMask[totalCards].x = x;
        cardMask[totalCards].y = y;
        scene.add(cardMask[totalCards]);
        totalCards = totalCards+1;
    }
}

// A function and listener for the cards when touched
var touchCard = function(e){
    for (var i = 0; i < card.length; i++){
        if (cardMask[i].contains(e.x, e.y)){
            flipCard(card[i]);
        }
    }
};
game.addEventListener("touchend", touchCard);

// Onload function
game.addEventListener("onload", function(e) {
	// Set target screen size
    game.TARGET_SCREEN = {width:320, height:480};
		// set screen size for your game (TARGET_SCREEN size)
        var screenScale = game.size.width / game.TARGET_SCREEN.width;
        game.screen = {width:game.size.width / screenScale, height:game.size.height / screenScale};
        game.touchScaleX = game.screen.width  / game.size.width;
        game.touchScaleY = game.screen.height / game.size.height;
    // Start the game
    game.start();
});

// Add targets and open game window
gameWindow.add(game);
gameWindow.open({fullscreen:true, navBarHidden:true});