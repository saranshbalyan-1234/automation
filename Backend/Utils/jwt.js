import pkg from "jsonwebtoken";
const { sign, verify } = pkg;

const createToken = async (data, secret, expiration) => {
  let options = {};
  if (expiration) options.expiresIn = expiration;
  return sign(data, secret, options);
};

const refreshToken = async (req, res) => {
  const token = req.body.refreshToken;
  if (!token) return res.status(401).json({ error: "Refresh token not found" });

  try {
    const data = verify(token, process.env.JWT_REFRESH_SECRET);
    if (data) {
      let tokenData = { id: data.id, email: data.email };
      const accessToken = await createToken(
        tokenData,
        process.env.JWT_ACCESS_SECRET,
        process.env.JWT_ACCESS_EXPIRATION
      );
      const refreshToken = await createToken(
        tokenData,
        process.env.JWT_REFRESH_SECRET,
        process.env.JWT_REFRESH_EXPIRATION
      );
      return res.status(200).json({ accessToken, refreshToken });
    }
  } catch (e) {
    return res.status(401).json({ error: getTokenError(e, "Refresh") });
  }
};

const getTokenError = (e, type) => {
  switch (e.name) {
    case "TokenExpiredError":
      return `${type} Token Expired`;
    default:
      return `Invalid ${type} Found`;
  }
};
const extractToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  } else return null;
};

export { createToken, refreshToken, getTokenError, extractToken };
