const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const fetchUser = require("../Middlewares/fetchUser");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "07$aM@4Ra26";

//Route1 : Create new user: using POST "/api/auth/createUser" (No Login required)
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
    let success = false;
    const inputErrors = validationResult(req);

    //If input validations are not valid
    if (!inputErrors.isEmpty()) {
      return res.status(400).json({ success, errors: inputErrors.array() });
    }
    //else if input validations are passed
    try {
      let user = await User.findOne({ email: req.body.email });

      //If email already exists
      if (user) {
        return res
          .status(400)
          .json({ success, errors: "User with this email already exist" });
      }

      //else create user in database

      //Password Hashing
      const salt = await bcrypt.genSalt(10);
      const securePassword = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePassword,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ success, errors: "Internal Server error" });
    }
  }
);

//Route2 : Login user: using POST "/api/auth/login" (No Login required)
router.post(
  "/login",
  [
    body("email", "Enter a valid Email").isEmail().escape(),
    body("password", "Password cannot be empty").exists().escape(),
  ],
  async (req, res) => {
    success = false;
    const inputErrors = validationResult(req);

    //If input validations are not valid
    if (!inputErrors.isEmpty()) {
      return res.status(400).json({ success, errors: inputErrors.array() });
    }
    //else if input validations are passed
    try {
      //Check if email is correct
      let user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res
          .status(401)
          .json({ success, errors: "Enter Correct Email/Password" });
      }
      //Check if password is correct
      const isCorrectPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isCorrectPassword) {
        return res
          .status(401)
          .json({ success, errors: "Enter Correct Email/Password" });
      }

      //generate JWT Token
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ success, error: "Internal Server Error" });
    }
  }
);

//Route3 : Get User details: using POST "/api/auth/getUser" (Login required)
router.post("/getUser", fetchUser, async (req, res) => {
  let success = false;
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    success = true;
    res.send({ success, user });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success, errors: "Some Error Occured" });
  }
});

module.exports = router;
