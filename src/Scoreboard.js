import "./Scoreboard.css";
import React, { useRef } from "react";

export default function Scoreboard({
  statistics,
  handleCloseScoreBoard,
  withFade,
}) {
  const ref = useRef(null);

  function handleCloseScoreBoardLocal() {
    const span = ref.current;
    span.className = "scoreboard close";
    handleCloseScoreBoard();
  }

  return (
    <div ref={ref} className={`scoreboard ${withFade ? "fadeIn" : ""}`}>
      <div>
        <button
          className="closeScoreBoardButton"
          onClick={handleCloseScoreBoardLocal}
        >
          X
        </button>
        <div className="you-win-header">You Win!</div>
        <Statistics statistics={statistics} />
        <Distribution gamesWon={statistics.Played} />
      </div>
    </div>
  );
}

function Statistics({ statistics }) {
  return (
    <div className="statistics">
      <div className="statsCube">
        <div className="statNumber">{statistics.Played}</div>
        <div className="statText">Played</div>
      </div>
      <div className="statsCube">
        <div className="statNumber">100</div>
        <div className="statText">Win %</div>
      </div>
      <div className="statsCube">
        <div className="statNumber">{statistics.Streak}</div>
        <div className="statText">Current Streak</div>
      </div>
      <div className="statsCube">
        <div className="statNumber">{statistics.MaxStreak}</div>
        <div className="statText">Max Strike</div>
      </div>
    </div>
  );
}

function Distribution({ gamesWon }) {
  return (
    <div className="distribution">
      <div className="distribution-header">GUESS DISTRIBUTION</div>
      <div className="distribution-rows">
        <div className="dsitributionRow first">
          <div>1</div>
          <div>{gamesWon}</div>
        </div>
        <div className="dsitributionRow">
          <div>2</div>
          <div>0</div>
        </div>
        <div className="dsitributionRow">
          <div>3</div>
          <div>0</div>
        </div>
        <div className="dsitributionRow">
          <div>4</div>
          <div>0</div>
        </div>
        <div className="dsitributionRow">
          <div>5</div>
          <div>0</div>
        </div>
        <div className="dsitributionRow">
          <div>6</div>
          <div>0</div>
        </div>
      </div>
    </div>
  );
}
