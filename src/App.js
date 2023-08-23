import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  return (
    <div className="gameContainer">
      <Header></Header>
      <Game></Game>
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

function Game() {
  const [guess, setGuess] = useState([]);
  const [didEnterClicked, setDidEnterClicked] = useState(false);

  useEffect(() => {
    window.addEventListener("keyup", handleKeyup);

    if (didEnterClicked) {
      window.removeEventListener("keyup", handleKeyup);
    }

    return () => window.removeEventListener("keyup", handleKeyup);
  }, [didEnterClicked, guess]);

  const handleEnterClicked = () => {
    if (guess.length < 5 || didEnterClicked) {
      return;
    }

    setDidEnterClicked(true);
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

    console.log("handle key up", keyVal);
    onClickLetter(keyVal);
  }

  function onClickLetter(letter) {
    console.log("letter is:", letter);
    if (letter === "↩") {
      handleEnterClicked();
      return;
    }

    let guessCopy = guess.slice();
    if (letter === "<") {
      if (guess.length === 0) {
        return;
      }

      console.log("Pooopoing");
      guessCopy.pop();
      setGuess(guessCopy);
      return;
    }

    if (guess.length >= 5) {
      return;
    }

    guessCopy.push(letter);
    console.log(guessCopy);
    setGuess(guessCopy);
  }

  return (
    <div className="game">
      <BoardContainer
        guess={guess}
        didEnterClicked={didEnterClicked}
      ></BoardContainer>
      <Keyboard onClickLetter={onClickLetter}></Keyboard>
    </div>
  );
}

function BoardContainer({ guess, didEnterClicked }) {
  return (
    <div className="boardContainer">
      <Board guess={guess} didEnterClicked={didEnterClicked}></Board>
    </div>
  );
}

function Board({ guess, didEnterClicked }) {
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
      <Row guess={guess} didEnterClicked={didEnterClicked}></Row>
      <Row></Row>
      <Row></Row>
      <Row></Row>
      <Row></Row>
      <Row></Row>
    </div>
  );
}

function Row({ guess, didEnterClicked }) {
  if (guess === undefined) {
    guess = [];
  }

  return (
    <div className="row">
      <Tile letter={guess[0]} didEnterClicked={didEnterClicked}></Tile>
      <Tile letter={guess[1]} didEnterClicked={didEnterClicked}></Tile>
      <Tile letter={guess[2]} didEnterClicked={didEnterClicked}></Tile>
      <Tile letter={guess[3]} didEnterClicked={didEnterClicked}></Tile>
      <Tile letter={guess[4]} didEnterClicked={didEnterClicked}></Tile>
    </div>
  );
}

function Tile({ letter, didEnterClicked }) {
  const [alreadyClickedEnter, setAlreadyClickedEnter] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (alreadyClickedEnter) {
      return;
    }

    if (didEnterClicked) {
      let timeout = setTimeout(() => {
        setWon(true);
        setAlreadyClickedEnter(true);

        return () => clearTimeout(timeout);
      }, 2200);
    }
  }, [alreadyClickedEnter, didEnterClicked]);

  if (didEnterClicked === undefined) {
    didEnterClicked = false;
  }

  if (letter === undefined) {
    letter = "";
  }
  let dataState = letter === "" ? "empty" : "tbd";
  dataState = won ? "correct" : dataState;

  let dataAnimation = didEnterClicked ? "flip" : "";
  dataAnimation = won ? "pop" : dataAnimation;

  let animationDelay = won ? "short" : "long";

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
