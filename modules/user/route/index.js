const router = require("express").Router();
const {
  register,
  fetchOwnDetails,
  UpdateDetails,
  GetRoles,
  UpdateDetailsFromManager,
  DeleteDetailsofEmployeefrommanager,
  AddDeptsInUser,
  GetAllEmployeesWithFilter,
  AddEmployee
} = require("../service/index");
const { authentication, authorizeManager } = require("../../../util/authentication");

router.post("/register", register);
router.post("/addemployee",authentication, authorizeManager,AddEmployee);
router.post("/me", authentication, fetchOwnDetails);
router.post("/updatedetails", authentication,UpdateDetails);
router.post("/updatedetailsfrommanager",authentication,authorizeManager, UpdateDetailsFromManager);
router.post("/deleteuserdetailsfrommanager",authentication,authorizeManager, DeleteDetailsofEmployeefrommanager);
router.get("/getroles", GetRoles);
router.post("/adddeptstouser",authentication, authorizeManager, AddDeptsInUser);
router.post("/getallemployees",authentication, authorizeManager, GetAllEmployeesWithFilter);


module.exports = router;
