import "./App.css";
import Scoreboard from "./Scoreboard";
import React, { useState, useEffect, useRef } from "react";
const allowedWords = require("./AllowedWords.js");

function App() {
  const [showScoreboard, setShowscorebaord] = useState(false);
  const [didGuessWrong, setDidGuessWrong] = useState(false);

  let statistics = loadInitialStatistics();

  function handleWrongWord() {
    setDidGuessWrong(true);

    setTimeout(() => {
      setDidGuessWrong(false);
    }, 1000);
  }

  function handleDidWin() {
    increaseStatisticsAndSave(statistics);

    setTimeout(() => {
      setShowscorebaord(true);
    }, 3100);
  }

  return (
    <div className="gameContainer">
      <Header></Header>
      <Game
        handleDidWin={handleDidWin}
        handleWrongWord={handleWrongWord}
      ></Game>
      {didGuessWrong && <div className="toast">"Not in the word list"</div>}
      {showScoreboard && <Scoreboard statistics={statistics} />}
    </div>
  );
}

function Header() {
  return (
    <div className="header">
      <div className="headerTitle">Wordle</div>
      <div className="headerTitle_in1">(in 1)</div>
    </div>
  );
}

function Game({ handleDidWin, handleWrongWord }) {
  const [guess, setGuess] = useState([]);
  const [didEnterClicked, setDidEnterClicked] = useState(false);
  const [didWin, setDidWin] = useState(false);

  useEffect(() => {
    window.addEventListener("keyup", handleKeyup);

    if (didWin) {
      window.removeEventListener("keyup", handleKeyup);
    }

    return () => window.removeEventListener("keyup", handleKeyup);
  }, [didWin, guess]);

  const handleEnterClicked = () => {
    if (guess.length < 5 || didWin) {
      return;
    }

    setDidEnterClicked(true);
    setTimeout(() => {
      setDidEnterClicked(false);
    }, 100);
    if (!isAllowedWord(guess)) {
      handleWrongWord();
      return;
    }

    setDidWin(true);
    handleDidWin();
  };

  function handleKeyup({ key }) {
    var keyVal = "";
    if (key === "Enter") {
      keyVal = "↩";
    }
    if (key === "Backspace") {
      keyVal = "<";
    }
    if (/^[A-Za-z]$/.test(key)) {
      keyVal = key.toUpperCase();
    }

    if (keyVal === "") {
      return;
    }

    onClickLetter(keyVal);
  }

  function onClickLetter(letter) {
    if (letter === "↩") {
      handleEnterClicked();
      return;
    }

    let guessCopy = guess.slice();
    if (letter === "<") {
      if (guess.length === 0) {
        return;
      }

      guessCopy.pop();
      setGuess(guessCopy);
      return;
    }

    if (guess.length >= 5) {
      return;
    }

    guessCopy.push(letter);
    setGuess(guessCopy);
  }

  return (
    <div className="game">
      <BoardContainer
        guess={guess}
        didWin={didWin}
        didEnterClicked={didEnterClicked}
      ></BoardContainer>
      <Keyboard onClickLetter={onClickLetter}></Keyboard>
    </div>
  );
}

function BoardContainer({ guess, didWin, didEnterClicked }) {
  return (
    <div className="boardContainer">
      <Board
        guess={guess}
        didWin={didWin}
        didEnterClicked={didEnterClicked}
      ></Board>
    </div>
  );
}

function Board({ guess, didWin, didEnterClicked }) {
  const [currentBoardWidth, setBoardWidth] = useState(0);
  const [currentBoardHeight, setBoardHeight] = useState(0);

  useEffect(() => {
    window.addEventListener("resize", setDimensions);
    setDimensions();
    return () => {
      window.removeEventListener("resize", setDimensions);
    };
  }, []);

  function setDimensions() {
    var newBoardHeight;
    var newBoardWidth;

    var maxWindowHeight;
    var minWindowHeight;

    var maxBoardHeight = 420;
    var maxBoardWidth = 360;

    var minBoardHeight;
    var minBoardwidth;

    var windowHeight = window.innerHeight;

    var isMobile = window.innerWidth < 768;
    if (isMobile) {
      maxWindowHeight = 700;
      minWindowHeight = 500;

      minBoardHeight = 220;
      minBoardwidth = 160;
    } else {
      maxWindowHeight = 900;
      minWindowHeight = 840;

      minBoardHeight = 360;
      minBoardwidth = 300;
    }

    if (windowHeight > maxWindowHeight) {
      newBoardHeight = maxBoardHeight;
      newBoardWidth = maxBoardWidth;
    } else if (windowHeight < minWindowHeight) {
      newBoardHeight = minBoardHeight;
      newBoardWidth = minBoardwidth;
    } else {
      newBoardHeight = maxBoardHeight - (maxWindowHeight - windowHeight);
      newBoardWidth = maxBoardWidth - (maxWindowHeight - windowHeight);
    }

    if (newBoardHeight !== currentBoardHeight) {
      setBoardHeight(newBoardHeight);
      setBoardWidth(newBoardWidth);
    }
  }

  const divStyle = {
    width: currentBoardWidth,
    height: currentBoardHeight,
  };

  return (
    <div className="board" style={divStyle}>
      <Row
        guess={guess}
        didWin={didWin}
        didEnterClicked={didEnterClicked}
      ></Row>
      <Row></Row>
      <Row></Row>
      <Row></Row>
      <Row></Row>
      <Row></Row>
    </div>
  );
}

