const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")

dotenv.config()

const PORT = process.env.PORT

const { sequelize } = require("./lib/sequelize")
sequelize.sync({ alter: true })

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("<h1>Individual project API</h1>")
})

const { authRoutes, postsRoutes } = require("./routes/index")

app.use("/post_images", express.static(`${__dirname}/public/posts`))
app.use("/profile_pictures", express.static(`${__dirname}/public/profile_pictures`))

app.use("/auth", authRoutes)
app.use("/posts", postsRoutes)

app.listen(PORT, () => {
    console.log("Listening in port", PORT)
})