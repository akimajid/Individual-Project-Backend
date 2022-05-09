const DAO = require("../lib/dao");
const { User } = require("../lib/sequelize");

const userControllers = {
  getAllUsers: async (req, res) => {
    try {
      const userDAO = new DAO(User);

      const findUsers = await userDAO.findAndCountAll(req.query);

      return res.status(200).json({
        message: "Get all users",
        result: findUsers,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server error",
      });
    }
  },
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;

      const findUser = await User.findOne({
        where: {
          id,
        },
      });

      delete findUser.dataValues.password;
      return res.status(200).json({
        message: "Find user",
        result: findUser,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server error",
      });
    }
  },
  editProfile: async (req, res) => {
    try {
      const {
        id,
        bio,
        username,
        email,
        full_name,
        profile_picture,
        is_verified,
      } = req.body;

      const isUsernameRegistered = await User.findOne({
        where: { username },
      });

      if (isUsernameRegistered) {
        return res.status(400).json({
          message: "username already taken",
        });
      }

      const updateData = {
        id,
        username,
        bio,
        email,
        full_name,
        profile_picture,
        is_verified,
      };
      console.log(updateData);
      const newProfile = await User.update(updateData, {
        where: { id: req.token.user_id },
      });

      if (!newProfile) {
        return res.status(400).json({
          message: "data failed",
        });
      }

      return res.status(201).json({
        message: "profile create or edit succses",
        result: { ...updateData },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server error",
      });
    }
  },
  editProfilePicture: async (req, res) => {
    try {
      const uploadFileDomain = process.env.UPLOAD_FILE_DOMAIN;
      const filePath = "profile_pictures";
      const { filename } = req.file;

      const newProfilePicture = await User.update(
        {
          profile_picture: `${uploadFileDomain}/${filePath}/${filename}`,
        },
        {
          where: {
            id: req.token.user_id,
          },
        }
      );

      if (!newProfilePicture) {
        return res.status(400).json({
          message: "Edit failed",
        });
      }

      return res.status(201).json({
        message: "Profile updated",
        result: newProfilePicture,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server error",
      });
    }
  },
};

module.exports = userControllers;
