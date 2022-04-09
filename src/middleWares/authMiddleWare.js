const { verifySession } = require("../lib/session");

const sessionAuthorizeLoggedInUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    const verifiedToken = await verifySession(token);

    if (!verifiedToken) throw new Error("Session invalid or expired");

    req.token = verifiedToken.dataValues;

    console.log(req.token);

    next();
  } catch (err) {
    console.log(err);
    return res.status(419).json({
      message: err.message,
    });
  }
};

const authorizeUserWithRole = (roles = []) => {
  return (req, res, next) => {
    try {
      if (!roles.length) return next();

      const userRole = req.token.role;

      if (roles.includes(userRole)) return next();

      throw new Error("User does not have enough permission levels");
    } catch (err) {
      console.log(err);
      return res.status(401).json({
        message: err.message || "User unauthorized",
      });
    }
  };
};

module.exports = {
  sessionAuthorizeLoggedInUser,
  authorizeUserWithRole,
};
