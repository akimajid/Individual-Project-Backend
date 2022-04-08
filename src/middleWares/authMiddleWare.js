const { verifySession } = require("../lib/session")

const sessionAuthorizeLoggedInUser = async (req, res, next)  => {
    try {
        const token = req.headers.authorization

        const verifiedToken = await verifySession(token)

        if (!verifiedToken) throw new Error("Session invalid or expired")

        req.token = verifiedToken.dataValues

        console.log(req.token)

        next()
    } catch (err) {
        console.log(err)
        return res.status(419).json({
            message: err.message
        })
    }
}

module.exports = {
    sessionAuthorizeLoggedInUser
}