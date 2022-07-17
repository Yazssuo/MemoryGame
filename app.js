const gameContainer = document.getElementById("game");

const COLORS = [];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create new divs
    const newCard = document.createElement("div");
    const innerCardDiv = document.createElement('div');
    const frontDiv = document.createElement('div');
    const backDiv = document.createElement('div');

    // give newCard a class attribute of the color and 'card'
    newCard.classList.add(color);
    newCard.classList.add('card');

    innerCardDiv.classList.add('card-inner');

    frontDiv.classList.add('front');
    backDiv.classList.add('back');

    backDiv.style.backgroundColor = color;

    // call a function handleCardClick when a div is clicked on
    newCard.addEventListener("click", handleCardClick);

    // append the divs to their respective places
    gameContainer.append(newCard);
    newCard.append(innerCardDiv);
    innerCardDiv.append(frontDiv);
    innerCardDiv.append(backDiv);
  }
}

// would probably have had an array of objects so it's more flexible, but we're dealing with two cards only right now so this is enough
let pickedCard_1 = null;
let pickedCard_2 = null;

// cardTracker tracks the number of matched cards the player has gotten from
// score keeps track of the number of guesses made
let cardTracker = 0;
let score = 0;

// reset the two object variables to null
function resetSelectedCards(){
  pickedCard_1 = null;
  pickedCard_2 = null;
}

// This function checks if two classes in the 1st position of classList are the same class
// classList[0] should lead to the color of the card
function checkIfSame(card1, card2){
  const card1_class = card1.classList[0];
  const card2_class = card2.classList[0];
  if (card1_class === card2_class){
    console.log('they are the same');
    return true;
  }
  else{
    console.log('they are not the same');
    return false;
  }
}

// An easy way to check if there's a win condition
// cardTracker is the number of matches so far and it checks if it's greater than or equal to half of the length of the COLORS array
// We divide the length of the COLORS array by two because there are pairs of the same element
function CheckIfWin(){
  if (cardTracker >= COLORS.length/2){
    return true;
  }
  else{
    return false;
  }
}

// Handles the situation where there's a card matched
// Increments cardTracker
// Adds 'matched' class to the matched cards and will check if there's a winner
function HandleMatch(card1, card2){
  cardTracker++;
  card1.classList.add('matched');
  card2.classList.add('matched');
  console.log(`Cards Matched: ${cardTracker} || Matches Needed: ${COLORS.length/2}`);
  if (CheckIfWin()){
    // Usage of setTimeout so flip animation finishes
    setTimeout(function(){
      alert("winner");
    },800)
  }
}

function handleCardClick(event) {
  // The reason .parentElement is used twice is to get to the parent where we handle logic
  // In this line we check to see if the class 'selected' does not exist and pickedCard_2 is null
  if (event.target.parentElement.parentElement.classList.contains('selected') === false && pickedCard_2 === null){
    // Increment score because we made a guess
    score++;
    // Checks if pickedCard_1 is null which means the player is making the first choice
    if (pickedCard_1 === null){
      // set pickedCard_1 to the card object, we use .parentElement twice because if we didn't it would direct to the backDiv (see function createDivsForColors)
      pickedCard_1 = event.target.parentElement.parentElement;
      // adds class 'selected' and 'flipit'. the former so we can't select it twice and the latter for visual flip animation
      pickedCard_1.classList.add('selected', 'flipit');
    }
    // If pickedCard_1 is not null, then we check if pickedCard_2 is null, which in this case if true will mean this is the player's second guess
    else if (pickedCard_2 === null){
      pickedCard_2 = event.target.parentElement.parentElement;
      pickedCard_2.classList.add('selected', 'flipit');
      // Call function checkIfSame which will return true or false depending if the cards have the same color
      const IsItSame = checkIfSame(pickedCard_1, pickedCard_2);
      if (IsItSame) {
        HandleMatch(pickedCard_1, pickedCard_2);
        resetSelectedCards();
      }
      else {
        // Wait 1 second before the player is able to take action again, removes selected and flipit class
        setTimeout(function(){
          pickedCard_1.classList.remove('selected', 'flipit');
          pickedCard_2.classList.remove('selected', 'flipit');
          resetSelectedCards();
        },1000)
      }
    }
  }
}

// when the DOM loads

//createDivsForColors(shuffledColors);
const colorNumber = document.querySelector('#colornumb');
const submitBtn = document.querySelector('#submitButton');

submitBtn.addEventListener('click', function clicked(evnt) {
  evnt.preventDefault();
  // for loop goes up to the value of colorNumber
  for(let i = 0; i < colorNumber.value; i++){
    // Random HexCode
    const randomHex = Math.floor(Math.random()*16777215).toString(16);
    // # + randomHex making up the HexCode
    // push to COLORS twice since they are pairs
    COLORS.push('#' + randomHex);
    COLORS.push('#' + randomHex);
  }
  createDivsForColors(shuffledColors);
  // Can't add anymore cards, accidentally made it a pseudo refresh game so I'm keeping it :)
  submitBtn.removeEventListener('click', clicked);
})

/* */