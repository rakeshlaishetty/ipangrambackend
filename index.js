const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { ErrorMiddleware } = require("./util/ErrorMiddleware");
const userRoute = require("./modules/user/route/index");
const DeptUser = require("./modules/Department/router/index");
const AuthRoute = require("./modules/Auth/router");
const app = express();
dotenv.config();
app.use(cors());

app.use(express.json());
require("./mongodb/conn");

app.use("/user", userRoute);
app.use("/dept", DeptUser);
app.use("/auth", AuthRoute);

app.use(ErrorMiddleware);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server Listening On http://localhost:${PORT}`);
});
