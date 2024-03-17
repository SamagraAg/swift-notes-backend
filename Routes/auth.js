const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const { body, validationResult } = require("express-validator");

//post route for registering user(No auth required)
router.post(
  "/",
  [
    body("name", "Name cannot be empty").notEmpty(),
    body("email", "Enter a valid email").isEmail(),
    body(
      "password",
      "Password must be 8characters long. 1 lowercase, 1 uppercase, 2 number and 1 special character is required"
    ).isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    }),
  ],
  (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      res.send(req.body);
      const user = User(req.body);
      user.save();
    }
    res.send({ errors: result.array() });
  }
);

module.exports = router;
