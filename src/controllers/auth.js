const { Op } = require("sequelize")
const { User } = require("../lib/sequelize")
const bcrypt = require("bcrypt")

const authControllers = {
    registerUser: async (req, res) => {
        try {
            const { username, email, full_name, password } = req.body

            const isUsernameOrEmailTaken = await User.findOne({
                where: {
                    [Op.or]: [{ username }, { email }]
                }
            })

            if (isUsernameOrEmailTaken) {
                return res.status(400).json({
                    message: "Username or email already taken"
                })
            }

            const hashedPassword = bcrypt.hashSync(password, 5)

            await User.create({
                username,
                email,
                full_name,
                password: hashedPassword
            })

            return res.status(201).json({
                message: "Registered user"
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server error"
            })
        }
    },
    loginUser: async (req, res) => {
        try {
            const { username, password } = req.body

            const findUser = await User.findOne({
                where: {
                    username,
                }
            })

            if (!findUser) {
                return res.status(400).json({
                    message: "Wrong username or password"
                })
            }

            const isPasswordCorrect = bcrypt.compareSync(password, findUser.password)

            if (!isPasswordCorrect) {
                return res.status(400).json({
                    message: "Wrong username or password"
                })
            }

            delete findUser.dataValues.password

            return res.status(200).json({
                message: "Logged in user",
                result: {
                    user: findUser,
                    token: "12345"
                }
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server error"
            })
        }
    },
    keepLogin: async (req, res) => {}
}

module.exports = authControllers