import React from "react";
import "./App.css";
import { clsx } from "clsx";
import { languages } from "./languages";
import { getFarewellText, getWords } from "./utils";

function App() {
  const [currentWord, setCurrentWord] = React.useState(getWords());
  const [guessedLetters, setGuessedLetters] = React.useState([]);

  // Derived values
  // This is filtering out the correct letters by checking that the current letter does not include the letter that is in the current word.
  // .length gets the the number of wrong guesses from the array.
  const wrongGuessCount = guessedLetters.filter(
    (letter) => !currentWord.includes(letter)
  ).length;

  // Derived the value to use more widely in the code, to help announce to the user how many guesses they have left below.
  const numberGuessesLeft = languages.length - 1;

  // The current word is split and I check to see if every letter in the current word is in the array of guessedLetters
  // so I use the includes method to check to see if the guessedLetter includes a correct letter in the current word.
  // If the guessedLetter is equal to the letter in the current word the expression will return true as a boolean.
  // If the wrongGuessCount is greater than or euqal to the languages length than the game has been lost.
  // -1 is there to make sure Assembly is the only one standing at the end of the game.
  // Now the isGameOver variable is created and is equal either or game won or lost.
  const isGameWon = currentWord
    .split("")
    .every((letter) => guessedLetters.includes(letter));
  const isGameLost = wrongGuessCount >= numberGuessesLeft;
  const isGameOver = isGameWon || isGameLost;

  // equal to the guessedLetters array at the index of the guessedLetters.length.
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];

  // Derive whether or not the last guessed letter was an  incorrect letter.
  // By checking if the lastGussedLetter is a real value and only then will it check if
  // currentWord includes the lastGuessedLetter.
  const isLastGuessIncorrect =
    lastGuessedLetter && !currentWord.includes(lastGuessedLetter);

  // global variable used throughout code. Is also a static value.
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  //If the previous letters include the current letter then nothing happens and the previous letter is returned. However of the letter is new, then it is added onto the previous letters.
  //This also stops a duplication of letters.
  //The function is on keyboardElements buttons as I map through each letter from the alphabet and give it a button. There the user will interact
  //and their guess will be passed in here.
  function addGuessedLetter(letter) {
    setGuessedLetters((prevLetters) =>
      prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]
    );
  }

  //mapping over all the languages in the languages.js file. For every language it will be a span and will have its colour and background color applied along with a className
  //and key. language.name has been tapped into to get to additional properties needed from the js file.
  // With isLanguageLost, getting access to the current item in the array using index. The language array will always be in the same order therefore, if there is a wrong guess count of 1,
  // then any index that is less than the number of wrong guesses (i.e. the index is equal to 0), this is a lost language and the expression below will be true. It will increment therefore,
  // the index will become one as it moves to the next language and if the user guesses incorrectly again, wrongGuessesCount will return true and this will mean another language is lost.
  const languageElements = languages.map((language, index) => {
    const isLanguageLost = index < wrongGuessCount;
    const styles = {
      backgroundColor: language.backgroundColor,
      color: language.color,
    };
    //If true the lost class will be applied, but if false the chip will be applied.
    const languageClass = clsx("chip", isLanguageLost && "lost");
    return (
      <span className={languageClass} style={styles} key={language.name}>
        {language.name}
      </span>
    );
  });

  //If the guessedLetters includes the current letter that is being mapped over in the currentWord that means the user has guessed correctly.
  // Becuase at this point I am only mapping over letters in the actual word. If true it will display the uppercase version of the letter.
  // If false an empty string is displayed in its place (e.g. nothing).
  const letterElements = currentWord
    .split("")
    .map((letter, index) => (
      <span key={index}>
        {guessedLetters.includes(letter) ? letter.toUpperCase() : ""}
      </span>
    ));

  //Checking to see if the guessedLetters includes the current letter that is being mapped over.
  //Checking to see if the guessed letter is correct and the currentWord includes the letter. If this is the case then it is correct.
  //Checking to see if the guessed letter is correct and the currentWrod does not include the right letter. If not then it is wrong.
  //CLSX package allows me to create an object where the keys are the names of the classes I want to apply and the values of the keys are booleans,
  //as to wehter or not the className should be applied.
  //For each letter a button is also created and it will interact with addGuessedLetter as this is where the user will guess.
  const keyboardElements = alphabet.split("").map((letter) => {
    const isGuessed = guessedLetters.includes(letter);
    const isCorrect = isGuessed && currentWord.includes(letter);
    const isWrong = isGuessed && !currentWord.includes(letter);
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong,
    });

    //Anonymous inline function used to stop JS returning an object.
    //Each letter is set to uppercase.
    // The keybaord will be disbaled if the game is over.
    // The aria disabled disables the button for assistive technolgies. It looks at the guessedLetters current letter.
    // The aria label announces the the letter for assistive technologies.
    //Each letter is checked against whether or not it is correct and will turn red or green when clicked.
    // If correct it will turn green and be added to the letter elements.
    // If wrong it will turn red and won't be added to the letter elements. Refer to the above code.
    return (
      <button
        className={className}
        key={letter}
        disabled={isGameOver}
        aria-disabled={guessedLetters.includes(letter)}
        aria-label={`Letter ${letter}`}
        onClick={() => addGuessedLetter(letter)}
      >
        {letter.toUpperCase()}
      </button>
    );
  });

  // CLSX is used to conditionally render the classes based on whether the game has been won or lost.
  // It is applied to the CSS logic. The first argument in CLSX tells the code to always use that class at the beginning.
  // for farewell styles to be applied it first checks to see that the game is not over so there is not a clash in the CSS.
  // If that is the case it checks to see if the last guess is incorrect.
  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect,
  });

  // Inside the helper function an if else statement can be used. Can't do it in JSX.
  // If the game is not over, AND if the last guess is incorrect return the Farwell text from the utils file.
  // Index into languages to find the correct language in the array, by looking at wrongGuessCount. Then .name is used to
  // access the names inside of the langauges object.
  // If the game is over, skip to the next part of the code
  // where I check if the game is won and if it is, then return the well done message and if it is lost,
  // then display the loser message.
  function renderGameStatus() {
    if (!isGameOver && isLastGuessIncorrect) {
      return (
        <p className="farewell-message">
          {getFarewellText(languages[wrongGuessCount - 1].name)}
        </p>
      );
    }
    if (isGameWon) {
      return (
        <>
          <h2>You Win!</h2>
          <p>Well done! 🎉</p>
        </>
      );
    }
    if (isGameLost) {
      return (
        <>
          <h2>Game over!</h2>
          <p>You lose! Better start learning Assembly 😭</p>
        </>
      );
    }
    return null;
  }

  return (
    <>
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word within 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>
      <section aria-live="polite" role="status" className={gameStatusClass}>
        {renderGameStatus()}
      </section>
      <section className="language-chips">{languageElements}</section>
      <section className="word">{letterElements}</section>

      {/*For the screenreader section, it is being hidden by the CSS through its className.
      First p text element is checking to see if the current word includes the lastGuessedLetter. If it does
      it will read out the first message and if it is wrong, it will read out the second message.
      It wil. then read out how many guesses are left based on the deerived value I took from above.*/}
      <section className="sr-only" aria-live="polite" role="status">
        <p>
          {currentWord.includes(lastGuessedLetter)
            ? `Correct! The last letter ${lastGuessedLetter} is in the word.`
            : `Sorry, the letter ${lastGuessedLetter} is not in the word.`}
          You have {numberGuessesLeft} attempt left.
        </p>

        {/* The p second text element: currentWord is split and turnt into an array and then it is mapped over.
        For each letter in the array, if the guessedLetters includes the current letter then read out the letter, 
        otherwise it will read out the blank. The full stop puts a pause between them. .join turns it back into a 
        string for it to be read out. */}
        <p>
          Current word:
          {currentWord
            .split("")
            .map((letter) =>
              guessedLetters.includes(letter) ? letter + "." : "blank."
            )
            .join(" ")}
        </p>
      </section>
      <section className="keyboard">{keyboardElements}</section>
      {isGameOver && <button className="new-game">New Game</button>}
    </>
  );
}

export default App;
