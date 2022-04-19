const authControllers  = require("../controllers/auth")
const { sessionAuthorizeLoggedInUser } = require("../middleWares/authMiddleWare")

const router = require("express").Router()

router.post("/register", authControllers.registerUser)
router.post("/login", authControllers.loginUser)
router.get("/refresh-token", sessionAuthorizeLoggedInUser, authControllers.keepLogin)
router.get("/verify/:token", authControllers.verifyUser)
router.post("/resend-verification", authControllers.resendVerificationEmail)
router.post("/forgot-password-email", authControllers.sendForgotPasswordEmail)
router.patch("/change-password-forgot", authControllers.changeUserForgotPassword)

module.exports = router