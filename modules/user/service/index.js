const { successResponse } = require("../../../util/response");
const UserModel = require("../model/userModel");
const roles = require("../model/RoleModel");
const { hashPassword } = require("../../../util/bcrypt");

const register = async (req, res, next) => {
  console.log(req.body, "req.body");
  const mandatoryFields = [
    "firstName",
    "lastName",
    "email",
    "password",
    "role",
    "location",
  ];
  try {
    if (!mandatoryFields.every((field) => req.body[field])) {
      throw new Error("All mandatory fields must be provided");
    }

    const isExist = await UserModel.findOne({ email: req.body.email });

    if (isExist) {
      throw new Error("A User Already Exist Please Use That Email Id");
    }

    const hashedPassword = await hashPassword(req.body.password);
    const data = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
      location: req.body.location,
    };

    const newUser = await UserModel.create(data);
    successResponse(res, newUser, "User registered successfully", 201);
  } catch (err) {
    next(err);
  }
};

const AddEmployee = async (req, res, next) => {
  const mandatoryFields = [
    "firstName",
    "lastName",
    "email",
    "password",
    "role",
    "location",
  ];
  try {
    if (!mandatoryFields.every((field) => req.body[field])) {
      throw new Error("All mandatory fields must be provided");
    }

    const isExist = await UserModel.findOne({ email: req.body.email });

    if (isExist) {
      throw new Error("A User Already Exist Please Use That Email Id");
    }

    const hashedPassword = await hashPassword(req.body.password);
    const data = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
      location: req.body.location,
    };

    const newUser = await UserModel.create(data);
    successResponse(res, newUser, "User registered successfully", 201);
  } catch (err) {
    next(err);
  }
};

const fetchOwnDetails = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id);
    successResponse(res, user, "User details retrieved successfully");
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const UpdateDetails = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id);

    if (!user) {
      throw new Error("A User Details Not Found");
    }

    const existingUser = await UserModel.findOne({ email: req.body.email });

    if (existingUser && existingUser._id.toString() !== req.user.id) {
      throw new Error("Email is already in use");
    }

    let hashedPassword = null;

    if (req.body.password) {
      hashedPassword = await hashPassword(req.body.password);
    }
    const data = {
      firstName: req.body.firstName || user.firstName,
      lastName: req.body.lastName || user.lastName,
      lastName: req.body.email || user.email,
      ...(req.body.password && { password: hashedPassword }),
      location: req.body.location || user.location,
    };

    const updatedUser = await UserModel.findByIdAndUpdate(req.user.id, data, {
      new: true,
    });
    successResponse(res, updatedUser, "User details updated successfully");
  } catch (err) {
    next(err);
  }
};

const UpdateDetailsFromManager = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.body.id);

    if (!user) {
      throw new Error("User details not found");
    }

    const existingUser = await UserModel.findOne({ email: req.body.email });

    if (existingUser && existingUser._id.toString() !== req.body.id) {
      throw new Error("Email is already in use");
    }

    let hashedPassword = null;

    if (req.body.password) {
      hashedPassword = await hashPassword(req.body.password);
    }

    const data = {
      firstName: req.body.firstName || user.firstName,
      lastName: req.body.lastName || user.lastName,
      email: req.body.email || user.email, // Fix the duplicated key
      ...(req.body.password && { password: hashedPassword }),
      location: req.body.location || user.location,
    };

    const updatedUser = await UserModel.findByIdAndUpdate(req.body.id, data, {
      new: true,
    });

    successResponse(res, updatedUser, "User details updated successfully");
  } catch (err) {
    next(err);
  }
};

const DeleteDetailsofEmployeefrommanager = async (req, res, next) => {
  try {
    const userId = req.body.id;
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User details not found");
    }
    await UserModel.findByIdAndDelete(userId);
    successResponse(res, null, "User deleted successfully");
  } catch (err) {
    next(err);
  }
};

const GetRoles = async (req, res, next) => {
  try {
    const rolesData = await roles.find();

    if (!rolesData) {
      throw new Error("Roles not Found");
    }

    successResponse(res, rolesData, "All Roles fetched successfully");
  } catch (err) {
    next(err);
  }
};

const AddDeptsInUser = async (req, res, next) => {
  try {
    const userId = req.body.id;
    const deptId = req.body.deptid;

    const user = await UserModel.findById(userId);

    if (!user) {
      throw new Error("User details not found");
    }

    await UserModel.findByIdAndUpdate(
      userId,
      { $push: { departments: deptId } },
      { new: true }
    );

    successResponse(res, null, "Dept added successfully to the user");
  } catch (err) {
    next(err);
  }
};


const GetAllEmployeesWithFilter = async (req, res, next) => {
  try {
    const { sortBy, order = "asc", email, isLimit = false } = req.body;

    let query = {};

    const Queries = await roles.findOne({ roleName: "employee" });
    query["role"] = Queries._id;

    let sortCriteria = {};

    if (email) {
      query.email = { $regex: email, $options: "i" };
    }

    let myorder = order === "asc" ? 1 : -1;

    if (sortBy === "location") {
      query.location = { $ne: null };
      sortCriteria = { location: myorder };
    } else if(sortBy == "firstname")  {
      sortCriteria = { firstName: myorder };
    }else if(sortBy == "firstname"){
      sortCriteria = { lastName: myorder };
    }

    let employees;

    if (isLimit) {
      // Find all employees without pagination
      employees = await UserModel.find(query)
        .populate("role")
        .sort(sortCriteria);
    } else {
      // Use pagination logic if isLimit is false or not provided
      const { page = 1, pageSize = 5 } = req.body;
      const options = {
        page: parseInt(page),
        limit: parseInt(pageSize),
      };

      // Count total documents
      const totalDocuments = await UserModel.countDocuments(query);

      // Find paginated employees
      employees = await UserModel.find(query)
        .populate("role")
        .sort(sortCriteria)
        .skip((options.page - 1) * options.limit)
        .limit(options.limit);

      console.log(employees, "employees");
      successResponse(res, { employees, totalDocuments }, "Successfully Fetched");
    }
  } catch (err) {
    console.log(err, "err");
    next(err);
  }
};



module.exports = {
  GetAllEmployeesWithFilter,
  UpdateDetails,
  AddEmployee,
  fetchOwnDetails,
  register,
  GetRoles,
  UpdateDetailsFromManager,
  DeleteDetailsofEmployeefrommanager,
  AddDeptsInUser,
};
