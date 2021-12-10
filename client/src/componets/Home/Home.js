import React from "react";

import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-page">
      <h1>Planifica Tus Comidas</h1>
      <Link to="/recipes">
        <button id="home-button">Comienza ya</button>
      </Link>
    </div>
  );
}
