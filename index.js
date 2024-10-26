const wordlist = ["kaffe", "multiplikationstabell", "hund", "storstad", "bilfabrik", "planet", "skog", "apa", "salsa", "stenåldern", "cykel", "blåmes", "utflykt", "gräsmatta","frukost", "simskola", "bok", "ål", "bord", "scenframträdande", "studsmatta", "tidning", "choklad", "chips", "popcorn", "sol", "quinoa", "polisbil", "brandstation", "räv", "björn", "utter"];
const alphabet = `abcdefghijklmnopqrstuvwxyzåäö`;
const maxGuesses = 11;
let counter = 0;
let isGameOver = false;

const dialog = document.querySelector("dialog");

dialog.addEventListener("close", () => {
    if (dialog.returnValue === "submit") {
        let value = dialog.querySelector("input").value;
        if (customWordIsValid(value)) {
            setup(value);
        } else {
            dialog.showModal();
        }
    }
});


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
    });
    isGameOver = false;
}


function selectWord() {
    return wordlist[Math.floor(Math.random() * wordlist.length)];
}

function createButtons(stringToArray) {
    let gameContainer = document.querySelector("#hangmanKeyboard");
    let template = document.querySelector("#hangmanButton");
    let letters = [...stringToArray];
    letters.forEach((char) => {
       let templateFragment = template.content.cloneNode(true);
       let button = templateFragment.querySelector("button");
       button.textContent = char.toLowerCase();
       button.addEventListener("click", onGuess);
       gameContainer.append(button);
   });
}

function onGuess(event) {
    if (!isGameOver) {
        let currentGuess = event.target.textContent;
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
}

function countdown() {
    counter ++;
    document.querySelector(`path.hangman--${counter}`).style.display = "block"; 
}

function evaluateGame() {
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