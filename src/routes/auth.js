const authControllers  = require("../controllers/auth")

const router = require("express").Router()

router.post("/register", authControllers.registerUser)
router.post("/login", authControllers.loginUser)
router.get("/refresh-token", authControllers.keepLogin)

module.exports = router