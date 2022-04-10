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
const Post = require("../models/post")(sequelize)
const Like = require("../models/like")(sequelize)

// Assosiations
Session.belongsTo(User, { foreignKey: "user_id" })
User.hasMany(Session, { foreignKey: "user_id" })

Post.belongsTo(User, { foreignKey: "user_id", as: "user_post" })
User.hasMany(Post, { foreignKey: "user_id", as: "user_post" })

Post.belongsToMany(User, { through: Like, foreignKey: "post_id", as: "user_likes" })
User.belongsToMany(Post, { through: Like, foreignKey: "user_id", as: "user_likes" })
User.hasMany(Like, { foreignKey: "user_id" })
Like.belongsTo(User, { foreignKey: "user_id" })
Post.hasMany(Like, { foreignKey: "post_id" })
Like.belongsTo(Post, { foreignKey: "post_id" })

module.exports = {
    sequelize,
    User,
    Session,
    Post,
    Like
}