import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registerpage from "./components/Registerpage";
import Loginpage from "./components/Loginpage";
import Game from "./components/Game";

export default function App() {
  const [gamer, setGamer] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Registerpage />} />
        <Route path="/login" element={<Loginpage onLogin={setGamer} />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </Router>
  );
}