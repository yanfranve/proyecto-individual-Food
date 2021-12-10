const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const { Recipe, Diet } = require("../db.js");
const axios = require("axios");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

//importo la apikey
require("dotenv").config();
const { API_KEY_4 } = process.env;

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

const getApiInfo = async (name) => {
  const responseApi = await axios.get(
    `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY_4}&addRecipeInformation=true&number=100`
  );
  var recipesAPI = responseApi.data.results;
  if (name) {
    //si se recibe un nombre
    recipesAPI = recipesAPI.filter((recipe) => {
      //filtrar la recetas por nombre
      return recipe.title.toUpperCase().includes(name.toUpperCase());
    });
  }
  //manteniendo solo los componetes  requeridos
  recipesAPI = recipesAPI.map((r) => {
    return {
      id: r.id,
      title: r.title,
      summary: r.summary,
      spoonacularScore: r.spoonacularScore,
      healthScore: r.healthScore,
      Instructions: r.Instructions,
      image: r.image,
      diets: r.diets.map((e) => {
        return { id: null, name: e };
      }),
    };
  });
  return recipesAPI;
};

const getDbRecipesName = async (name) => {
  return await Recipe.findAll({
    where: {
      //verificar que el nombre esté incluido en el título
      title: { [Op.like]: `%${name}%` },
    },
    include: Diet,
  });
};

const getDbRecipes = async () => {
  return await Recipe.findAll({
    include: Diet,
  });
};

//GET /recipes?name="..."
router.get("/recipes", async function (req, res, next) {
  try {
    var { name } = req.query;
    var recipesDB;
    var recipesAPI = await getApiInfo(name); //obtiene recetas api
    if (name !== undefined) {
      recipesDB = await getDbRecipesName(name); //obtiene recetas de db por nombre
    }
    if (name === undefined) {
      recipesDB = await getDbRecipes(); //si el nombre no está definido, obtiene todas las recetas de la base de datos
    }
    return res.json(
      recipesAPI.concat(recipesDB) ? recipesAPI.concat(recipesDB) : []
    ); //une ambas tablas y las devuelve
    //return res.status(404).json([]);
  } catch (err) {
    next(err);
  }
});

//GET /recipes/{idRecipe}--------------------------------------------------
router.get("/recipes/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    //recupero receta con id de la base de datos
    if (id.length >= 10 && typeof id === "string") {
      const recipe = await Recipe.findByPk(id, {
        include: Diet,
      });
      return res.json(recipe);
    }
    //si no la encontre en la db, busco en la api
    const recipeAPI = await axios.get(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY_4}`
    );
    recipe = {
      id: recipeAPI.data.id,
      title: recipeAPI.data.title,
      summary: recipeAPI.data.summary,
      spoonacularScore: recipeAPI.data.spoonacularScore,
      healthScore: recipeAPI.data.healthScore,
      analyzedInstructions: recipeAPI.data.analyzedInstructions,
      image: recipeAPI.data.image,
      diets: recipeAPI.data.diets,
      dishTypes: recipeAPI.data.dishTypes,
    };
    return res.json(recipe);
  } catch (err) {
    next(err);
  }
});

//GET /types--------------------------------------------------------------
router.get("/types", async function (req, res) {
  //busco los tipos de dieta en la base de datos
  const diets = await Diet.findAll();
  res.json(diets);
});

//POST /recipe------------------------------------------------------------
router.post("/recipe", async function (req, res, next) {
  try {
    const {
      title,
      summary,
      spoonacularScore,
      healthScore,
      analyzedInstructions,
      image,
      diets,
    } = req.body;
    //creo una receta con los datos recibidos
    const [recipeCreated] = await Recipe.findOrCreate({
      where: {
        id: uuidv4(),
        title,
        summary,
        spoonacularScore,
        healthScore,
        analyzedInstructions,
        image,
      },
    });

    await recipeCreated.setDiets(diets);
    res.json({ obj: recipeCreated });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
