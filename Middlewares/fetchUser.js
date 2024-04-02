const jwt = require("jsonwebtoken");
const JWT_SECRET = "07$aM@4Ra26";

const fetchUser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json("Please authenticate using proper token");
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
  } catch(err) {
    console.log(err)
    return res.status(401).json("Please authenticate using proper token");
  }
  next();
};

module.exports = fetchUser;
