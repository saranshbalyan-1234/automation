const { extractToken } = require("../jwt.js");
const getError = require("../sequelizeError.js");
const pkg = require("jsonwebtoken");

const { verify } = pkg;
const validateToken = () => {
  return async (req, res, next) => {
    try {
      const token = extractToken(req);
      if (token) {
        const data = verify(token, process.env.JWT_ACCESS_SECRET);
        if (data) {
          let temp = { ...data };
          delete temp.iat;
          delete temp.exp;
          req.user = temp;
          let database = temp.tenant.replace(/[^a-zA-Z0-9 ]/g, "");
          req.database = database;
          next();
        }
      } else {
        return res.status(401).json({ error: "Access token not found" });
      }
    } catch (e) {
      getError(e, res, "Access");
    }
  };
};
module.exports = { validateToken };