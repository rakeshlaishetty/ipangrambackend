const DeptModel = require("../model/DeptModel");
const userModel = require("../../user/model/userModel");
const { successResponse } = require("../../../util/response");
const mongoose = require('mongoose')

const getAllDept = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 5 } = req.body;
    const options = {
      page: parseInt(page),
      limit: parseInt(pageSize),
    };

    const departments = await DeptModel.find()
      .skip((options.page - 1) * options.limit)
      .limit(options.limit);

    const totalDocuments = await DeptModel.countDocuments();
    successResponse(res, { departments, totalDocuments });
  } catch (err) {
    next(err);
  }
};

const CreateDept = async (req, res, next) => {
  try {
    const { Department } = req.body;
    const newDept = await DeptModel.create({ Department });
    successResponse(res, newDept);
  } catch (err) {
    next(err);
  }
};

const UpdateDept = async (req, res, next) => {
  try {
    const { id } = req.body;
    const updatedDept = await DeptModel.findByIdAndUpdate(
      id,
      { Department: req.body.Department },
      { new: true }
    );
    successResponse(res, updatedDept);
  } catch (err) {
    next(err);
  }
};

const DeleteDept = async (req, res, next) => {
  try {
    const { id } = req.body;
    const deletedDept = await DeptModel.findByIdAndDelete(id);

    if (deletedDept) {
      await userModel.updateMany(
        { departments: id },
        { $pull: { departments: id } }
      );

      successResponse(res, null, "Department deleted successfully");
    } else {
      res.status(404);
      throw new Error("Department not found");
    }
  } catch (err) {
    next(err);
  }
};

const GetDeptswithusers = async (req, res, next) => {
  console.log('reached');
  const { page = 1, pageSize = 5, DeptdId } = req.body;

  try {
    const options = {
      page: parseInt(page),
      limit: parseInt(pageSize),
    };

    // Use findById to directly find the department by _id
    const department = await DeptModel.findById(DeptdId);
    
    // Find users for the department using the departments field in userModel
    const usersForDept = await userModel
      .find({ departments: DeptdId })
      .skip((options.page - 1) * options.limit)
      .limit(options.limit);

    const totalDocuments = usersForDept.length;

    // Log values for debugging
    console.log('DeptdId:', DeptdId);
    console.log('Department found:', department);
    console.log('Users for Department:', usersForDept);

    successResponse(res,{ usersForDept, totalDocuments },"Successfully Fetched");
  } catch (err) {
    next(err);
  }
};


const DeleteUserFromDepts = async (req, res, next) => {
  const { userId, DeptdId } = req.body;
  console.log(req.body,'requestdata')

  try {
    // Check if the user exists
    const user = await userModel.findOne({_id:userId});
    if (!user) {
      throw new Error('User not found');
    }

    console.log('UserId:', userId);
    // Check if the department exists
    const department = await DeptModel.findOne({_id:DeptdId});
    if (!department) {
      throw new Error('Department not found');
    }

    if (!user.departments.includes(DeptdId)) {
      throw new Error('User does not have the specified deptId');
    }

    // Use findByIdAndUpdate to remove the specified deptId from the user's departments array
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $pull: { departments: DeptdId } },
      { new: true }
    );

    // Log values for debugging
    console.log('DeptId to be removed:', DeptdId);
    console.log('Updated User:', updatedUser);

    successResponse(res, { updatedUser }, "Successfully Removed DeptId from User");
  } catch (err) {
    next(err);
  }
};




module.exports = {
  DeleteDept,
  UpdateDept,
  CreateDept,
  getAllDept,
  GetDeptswithusers,
  DeleteUserFromDepts
};
