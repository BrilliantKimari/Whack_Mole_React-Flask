import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Registerpage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/gamers", { username, email, password });
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Create Your Character</h2>
      <input
        placeholder="Character Name"
        required
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={styles.input}
      />
      <input
        placeholder="Email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />
      <input
        placeholder="Password"
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />
      <button type="submit" style={styles.button}>Register</button>
      <button
        type="button"
        style={styles.loginButton}
        onClick={() => navigate("/login")}
      >
        Already have an account? Login
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
  loginButton: {
    padding: "10px 20px",
    fontSize: "14px",
    cursor: "pointer",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "4px"
  }
};

export default Registerpage;