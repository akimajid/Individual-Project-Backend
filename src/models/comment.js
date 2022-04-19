const { DataTypes } = require("sequelize")

const Comment = (sequelize) => {
    return sequelize.define("Comment", {
        comment: {
            type: DataTypes.STRING,
        }
    })
}

module.exports = Comment