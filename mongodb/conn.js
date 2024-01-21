const mongoose = require("mongoose");
const userModel = require("../modules/user/model/userModel");
const role = require("../modules/user/model/RoleModel");
const { hashPassword } = require("../util/bcrypt");
const DefaultRoles = require("../util/roles");

const username = encodeURIComponent(process.env.mongodbusername);
const password = encodeURIComponent(process.env.mongodbpassword);
const cluster = process.env.mongocluster;
const uri = `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

mongoose.set("debug", true);

db.once("open", async () => {
  console.log("Connection Established");

  // Check and create roles if needed
  const existroles = await CheckRoles();
  console.log(existroles, 'existroles');

  // Continue with user existence check
  await checkUserExistence(existroles);
});

db.on("error", (err) => {
  console.error("MongoDB Connection Error:", err);
});

const CheckRoles = async () => {
  try {
    const roles = await role.find();
    console.log(DefaultRoles, 'DefaultRoles');

    for (const element of DefaultRoles) {
      const existingRole = roles.find((role) => role.roleName === element);

      if (!existingRole) {
        await InsertNewRole(element);
      }
    }

    return await role.findOne({ roleName: "manager" });
  } catch (error) {
    console.error("Error checking and creating roles:", error);
  }
};

const InsertNewRole = async (roleName) => {
  try {
    const roleData = new role({ roleName });
    await roleData.save();
    console.log("New role created:", roleData);
  } catch (error) {
    console.error("Error inserting new role:", error);
  }
};

const checkUserExistence = async (existroles) => {
  try {
    if (!existroles) {
      // Role does not exist, create it
      const newRole = new role({ roleName: "manager" });
      await newRole.save();
      console.log("Role created:", newRole);
      existroles = newRole;
    }

    const existingUser = await userModel.findOne({ email: "admin@manager.com" });

    if (existingUser) {
      console.log("User already exists:", existingUser);
    } else {
      const hashedPassword = await hashPassword("admin@manager.com");

      const data = {
        firstName: "Manager",
        lastName: "admin",
        email: "admin@manager.com",
        role: existroles._id,
        password: hashedPassword,
        location: "surat",
      };
      console.log(data, "data");
      const newUser = new userModel(data);
      await newUser.save();
      console.log("New user created:", newUser);
    }
  } catch (error) {
    console.error("Error checking user existence:", error);
  }
};
