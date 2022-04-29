const { Post, User, Comment } = require("../lib/sequelize");

const commentControllers = {
  getPostComments: async (req, res) => {
    try {
      const { postId } = req.params;

      const findPost = await Post.findOne({
        where: {
          id: postId,
        },
      });

      if (!findPost) {
        return res.status(400).json({
          message: "Post not Found!",
        });
      }

      const getComments = await Comment.findAll({
        where: {
          post_id: postId,
        },
        include: [
          {
            model: User,
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return res.status(200).json({
        message: "Comments found!",
        result: getComments,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Can't Reach Server",
      });
    }
  },

  addPostComment: async (req, res) => {
    try {
      const { postId } = req.params;
      const { content, user_id } = req.body;

      const findPost = await Post.findOne({
        where: {
          id: postId,
        },
      });

      if (!findPost) {
        return res.status(400).json({
          message: "Post not Found!",
        });
      }

      const findUser = await User.findOne({
        where: {
          id: user_id,
        },
      });

      if (!findUser) {
        return res.status(400).json({
          message: "User doesn't exist!",
        });
      }

      const addComment = await Comment.create({
        content,
        user_id,
        post_id: postId,
      });

      return res.status(201).json({
        message: "Comment Added",
        result: addComment,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Can't Reach Server",
      });
    }
  },
};

module.exports = commentControllers;