function Row({ guess, didWin, didEnterClicked }) {
  const ref = useRef(null);

  if (guess === undefined) {
    guess = [];
  }

  if (didEnterClicked === undefined) {
    didEnterClicked = false;
  }

  useEffect(() => {
    if (guess.length === 0) {
      return;
    }

    if (didEnterClicked) {
      if (!isAllowedWord(guess)) {
        const span = ref.current;
        span.className = "row invalid";
      }

      setTimeout(() => {
        const span = ref.current;
        span.className = "row";
      }, 600);
    }
  });

  return (
    <div ref={ref} className="row">
      <Tile letter={guess[0]} didWin={didWin}></Tile>
      <Tile letter={guess[1]} didWin={didWin}></Tile>
      <Tile letter={guess[2]} didWin={didWin}></Tile>
      <Tile letter={guess[3]} didWin={didWin}></Tile>
      <Tile letter={guess[4]} didWin={didWin}></Tile>
    </div>
  );
}

function Tile({ letter, didWin }) {
  const [alreadyClickedEnter, setAlreadyClickedEnter] = useState(false);
  const [won, setWon] = useState(false);
  const [currentLetter, setCurrentLetter] = useState("");

  if (didWin === undefined) {
    didWin = false;
  }

  useEffect(() => {
    if (alreadyClickedEnter) {
      return;
    }

    if (didWin) {
      let timeout = setTimeout(() => {
        setWon(true);
        setAlreadyClickedEnter(true);

        return () => clearTimeout(timeout);
      }, 2200);
    }
  }, [alreadyClickedEnter, didWin]);

  if (letter === undefined) {
    letter = "";
  }
  let dataState = letter === "" ? "empty" : "tbd";
  dataState = won ? "correct" : dataState;

  let dataAnimation = didWin ? "flip" : "";
  dataAnimation = won ? "pop" : dataAnimation;

  let animationDelay = won ? "short" : "long";

  if (currentLetter === "" && letter !== "") {
    dataAnimation = "bounce";
    animationDelay = "no";
    setTimeout(() => {
      setCurrentLetter(letter);
    }, 200);
  } else {
    if (currentLetter !== "" && letter === "") {
      setCurrentLetter(letter);
    }
  }

  return (
    <div
      className="tile"
      data-state={dataState}
      data-animation={dataAnimation}
      animation-delay={animationDelay}
    >
      {letter}
    </div>
  );
}

function Keyboard({ onClickLetter }) {
  var firstRowLetters = ["Q", "w", "E", "R", "T", "Y", "U", "I", "O", "P"];
  var secondRowLetters = [
    "spacer",
    "A",
    "S",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "spacer",
  ];
  var thirdRowLetters = ["enter", "Z", "X", "C", "V", "B", "N", "M", "<"];

  return (
    <div className="keyboard">
      <KeyboardRow
        letters={firstRowLetters}
        onClickLetter={onClickLetter}
      ></KeyboardRow>
      <KeyboardRow
        letters={secondRowLetters}
        onClickLetter={onClickLetter}
      ></KeyboardRow>
      <KeyboardRow
        letters={thirdRowLetters}
        onClickLetter={onClickLetter}
      ></KeyboardRow>
    </div>
  );
}

function KeyboardRow({ letters, onClickLetter }) {
  var buttons = letters.map((letter, index) => {
    if (letter === "spacer") {
      return <div className="spacer" key={index}></div>;
    }

    if (letter === "enter") {
      letter = "↩";
    }

    return (
      <button
        className="key"
        key={letter}
        data-key={letter}
        onClick={() => {
          onClickLetter(letter);
        }}
      >
        {letter}
      </button>
    );
  });
  return <div className="keyboardRow">{buttons}</div>;
}

export default App;

function loadInitialStatistics() {
  let statistics = JSON.parse(localStorage.getItem("statistics"));
  if (statistics === null) {
    statistics = {
      Played: 0,
      Streak: 0,
      MaxStreak: 0,
      LastTimePlayed: new Date().toString(),
    };
  }

  statistics.LastTimePlayed = new Date(statistics.LastTimePlayed);
  if (isBeforeYesterday(statistics.LastTimePlayed)) {
    statistics.Streak = 0;
  }

  return statistics;
}

function increaseStatisticsAndSave(statistics) {
  statistics.Streak += 1;
  statistics.Played += 1;
  if (statistics.MaxStreak < statistics.Streak) {
    statistics.MaxStreak += 1;
  }
  statistics.LastTimePlayed = new Date();

  localStorage.setItem("statistics", JSON.stringify(statistics));
}

function isBeforeYesterday(date) {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for accurate comparison

  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);

  return date < yesterday;
}

function isAllowedWord(guess) {
  return allowedWords[guess.join("").toLowerCase()];
}
