const router = require("express").Router();
const { authentication, authorizeManager } = require("../../../util/authentication");
const {
  DeleteDept,
  UpdateDept,
  CreateDept,
  getAllDept,
  GetDeptswithusers,
  DeleteUserFromDepts
} = require("../service");

router.post("/getdeptdetails",authentication,authorizeManager, getAllDept);
router.post("/createdept", authentication,authorizeManager,CreateDept);
router.post("/updatedeptdetails", authentication,authorizeManager,UpdateDept);
router.post("/deletedeptdetails", authentication,authorizeManager,DeleteDept);
router.post("/getalluserwithdepts", authentication,authorizeManager,GetDeptswithusers);
router.post("/deleteuserfromdepts", authentication,authorizeManager,DeleteUserFromDepts);

module.exports = router;
