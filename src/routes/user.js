const router = require("express").Router()
const { userControllers } = require("../controllers/index")

router.get("/", userControllers.getAllUsers)

module.exports = router