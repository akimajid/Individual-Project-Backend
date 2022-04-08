const { Sequelize } = require("sequelize")
const mysqlConfig = require("../configs/database")

const sequelize = new Sequelize({
    username: mysqlConfig.MYSQL_USERNAME,
    password: mysqlConfig.MYSQL_PASSWORD,
    database: mysqlConfig.MYSQL_DB_NAME,
    port: 3306,
    dialect: "mysql",
    logging: false
})

// Models
const User = require("../models/user")(sequelize)
const Session = require("../models/session")(sequelize)

// Assosiations
Session.belongsTo(User, { foreignKey: "user_id" })
User.hasMany(Session, { foreignKey: "user_id" })

module.exports = {
    sequelize,
    User,
    Session
}