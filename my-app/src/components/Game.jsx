import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../index.css";

import Hole from "../assets/Hole.jpeg";
import mole from "../assets/mole.png";
import whackMusic from "../assets/whack.mp3";

function Game() {
  const [moles, setMoles] = useState(new Array(9).fill(false));
  const [timer, setTimer] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("highScore");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [playerName, setPlayerName] = useState("");
  const [playerId, setPlayerId] = useState(null);

  const navigate = useNavigate();
  const audioRef = useRef(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (storedUser) {
      setPlayerName(storedUser.username);
      setPlayerId(storedUser.id);
    } else {
      alert("You must be logged in to play!");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
      localStorage.setItem("highScore", score);

      if (playerId) {
        axios.patch(`/gamers/${playerId}`, { score })
          .then(() => console.log("Score updated successfully"))
          .catch(err => console.log("Failed to update score", err));
      }
    }
  }, [gameOver, score, highScore, playerId]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * moles.length);
      const newMoles = new Array(9).fill(false);
      newMoles[randomIndex] = true;
      setMoles(newMoles);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameOver, moles.length]);

  useEffect(() => {
    if (timer <= 0) {
      setGameOver(true);
      setMoles(new Array(9).fill(false));
      return;
    }
    const timerId = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [timer]);

  const handleMoleClick = (index) => {
    if (moles[index] && !gameOver) {
      setScore(prev => prev + 20);
      const newMoles = [...moles];
      newMoles[index] = false;
      setMoles(newMoles);
    }
  };

  const handlePlayAgain = () => {
    setScore(0);
    setTimer(30);
    setGameOver(false);
    setMoles(new Array(9).fill(false));
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  return (
    <div className="game-container" style={{ position: "relative", textAlign: "center" }}>
      <audio ref={audioRef} src={whackMusic} loop autoPlay />

      <div style={{ marginBottom: "20px" }}>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "12px",
          backgroundColor: "#111",
          color: "#00ff90",
          padding: "10px 14px",
          borderRadius: "8px",
          boxShadow: "0 0 8px rgba(0, 255, 100, 0.5)",
          display: "inline-block",
          marginRight: "10px"
        }}>
          🎮 Player: {playerName}
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      <div className="status-bar" style={{ display: "flex", gap: "20px", marginBottom: "20px", justifyContent: "center" }}>
        <div style={{ fontSize: "20px", fontWeight: "bold", padding: "8px 12px", backgroundColor: "#ffd700", borderRadius: "8px", color: "#333", userSelect: "none" }}>⏳ Time Left: {timer}s</div>
        <div style={{ fontSize: "20px", fontWeight: "bold", padding: "8px 12px", backgroundColor: "#ffd700", borderRadius: "8px", color: "#333", userSelect: "none" }}>🏆 Score: {score}</div>
        <div style={{ fontSize: "20px", fontWeight: "bold", padding: "8px 12px", backgroundColor: "#ffd700", borderRadius: "8px", color: "#333", userSelect: "none" }}>🥇 High Score: {highScore}</div>
      </div>

      <div className="grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "10px",
        width: "330px",
        margin: "0 auto"
      }}>
        {moles.map((isMole, index) => (
          <img
            key={index}
            src={isMole ? mole : Hole}
            alt={isMole ? "Mole" : "Hole"}
            style={{
              width: "100px",
              height: "100px",
              cursor: "pointer",
              borderRadius: "8px"
            }}
            onClick={() => handleMoleClick(index)}
          />
        ))}
      </div>

      {gameOver && (
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "rgba(0,0,0,0.9)",
          color: "white",
          padding: "40px",
          borderRadius: "10px",
          textAlign: "center",
          fontSize: "24px"
        }}>
          GAME OVER!
          <div style={{ fontSize: "18px", margin: "20px 0" }}>Final Score: {score}</div>
          <div>
            <button
              onClick={handlePlayAgain}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginRight: "10px"
              }}
            >
              Play Again
            </button>
            <button
              onClick={() => navigate("/")}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;