const { Post, User, Like } = require("../lib/sequelize");
const fs = require("fs");
const DAO = require("../lib/dao");
const fileUploader = require("../lib/uploader");

const postControllers = {
  getAllPosts: async (req, res) => {
    try {
      const postDAO = new DAO(Post);

      const findPosts = await postDAO.findAndCountAll(req.query);

      return res.status(200).json({
        message: "Get all posts",
        result: findPosts,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server error",
      });
    }
  },
  createNewPost: async (req, res) => {
    try {
      const { caption, location } = req.body;

      const uploadFileDomain = process.env.UPLOAD_FILE_DOMAIN;
      const filePath = "post_images";
      const { filename } = req.file;

      const newPost = await Post.create({
        image_url: `${uploadFileDomain}/${filePath}/${filename}`,
        caption,
        location,
        user_id: req.token.user_id,
      });

      return res.status(201).json({
        message: "Post created",
        result: newPost,
      });
    } catch (err) {
      console.log(err);
      // fs.unlinkSync(__dirname + "/../public/posts" + req.file.filename)
      return res.status(500).json({
        message: "Server error",
      });
    }
  },
  editPostById: async (req, res) => {
    try {
      const { id } = req.params;

      const updatePost = await Post.update(
        {
          ...req.body,
        },
        {
          where: {
            id,
            user_id: req.token.id,
          },
        }
      );

      return res.status(200).json({
        message: "Post updated",
        result: updatePost,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server error",
      });
    }
  },
  deletePostById: async (req, res) => {
    try {
      const { id } = req.params;

      const deletePost = await Post.destroy({
        where: {
          id,
        },
      });

      return res.status(201).json({
        message: "Post deleted",
        result: deletePost,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server error",
      });
    }
  },
  getLikePost: async (req, res) => {
    try {
      const { id } = req.params;

      const postLikes = await Like.findAll({
        where: {
          postId: id,
        },
        include: User,
      });

      return res.status(200).json({
        message: "Fetch likes",
        result: postLikes,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server error",
      });
    }
  },
  likePost: async (req, res) => {
    try {
      const { postId, userId } = req.params;

      const [didCreatePost] = await Like.findOrCreate({
        where: {
          post_id: postId,
          user_id: userId,
        },
        defaults: {
          ...req.body,
        },
      });

      if (!didCreatePost) {
        return res.status(400).json({
          message: "User already liked post",
        });
      }

      await Post.increment(
        { like_count: 1 },
        {
          where: {
            id: postId,
          },
        }
      );

      return res.status(200).json({
        message: "Liked post",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server error",
      });
    }
  },
};

module.exports = postControllers;
