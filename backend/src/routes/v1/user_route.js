const express = require("express");
const validate = require("../../middlewares/validate");
const userValidation = require("../../validations/user_validation");
const userController = require("../../controllers/user_controller");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.get("/orders", auth, userController.getOrderHistory);

router.get(
  "/:userId",
  auth,
  validate(userValidation.getUser),
  userController.getUser
);

router.put(
  "/user/:userId",
  auth,
  validate(userValidation.updateUser),
  userController.updateUser
);

router.put(
  "/:userId",
  auth,
  validate(userValidation.setAddress),
  userController.setAddress
);

router.delete("/deleteAddress/:addressId", auth, userController.deleteAddress);

module.exports = router;
