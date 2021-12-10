import React, { useEffect } from "react";

import { addRecipe, getDiets } from "../../actions/index.js";
import { connect } from "react-redux";
import "./Create.css";
import { Link } from "react-router-dom";

export function Create(props) {
  const [state, setState] = React.useState({
    title: "",
    summary: "",
    spoonacularScore: 0,
    healthScore: 0,
    analyzedInstructions: [""],
    image: "",
    diets: [],
  });
  const [answer, setAnswer] = React.useState({});
  const [errors, setErrors] = React.useState({});

  const handleInputChange = function (e) {
    //establece el estado del formulario y todos los errores correspondientes
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
    setErrors(
      validate({
        ...state,
        [e.target.name]: e.target.value,
      })
    );
  };

  const handleSubmit = function () {
    //envía el formulario completo enviando la acción que agrega la receta a la base de datos
    props.addRecipe(state);
  };

  const handleSelection = function (e) {
    //agrega la dieta seleccionada a la matriz de dietas seleccionadas, si aún no se ha seleccionado
    var array = state.diets;
    var found = array.find((d) => d === parseInt(e.target.value));
    if (!found && found !== "see-all") {
      array.push(parseInt(e.target.value));
      setState({
        ...state,
        diets: array,
      });
      setErrors(
        validate({
          ...state,
          diets: array,
        })
      );
    }
  };

  const deleteThis = function (e) {
    //elimina un elemento de la lista de dietas seleccionadas
    var filtered = state.diets.filter((d) => d !== e);
    setState({
      ...state,
      diets: filtered,
    });
  };

  const addStep = function (e) {
    //agrega un campo de entrada vacío a la matriz de instrucciones
    var array = state.analyzedInstructions;
    array.push("");
    setState({
      ...state,
      analyzedInstructions: array,
    });
  };

  const removeStep = function (idx) {
    //elimina el campo de entrada de la matriz de instrucciones por idx pasado
    var removed = state.analyzedInstructions;
    removed.splice(idx, 1);
    setState({
      ...state,
      analyzedInstructions: removed,
    });
  };

  const changeStep = function (e, idx) {
    var array = state.analyzedInstructions;
    array[idx] = e.target.value;
    setState({
      ...state,
      analyzedInstructions: array,
    });
  };

  const validate = function (state) {
    let errors = {};
    let urlExpression =
      /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    var urlRegex = new RegExp(urlExpression);

    if (!state.title) {
      errors.title = "Title is required";
    }
    if (!state.summary) {
      errors.summary = "Summary is required";
    }
    if (typeof state.spoonacularScore !== "number") {
      errors.spoonacularScore = "Score is invalid";
    } else if (state.spoonacularScore > 100 || state.spoonacularScore < 0) {
      errors.spoonacularScore = "Score must be a value between 0-100";
    }
    if (typeof state.healthScore !== "number") {
      errors.healthScore = "Score is invalid";
    } else if (state.healthScore > 100 || state.healthScore < 0) {
      errors.healthScore = "Score must be a value between 0-100";
    }
    if (!urlRegex.test(state.image)) {
      errors.image = "Url is invalid";
    }
    if (state.diets.length < 1) {
      errors.diets = "Select at least one diet";
    }
    return errors;
  };

  useEffect(() => {
    props.getDiets();
    props.addRecipe(false);
    setErrors(validate(state));
  }, []);

  useEffect(() => {
    if (!props.recipe.default) {
      setAnswer(props.recipe);
    }
  }, [props.recipe]);

  useEffect(() => {
    //corrige el bucle de alerta al volver
    if (answer.msg) {
      alert(answer.msg);
      delete answer.msg;
    }
  }, [answer]);

  return (
    <div className="create">
      <div className="form-box">
        <div>
          <h2 className="title">Crear Receta</h2>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="container">
            <div className="column">
              <div className="field">
                <label>Titulo</label>
                <input
                  className="input-box"
                  placeholder="Titulo..."
                  name="title"
                  value={state.title}
                  onChange={handleInputChange}
                ></input>
                {errors.title && <span classname="error">{errors.title}</span>}
              </div>

              <div className="field">
                <label>Puntaje</label>
                <input
                  className="input-box"
                  name="spoonacularScore"
                  placeholder="Puntaje.."
                  value={state.spoonacularScore}
                  onChange={handleInputChange}
                ></input>
                {errors.spoonacularScore && (
                  <span classname="error">{errors.spoonacularScore}</span>
                )}
              </div>

              <div className="field">
                <label>Puntaje de Salud</label>
                <input
                  className="input-box"
                  name="healthScore"
                  placeholder="Puntaje de Salud..."
                  value={state.healthScore}
                  onChange={handleInputChange}
                ></input>
                {errors.healthScore && (
                  <span classname="error">{errors.healthScore}</span>
                )}
              </div>

              <div className="field">
                <label>Image url</label>
                <input
                  className="input-box"
                  name="image"
                  placeholder="Image url..."
                  value={state.image}
                  onChange={handleInputChange}
                ></input>
                {errors.image && <span classname="error">{errors.image}</span>}
              </div>
            </div>

            <div className="column">
              <div className="field">
                <label>Resumen</label>
                <textarea
                  className="input-box"
                  placeholder="Resumen..."
                  name="summary"
                  value={state.summary}
                  onChange={handleInputChange}
                ></textarea>
                {errors.summary && (
                  <span classname="error">{errors.summary}</span>
                )}
              </div>

              <div className="field">
                <label>Diet types</label>
                <select
                  name="diet-selector"
                  defaultValue="vegan"
                  onChange={handleSelection}
                >
                  {props.diets.map((diet) => {
                    return <option value={diet.id}>{diet.name}</option>;
                  })}
                </select>
                {errors.diets && <span classname="error">{errors.diets}</span>}
              </div>

              <div className="field">
                <label>Selected diets:</label>
                <div className="diet-box">
                  <ul>
                    {state.diets.length === 0 && <li>No diets selected.</li>}
                    {state.diets.length !== 0
                      ? state.diets.map((diet) => {
                          var x = props.diets.find((e) => e.id === diet);
                          return (
                            <li>
                              {x.name}
                              <button
                                className="remove-diet-button"
                                onClick={() => deleteThis(diet)}
                              >
                                x
                              </button>
                            </li>
                          );
                        })
                      : []}
                  </ul>
                </div>
              </div>
            </div>

            <div className="column">
              <div className="field">
                <label>Steps</label>
                <button className="add-button" onClick={(e) => addStep(e)}>
                  Add Step
                </button>
                <div className="step-list">
                  {state.analyzedInstructions.map((step, idx) => {
                    return (
                      <div key={idx}>
                        <input
                          placeholder={`Step ${idx + 1}`}
                          value={step}
                          onChange={(e) => changeStep(e, idx)}
                        ></input>
                        <button onClick={() => removeStep(idx)}>x</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="submit-button-box">
            {Object.keys(errors).length < 1 ? (
              <button id="submit-button" type="submit">
                Agregada Receta
              </button>
            ) : (
              <button id="submit-button" type="submit" disabled>
                Agregar Receta
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="retro">
        <Link to="/">
          <button className="retro">Volver</button>
        </Link>
      </div>
      ;
    </div>
  );
}
function mapStateToProps(state) {
  return {
    recipe: state.postedRecipe,
    diets: state.dietsLoaded,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addRecipe: (recipe) => dispatch(addRecipe(recipe)),
    getDiets: () => dispatch(getDiets()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Create);
