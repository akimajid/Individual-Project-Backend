const DAO = require("../lib/dao")
const  { User } = require("../lib/sequelize")

const userControllers = {
    getAllUsers: async (req, res) => {
        try {
            const userDAO = new DAO(User)

            const findUsers = await userDAO.findAndCountAll(req.query)

            return res.status(200).json({
                message: "Get all users",
                result: findUsers
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server error"
            })
        }
    }
}

module.exports = userControllers