const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const { body, validationResult } = require("express-validator");

//Create new user: using POST "/api/auth/createUser" (No Auth required)
router.post(
  "/createUser",
  [
    body("name", "Name cannot be empty").notEmpty().escape(),
    body("email", "Enter a valid email").isEmail().escape(),
    body(
      "password",
      "Password must be 8characters long. 1 lowercase, 1 uppercase, 2 number and 1 special character is required"
    )
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .escape(),
  ],
  async (req, res) => {
    const inputErrors = validationResult(req);

    //If input validations are not valid
    if (!inputErrors.isEmpty()) {
      return res.status(400).json({ errors: inputErrors.array() });
    }
    //else if input validations are passed
    try {
      let user = await User.findOne({ email: req.body.email });

      //If email already exists
      if (user) {
        return res
          .status(400)
          .json({ Error: "User with this email already exist" });
      }

      //else create user in database
      user = await Userd.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      res.json(user);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Some Error Occured" });
    }
  }
);

module.exports = router;
