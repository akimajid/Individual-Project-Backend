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
router.get("/postlike/:postId", sessionAuthorizeLoggedInUser, postControllers.getLikePost);
router.post("/postlike/:postId", sessionAuthorizeLoggedInUser, postControllers.likePost);
router.get("/:id", postControllers.getPostById)
router.delete("/postlike/:postId", sessionAuthorizeLoggedInUser, postControllers.unlikePost)

module.exports = router;
