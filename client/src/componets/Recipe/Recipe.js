import React from "react";
import "./Recipe.css";

export default function Recipe({ props }) {
  return (
    <div className="recipe">
      <div className="recipe-title">
        <h2 id="title">{props.title}</h2>
        <div className="recipe-body">
          <img className="recipe-img" src={props.image} alt="img not found" />
        </div>
        <div className="recipe-diets">
          {props.diets &&
            props.diets.map((d) => {
              return (
                <span className="diet">{d.name.replaceAll("_", " ")}</span>
              );
            })}
        </div>
      </div>
    </div>
  );
}
