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
            include: User,
            order: [["createdAt", "DESC"]],
          },
        ],
        distinct: true,
        order: [["createdAt", "DESC"]],
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
      const { caption } = req.body

      const findPost = await Post.findOne({
        where: {
            id
        }
    })

    if (!findPost) {
        return res.status(400).json({
            message: "Post not Found!"
        })
    }

    await Post.update({
        caption,
    }, {
        where: {
            id,
            user_id: req.token.user_id
    }
    })

    return res.status(200).json({
        message: "Post Updated!"
    })
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
      const {postId} = req.params
      const user_id = req.token.user_id

      const findLike = await Like.findOne({
          where: {
              post_id: postId,
              user_id
          }
      })

      return res.status(200).json({
          message: "Find Successfully!",
          result: findLike
      })
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server error",
      });
    }
  },
  likePost: async (req, res) => {
    try {
      const {postId} = req.params
            // const {user_id} = req.body
            const user_id = req.token.user_id

            const findPost = await Post.findAll({
                where: {
                    id: postId
                }
            })

            if (!findPost) {
                return res.status(400).json({
                    message: "Can't find this Post!"
                })
            }

            const findUserLike = await Like.findOne({
                where: {
                    post_id: postId,
                    user_id
                }
            })

            if (findUserLike) {
                return res.status(400).json({
                    message: "You Already Like This Post!"
                })
            }

            const likePost = await Like.create({
                post_id: postId,
                user_id
            })

            await Post.increment({
                like_count: 1
            },
            {
                where: {
                    id: postId,
                }
            })

            return res.status(200).json({
                message: "Liked post",
                result: likePost
            })
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server error",
      });
    }
  },
  getPostById: async (req, res) => {
    try {
      const { id } = req.params;

      const postsDetail = await Post.findByPk(id, {
        include: [
          {
            model: Comment,
            include: [{ model: User, attributes: ["id", "username"] }],
          },
          { model: User, attributes: ["username", "full_name", "profile_picture"] },
        ],
      });

      return res.status(200).json({
        message: "get post succsess",
        result: postsDetail,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server error",
      });
    }
  },
  unlikePost: async (req, res) => {
    try {
      const {postId} = req.params
            const user_id = req.token.user_id

            const findPost = await Post.findAll({
                where: {
                    id: postId
                }
            })

            const findUserLike = await Like.findOne({
                where: {
                    post_id: postId,
                    user_id
                }
            })

            if (!findPost) {
                return res.status(400).json({
                    message: "Can't find this Post!"
                })
            }

            if (!findUserLike) {
            return res.status(400).json({
                message: "You Already Unlike This Post!"
            })}

            await Post.decrement({
                like_count: 1
            }, {
                where: {
                    id: postId,
                }
            })

            await Like.destroy({
                where: {
                    post_id: postId,
                    user_id
                }
            })

            return res.status(200).json({
                message: "Unliked post"
            })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: "Server error"
      })
    }
  },
};

module.exports = postControllers;
