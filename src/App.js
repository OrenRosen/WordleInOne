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
  return (
    <div className="game">
      <BoardContainer></BoardContainer>
      <Keyboard></Keyboard>
    </div>
  );
}

function BoardContainer() {
  return (
    <div className="boardContainer">
      <Board></Board>
    </div>
  );
}

function Board() {
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
      <Row></Row>
      <Row></Row>
      <Row></Row>
      <Row></Row>
      <Row></Row>
      <Row></Row>
    </div>
  );
}

function Row() {
  return (
    <div className="row">
      <Tile></Tile>
      <Tile></Tile>
      <Tile></Tile>
      <Tile></Tile>
      <Tile></Tile>
    </div>
  );
}

function Tile() {
  return <div className="tile" data-state="empty"></div>;
}

function Keyboard() {
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
      <KeyboardRow letters={firstRowLetters}></KeyboardRow>
      <KeyboardRow letters={secondRowLetters}></KeyboardRow>
      <KeyboardRow letters={thirdRowLetters}></KeyboardRow>
    </div>
  );
}

function KeyboardRow({ letters }) {
  var buttons = letters.map((letter, index) => {
    if (letter === "spacer") {
      return <div className="spacer" key={index}></div>;
    }

    if (letter === "enter") {
      letter = "↩";
    }

    return (
      <button className="key" key={letter} data-key={letter}>
        {letter}
      </button>
    );
  });
  return <div className="keyboardRow">{buttons}</div>;
}

export default App;
