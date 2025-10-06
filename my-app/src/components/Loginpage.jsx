import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Loginpage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/gamers/login", { email, password });
      localStorage.setItem("loggedInUser", JSON.stringify(res.data.gamer));
      onLogin(res.data.gamer);
      alert("Login successful!");
      navigate("/game");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin} style={styles.form}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
        required
      />
      <button type="submit" style={styles.button}>Login</button>
      <button
        type="button"
        style={styles.registerButton}
        onClick={() => navigate("/")}
      >
        Don't have an account? Register
      </button>
    </form>
  );
}

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    width: "300px",
    margin: "100px auto",
    textAlign: "center"
  },
  input: {
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "4px"
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px"
  },
  registerButton: {
    padding: "10px 20px",
    fontSize: "14px",
    cursor: "pointer",
    backgroundColor: "#FF9800",
    color: "white",
    border: "none",
    borderRadius: "4px"
  }
};

export default Loginpage;