const jwt = require("jsonwebtoken");

const jwtAuthMiddleware = (req, res, next) => {
  // first check request headers has authorization or not
  const authorization = req.headers.authorization;
  if (!authorization) return res.status(401).json({ error: "token Not Found" });

  //extarct the jwt token from the request headers
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    //verify the jwt token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    //attach user information to the request body
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Invalid token" });
  }
};

//Function to Generate JWT token
const generateToken = (userData) => {
  //generate a new JWT token using data
  return jwt.sign(userData, process.env.JWT_SECRET_KEY, { expiresIn: 30000 });
};
module.exports = { jwtAuthMiddleware, generateToken };
