const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuthorized = false;
    return next();
  }
  const token = authHeader.split(" ")[1]; //Expecting bearer
  if (!token || token === "") {
    req.isAuthorized = false;
    return next();
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "not-so-secret-due-to-being-my-test-project-haha-so-i-will-leave-it-here");
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    req.isAuthorized = false;
    return next();
  }

  req.isAuthorized = true;
  req.userId = decodedToken.userId;
  next();
};
