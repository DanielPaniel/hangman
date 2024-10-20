const wordlist = ["kaffe", "multiplikationstabell", "hund", "storstad", "bilfabrik", "planet", "skog", "apa", "salsa", "stenåldern"];
const alphabet = `abcdefghijklmnopqrstuvwxyzåäö`;
const maxGuesses = 11;
let counter = 0;
let isGameOver = false;

const dialog = document.querySelector("dialog");

dialog.addEventListener("close", (event) => {
    if (dialog.returnValue === "submit") {
        let value = dialog.querySelector("input").value;
        customSetup(value);
    }
    /**
     * Kolla MDn där skicka dom värdet inne i dialog.close(mittVärde)
     * om jag har formmethod dialog så sparas states i dialogen så den måste kansek nollas ibland?
     * hur tar vi värdet från inputen?
     * hur skickar jag värdet vidare?
     */
});

setup();

function openDialog() {
    dialog.querySelector("input").value = "";
    dialog.showModal();
}

function setup() {
    reset();
    
    // setup
    let word = selectWord();
    createLetterSlots(word);
    createButtons(alphabet);
}

function customSetup(word) {
    reset();
    
    // setup
//    let word = document.querySelector("#customWordInput").value;
    createLetterSlots(word);
    createButtons(alphabet);
}

function reset() {
    // reset
    counter = 0;
    document.querySelector("#hangmanResult").innerHTML = "";
    document.querySelector("#hangmanKeyboard").innerHTML = "";
    document.querySelector("#hangmanCounter").innerHTML = "";
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
//    document.querySelector("#hangmanCounter").textContent = maxGuesses - counter;
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