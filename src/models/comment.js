const { DataTypes } = require("sequelize");

const Comment = (sequelize) => {
  return sequelize.define("Comment", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
    },
  });
};

module.exports = Comment;
