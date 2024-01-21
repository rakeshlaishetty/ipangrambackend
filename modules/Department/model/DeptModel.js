const mongoose = require("mongoose");

const DeptSchema = new mongoose.Schema(
  {
    Department: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const DeptModel = new mongoose.model('Dept',DeptSchema)

module.exports = DeptModel;