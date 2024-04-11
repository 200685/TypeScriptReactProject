import { useCallback, useEffect, useState } from "react";
import HangmanDrawing from "./HangmanDrawing";
import HangmanWord from "./HangmanWord";
import Keyboard from "./Keyboard";
import words from "./WordList.json";
import styles from "./StyleCSSKeyboard.module.css"; // Corrected CSS module import

function getWord() {
  return words[Math.floor(Math.random() * words.length)];
}

function App() {
  const [wordToGuess, setWordToGuess] = useState(getWord);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

  const incorrectLetters = guessedLetters.filter(
    letter => !wordToGuess.includes(letter)
  );

  const isLoser = incorrectLetters.length >= 6;
  const isWinner = wordToGuess.split("").every(letter => guessedLetters.includes(letter));

  const addGuessedLetter = useCallback((letter: string) => {
    if (guessedLetters.includes(letter) || isLoser || isWinner) return;

    setGuessedLetters(currentLetters => [...currentLetters, letter]);
  }, [guessedLetters, isWinner, isLoser]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase(); // Ensure it works with both lower and uppercase
      if (key.match(/^[a-z]$/) && !isWinner && !isLoser) {
        e.preventDefault();
        addGuessedLetter(key);
      } else if (key === "Enter") {
        e.preventDefault();
        setGuessedLetters([]);
        setWordToGuess(getWord());
      }
    };

    document.addEventListener("keypress", handler);
    return () => document.removeEventListener("keypress", handler);
  }, [addGuessedLetter, isWinner, isLoser]);

  return (
    <div
      className={styles.app} // Example of using CSS module for styling
      style={{
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        margin: "0 auto",
        alignItems: "center",
      }}
    >
      <div style={{ fontSize: "2rem", textAlign: "center" }}>
        {isWinner ? "Winner! - Press Enter to try again" : ""}
        {isLoser ? "Nice Try - Press Enter to try again" : ""}
      </div>
      <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
      <HangmanWord
        reveal={isLoser}
        guessedLetters={guessedLetters}
        wordToGuess={wordToGuess}
      />
      <Keyboard
        className={styles.keyboard} // Applying CSS module styles
        disabled={isWinner || isLoser}
        activeLetters={guessedLetters.filter(letter =>
          wordToGuess.includes(letter)
        )}
        inactiveLetters={incorrectLetters}
        addGuessedLetter={addGuessedLetter}
      />
    </div>
  );
}

export default App;
