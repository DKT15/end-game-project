import React from "react";
import "./App.css";
import { clsx } from "clsx";
import { languages } from "./languages";

function App() {
  const [currentWord, setCurrentWord] = React.useState("react");
  const [guessedLetters, setGuessedLetters] = React.useState([]);

  // global variable used throughout code.
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  //If the previous letters include the current letter then nothing happens and the previous letter is returned. However of the letter is new, then it is added onto the previous letters.
  // this also stops a duplication of letters.
  // The function is on keyboardElements buttons as I map through each letter from the alphabet and give it a button. There the user will interact
  // And their guess will be passed in here.
  function addGuessedLetter(letter) {
    setGuessedLetters((prevLetters) =>
      prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]
    );
  }

  //mapping over all the languages in the languages.js file. For every language it will be a span and will have its colour and background color applied along with a className
  //and key. language.name has been tapped into to get to additional properties needed from the js file.
  const languageElements = languages.map((language) => {
    const styles = {
      backgroundColor: language.backgroundColor,
      color: language.color,
    };
    return (
      <span className="chip" style={styles} key={language.name}>
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
    //Each letter is checked against whether or not it is correct and will turn red or green when clicked.
    // If correct it will turn green and be added to the letter elements.
    // If wrong it will turn red and won't be added to the letter elements. Refer to the above code.
    return (
      <button
        className={className}
        key={letter}
        onClick={() => addGuessedLetter(letter)}
      >
        {letter.toUpperCase()}
      </button>
    );
  });

  return (
    <>
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word within 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>
      <section className="game-status">
        <h2>You win!</h2>
        <p>Well done! 🎉</p>
      </section>
      <section className="language-chips">{languageElements}</section>
      <section className="word">{letterElements}</section>
      <section className="keyboard">{keyboardElements}</section>
      <button className="new-game">New Game</button>
    </>
  );
}

export default App;
