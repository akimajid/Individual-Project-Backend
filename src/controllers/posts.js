const { Post, User, Like } = require("../lib/sequelize")
const fs = require("fs")
const DAO = require("../lib/dao")

const postControllers = {
    getAllPosts: async (req, res) => {
        try {
            const postDAO = new DAO(Post)

            const findPosts = await postDAO.findAndCountAll(req.query)

            return res.status(200).json({
                message: "Get all posts",
                result: findPosts
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Server error"
            })
        }
    },
    createNewPost: async (req, res) => {
        try {
            const { caption, location } = req.body

            const uploadFileDomain = process.env.UPLOAD_FILE_DOMAIN
            const filePath = "post_images"
            const { filename } = req.file

            const newPost = await Post.create({
                image_url: `${uploadFileDomain}/${filePath}/${filename}`,
                caption,
                location,
                user_id: req.token.id
            })

            return res.status(201).json({
                message: "Post created",
                result: newPost
            })
        } catch (err) {
            console.log(err)
            // fs.unlinkSync(__dirname + "/../public/posts" + req.file.filename)
            return res.status(500).json({
                message: "Server error"
            })
        }
    },
    editPostById: async (req, res) => {},
    deletePostById: async (req, res) => {},
    getLikePost: async (req, res) => {},
    likePost: async (req, res) => {}
}

module.exports = postControllers