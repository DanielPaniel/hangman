const wordlist = ["kaffe", "multiplikationstabell", "hund", "storstad", "bilfabrik", "planet", "skog", "apa", "salsa", "stenåldern", "cykel", "blåmes", "utflykt", "gräsmatta","frukost", "simskola", "bok", "ål", "bord", "scenframträdande", "studsmatta", "tidning", "choklad", "chips", "popcorn", "sol", "quinoa", "polisbil", "brandstation", "räv", "björn", "utter"];
const alphabet = `abcdefghijklmnopqrstuvwxyzåäö`;
const maxGuesses = 11;
let counter = 0;
let isGameOver = false;

const dialog = document.querySelector("dialog");
let inputElement = dialog.querySelector("input");
inputElement.addEventListener("keyup", () => {
    setValidity(inputElement);
});

dialog.addEventListener("close", () => {
    if (dialog.returnValue === "submit") {
        let inputElement = dialog.querySelector("input");
        let word = inputElement.value.trim();
        dialog.returnValue = "";    
        if (customWordIsValid(word)) {
            setup(word);
        } else {
           dialog.showModal();
        }
    }
});

function setValidity(inputElement) {
    let word = inputElement.value.trim();
    if (customWordIsValid(word)) {
        inputElement.setCustomValidity("");
    } else {
        inputElement.setCustomValidity("Detta ord har tecken som inte får vara med!");
    }
}


function customWordIsValid(word) {
    let letters = [...word.toLowerCase()];
    let valid = letters.length > 0;
    letters.forEach((letter) => {
        if (!alphabet.includes(letter)) {
            valid = false;
        }
    });
    return valid;
}

setup(selectWord());

function openDialog() {
    dialog.querySelector("input").value = "";
    dialog.showModal();
}

function setup(word) {
    reset();
    
    // setup
    createLetterSlots(word);
    createButtons(alphabet);
}

function reset() {
    // reset
    counter = 0;
    document.querySelector("#hangmanResult").innerHTML = "";
    document.querySelector("#hangmanKeyboard").innerHTML = "";
    document.querySelector("#hangmanSlots").innerHTML = "";
    let hangmanParts = document.querySelectorAll(".hangman_man path");
    hangmanParts.forEach((part) => {
        part.style.display = "none";
        part.style.color = `rgb(${getRandomInt(0,200)}, ${getRandomInt(0,200)}, ${getRandomInt(0,200)})`;
    });
    isGameOver = false;
}


function selectWord() {
    let randomInt = getRandomInt(0, wordlist.length-1);
    return wordlist[randomInt];
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createButtons(stringToArray) {
    let gameContainer = document.querySelector("#hangmanKeyboard");
    let template = document.querySelector("#hangmanButton");
    let letters = [...stringToArray];
    letters.forEach((char) => {
       let templateFragment = template.content.cloneNode(true);
       let button = templateFragment.querySelector("button");
       button.textContent = char.toLowerCase();
       button.value = char.toLowerCase();
       button.addEventListener("click", onGuess);
       gameContainer.append(button);
   });
}


function onGuess(event) {
    let currentGuess = event.target.value;
    let affectedSlots = document.querySelectorAll(`[data-letter=${currentGuess}]`);
    if (affectedSlots.length > 0) {
        affectedSlots.forEach((item) => {
            item.textContent = currentGuess;
        });        
    } else {
        countdown();
    }
    event.target.setAttribute("disabled", "");
    evaluateGame();    
}

function countdown() {
    if (!isGameOver) {
        counter ++;
        document.querySelector(`path.hangman--${counter}`).style.display = "block"; 
    }
}

function evaluateGame() {
    if (!isGameOver) {
        let feedbackTemplate;
        let wordContent = document.querySelector("#hangmanSlots").textContent;
    
        if (!wordContent.includes("_")) {
            feedbackTemplate = document.querySelector("#hangmanWin");        
        } else if (counter >= maxGuesses) {
           feedbackTemplate = document.querySelector("#hangmanLose");
        }
    
        if (feedbackTemplate) {
            isGameOver = true;
            let templateFragment = feedbackTemplate.content.cloneNode(true);
            let feedback = templateFragment.querySelector("div");
            document.querySelector("#hangmanResult").append(feedback);
        }    
    }
}

function createLetterSlots(stringToArray) {
    let gameContainer = document.querySelector("#hangmanSlots");
    let template = document.querySelector("#hangmanSlot");
    let letters = [...stringToArray];
    letters.forEach((char) => {
       let templateFragment = template.content.cloneNode(true);
       let element = templateFragment.querySelector("[data-letter]");
       element.setAttribute("data-letter", char.toLowerCase());
       gameContainer.append(element);
    });
}

function getClue() {
    let allSlots = document.querySelectorAll("#hangmanSlots [data-letter]");
    let letters = [];
    [...allSlots].forEach((slot) => {
        if(slot.textContent !== slot.dataset.letter) {
            letters.push(slot.dataset.letter);
        }
    });
    if (letters.length) {
        let randomInt = getRandomInt(0, letters.length-1);
        let randomLetter = letters[randomInt];
        let button = document.querySelector(`button[value=${randomLetter}]`);
        button.click();
        countdown();    
    }
}