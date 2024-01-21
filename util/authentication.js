const jwt = require("jsonwebtoken");
const User = require("../modules/user/model/userModel");
const { errorResponse } = require("../util/response");

const authentication = async (req, res, next) => {
  
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      if (!token) throw new Error("No Token provided");
      // console.log(token)
      const decoded = jwt.verify(token, process.env.JWT_TOKEN);
      const user = await User.findOne({ _id: decoded.id }).select("-password").populate('role')
      if (!user) {
        throw new Error("No user found with the token you provided");
      }
      req.user = user;
      next();
    } catch (err) {
      console.error(err);
      errorResponse(res, "Invalid token", 401);
    }
  } else {
    errorResponse(res, "Not authorized, token not provided");
  }
};

const authorizeManager = (req, res, next) => {
  try {
    const userRole = req.user.role.roleName;
    console.log(userRole,'user role')
    if (userRole === "manager") {
      next();
    } else {
      throw new Error("You do not have the required access rights.");
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { authentication, authorizeManager };
