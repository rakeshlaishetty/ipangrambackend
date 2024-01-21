const userModel = require("../user/model/userModel");
const { successResponse } = require("../../util/response");
const { comparePassword } = require("../../util/bcrypt");
const generateToken = require("../../util/generateToke");

const Login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email }).populate('role');
    if (!user) {
      throw new Error("A User Does Not Exist");
    }
    console.log(password,user.password)
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid email or password");
    }
    const token = generateToken(user._id);
    const data = { user, token };
    successResponse(res, data, "Login successful");
  } catch (error) {
    next(error);
  }
};

module.exports = { Login };
