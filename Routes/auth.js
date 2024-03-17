const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const { body, validationResult } = require("express-validator");

//post route for registering user(No auth required)
router.post(
  "/",
  [
    body("name", "Name cannot be empty").notEmpty().customSanitizer(value => {
      return escape(value);
    }),
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
  async (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      //All validations passed
      try {
        const user = User(req.body);
        await user.save();
        res.send(req.body);
      } catch (err) {
        return res.status(400).json({ error: "Email already exists" });
      }
    }
    res.send({ errors: result.array() });
  }
);

module.exports = router;
