"use client";

import { CharacterStatusEnum } from "../types/CharacterStatusEnum";
import { GameStateEnum } from "../types/GameStateEnum";
import { Guess } from "../types/Guess";
import { KeyboardConfig } from "../utils/keyboardConfig";
import Character from "./Character";
import { useEffect, useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

export default function WordleContainer() {
  const correctWord = "WORDLE";
  const [guess, setGuess] = useState<string[]>(["W", "O", "R", "D", "L", "E"]);
  const [previousGuesses, setPreviousGuesses] = useState<Guess[]>([]);
  const [gameState, setGameState] = useState<GameStateEnum>(
    GameStateEnum.IN_PROGRESS
  );

  const isCharacterRegex = /^[A-Z]$/;

  const getCharacterStatus = ({
    character,
    index,
  }: {
    character: string;
    index: number;
  }) => {
    if (!correctWord.includes(character)) return CharacterStatusEnum.WRONG;
    else if (correctWord[index] === character)
      return CharacterStatusEnum.CORRECT;
    else return CharacterStatusEnum.WRONG_PLACE;
  };

  const handleVirtualKeyPress = (
    button: string,
    e?: MouseEvent | undefined
  ) => {
    let keyInput: string;

    switch (button) {
      case "{ent}":
        keyInput = "Enter";
        break;
      case "{backspace}":
        keyInput = "Backspace";
        break;
      default:
        keyInput = button;
    }

    handleGuessInput(keyInput);
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    handleGuessInput(event.key);
  };

  const handleGuessInput = (keyInput: string) => {
    console.log(keyInput);
    if (keyInput === "Enter") {
      if (guess.length !== correctWord.length) return;

      setPreviousGuesses([
        ...previousGuesses,
        {
          characters: guess.map((character, index) => ({
            character,
            character_status: getCharacterStatus({ character, index }),
          })),
        },
      ]);

      if (guess.join("") === correctWord) {
        setGameState(GameStateEnum.VICTORY);
      } else if (previousGuesses.length === 5) {
        setGameState(GameStateEnum.DEFEAT);
      }

      setGuess([]);
    }

    if (keyInput === "Backspace") {
      if (guess.length) {
        setGuess(guess.slice(0, guess.length - 1));
      }
      return;
    }
    if (guess.length === correctWord.length) return;

    const character = keyInput.toUpperCase();
    if (!isCharacterRegex.test(character)) {
      return;
    }

    setGuess([...guess, character]);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [guess]);

  const resetGame = () => {
    setGuess([]);
    setPreviousGuesses([]);
    setGameState(GameStateEnum.IN_PROGRESS);
  };

  return (
    <div className="h-full grow flex flex-col">
      <div className="w-full grow flex flex-col justify-center">
        {previousGuesses.map((guess, guessIndex) => (
          <div key={guessIndex} className="w-full flex justify-center">
            {guess.characters.map((guessCharacter, index) => (
              <Character
                key={`${guessIndex}_${index}`}
                character={guessCharacter.character}
                character_status={guessCharacter.character_status}
              ></Character>
            ))}
          </div>
        ))}
        {gameState === GameStateEnum.IN_PROGRESS && (
          <div className="w-full flex justify-center">
            {correctWord.split("").map((_, index) => (
              <Character
                key={index}
                character={guess.length > index ? guess[index] : " "}
              ></Character>
            ))}
          </div>
        )}
      </div>
      {gameState === GameStateEnum.DEFEAT && (
        <div className="w-full flex justify-center p-5">
          <button
            className="bg-black hover:bg-white hover:text-black text-white border-solid border-2 border-white-500 font-bold py-2 px-4 rounded"
            onClick={resetGame}
          >
            Try again?
          </button>
        </div>
      )}
      {gameState === GameStateEnum.VICTORY && (
        <div className="w-full flex justify-center p-5">
          <button
            className="bg-black hover:bg-white hover:text-black text-white border-solid border-2 border-white-500 font-bold py-2 px-4 rounded"
            onClick={resetGame}
          >
            Congratulations! Go again?
          </button>
        </div>
      )}
      {gameState === GameStateEnum.IN_PROGRESS && (
        <div className="w-11/12 sm:w-full mb-3 flex justify-center">
          <Keyboard
            theme={"hg-theme-default myTheme1"}
            layoutName={"default"}
            onKeyPress={handleVirtualKeyPress}
            layout={KeyboardConfig.layout}
            display={KeyboardConfig.display}
          />
        </div>
      )}
    </div>
  );
}
