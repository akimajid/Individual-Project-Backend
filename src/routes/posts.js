const postControllers = require("../controllers/posts");
const fileUploader = require("../lib/uploader");
const { sessionAuthorizeLoggedInUser, authorizeUserWithRole } = require("../middleWares/authMiddleWare")

const router = require("express").Router();

router.get("/", sessionAuthorizeLoggedInUser, postControllers.getAllPosts);
router.post(
  "/",
  sessionAuthorizeLoggedInUser,
  fileUploader({
    destinationFolder: "posts",
    fileType: "image",
    prefix: "POST",
  }).single("post_image_file"),
  postControllers.createNewPost
);
router.patch("/:id", sessionAuthorizeLoggedInUser, postControllers.editPostById);
router.delete("/:id", sessionAuthorizeLoggedInUser, postControllers.deletePostById);
router.get("/:id/likes", postControllers.getLikePost);
router.post("/:postId/likes/:userId", postControllers.likePost);
router.get("/:postId", postControllers.getPostById)
router.get("/user/:userId", postControllers.getPostByUserId)

module.exports = router;
