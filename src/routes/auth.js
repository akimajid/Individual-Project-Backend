const authControllers  = require("../controllers/auth")
const { sessionAuthorizeLoggedInUser } = require("../middleWares/authMiddleWare")

const router = require("express").Router()

router.post("/register", authControllers.registerUser)
router.post("/login", authControllers.loginUser)
router.get("/refresh-token", sessionAuthorizeLoggedInUser, authControllers.keepLogin)

module.exports = router