const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define("Recipe", {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    spoonacularScore: {
      type: DataTypes.REAL,
    },
    healthScore: {
      type: DataTypes.REAL,
    },
    analyzedInstructions: {
      type: DataTypes.ARRAY(DataTypes.JSON),
    },
    image: {
      type: DataTypes.STRING,
    },
    //Marcas de tiempo: falsa
  });
};
