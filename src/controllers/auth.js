const { Op } = require("sequelize");
const { User, Session } = require("../lib/sequelize");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const moment = require("moment");
const mailer = require("../lib/mailer");

const authControllers = {
  registerUser: async (req, res) => {
    try {
      const { username, email, full_name, password } = req.body;

      const isUsernameOrEmailTaken = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email }],
        },
      });

      if (isUsernameOrEmailTaken) {
        return res.status(400).json({
          message: "Username or email already taken",
        });
      }

      const hashedPassword = bcrypt.hashSync(password, 5);

      await User.create({
        username,
        email,
        full_name,
        password: hashedPassword,
      });

      return res.status(201).json({
        message: "Registered user",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server error",
      });
    }
  },
  loginUser: async (req, res) => {
    try {
      const { username, password } = req.body;

      const findUser = await User.findOne({
        where: {
          username,
        },
      });

      if (!findUser) {
        return res.status(400).json({
          message: "Wrong username or password",
        });
      }

      const isPasswordCorrect = bcrypt.compareSync(password, findUser.password);

      if (!isPasswordCorrect) {
        return res.status(400).json({
          message: "Wrong username or password",
        });
      }

      delete findUser.dataValues.password;

      await Session.update(
        {
          is_valid: false,
        },
        {
          where: {
            user_id: findUser.id,
          },
        }
      );

      const sessionToken = nanoid(64);

      // await mailer({
      //   to: "monpai732@gmail.com",
      //   subject: "Logged in user",
      //   text: "An account using your email has has logged in"
      // })

      await Session.create({
        user_id: findUser.id,
        is_valid: true,
        token: sessionToken,
        valid_until: moment().add(1, "day"),
      });

      findUser.last_login = moment();
      findUser.save();

      return res.status(200).json({
        message: "Logged in user",
        result: {
          user: findUser,
          token: sessionToken,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server error",
      });
    }
  },
  keepLogin: async (req, res) => {
    try {
      const { token } = req;

      const renewedToken = nanoid(64);

      const findUser = await User.findByPk(token.user_id);

      delete findUser.dataValues.password;

      await Session.update(
        {
          token: renewedToken,
          valid_until: moment().add(1, "day"),
        },
        {
          where: {
            id: token.id,
          },
        }
      );

      return res.status(200).json({
        message: "Renewed user token",
        result: {
          user: findUser,
          token: renewedToken,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server error",
      });
    }
  },
};

module.exports = authControllers;
