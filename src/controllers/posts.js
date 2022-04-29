const { Post, User, Like, Comment } = require("../lib/sequelize");
const fs = require("fs");

const postControllers = {
  getAllPosts: async (req, res) => {
    try {
      const { _limit = 30, _page = 1, _sortBy = "", _sortDir = "" } = req.query;

      delete req.query._limit;
      delete req.query._page;
      delete req.query._sortBy;
      delete req.query._sortDir;

      const findPosts = await Post.findAndCountAll({
        where: {
          ...req.query,
        },
        order: [["createdAt", "DESC"]],
        limit: _limit ? parseInt(_limit) : undefined,
        offset: (_page - 1) * _limit,
        include: [
          {
            model: User,
          },
          {
            model: Comment,
            order: [["createdAt", "DESC"]],
          },
        ],
        distinct: true,
        order: _sortBy ? [[_sortBy, _sortDir]] : undefined,
      });

      return res.status(200).json({
        message: "Find posts",
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
            user_id: req.token.user_id,
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
  getPostById: async (req, res) => {
    try {
      const { _limit = 5, _page = 1 } = req.query;

      delete req.query._limit;
      delete req.query._page;
      const { postId } = req.params;
      const findPost = await Post.findOne({
        where: {
          id: postId,
        },
        include: [
          {
            model: User,
          },
          {
            model: Comment,
          },
        ],
      });

      const findComment = await Comment.findAll({
        where: {
          post_id: postId,
        },
        order: [["createdAt", "DESC"]],
        limit: _limit ? parseInt(_limit) : undefined,
        offset: (_page - 1) * _limit,
        include: [
          {
            model: User,
          },
        ],
      });

      return res.status(200).json({
        message: `We Found Post ID: ${postId} !`,
        result: {
          post: findPost,
          comment: findComment,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server error",
      });
    }
  },
  getPostByUserId: async (req, res) => {
    try {
      const { userId } = req.params;

      const findPost = await Post.findAll({
        where: {
          user_id: userId,
        },
        include: [
          {
            model: User,
            as: "user_post",
          },
        ],
      });

      return res.status(200).json({
        message: "Post found",
        result: findPost,
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
