const router = require("express").Router()
const { userControllers } = require("../controllers/index")
const fileUploader = require("../lib/uploader")
const { sessionAuthorizeLoggedInUser } = require("../middleWares/authMiddleWare")

router.get("/", sessionAuthorizeLoggedInUser, userControllers.getAllUsers)
router.get("/:id", sessionAuthorizeLoggedInUser, userControllers.getUserById)
router.patch("/profile", sessionAuthorizeLoggedInUser, userControllers.editProfile)
router.patch("/profile/picture", 
sessionAuthorizeLoggedInUser, 
fileUploader({
    destinationFolder: "profile_pictures",
    fileType: "image",
    prefix: "PROFILE"
}).single("profile_image_file"), userControllers.editProfilePicture)

module.exports = router