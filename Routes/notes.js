const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const Note = require("../Models/Note");
const fetchUser = require("../Middlewares/fetchUser");

//Route1 : Fetch all notes: using GET "/api/notes/fetchallnotes" (Login required)
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    //Got user ID after jwt verification from fetchUser.js
    const userId = req.user.id;

    //Fetching Notes of that user
    const notes = await Note.find({ user: userId }).select();
    res.send(notes);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: "Some Error Occured" });
  }
});

//Route2 : Add a new note: using POST "/api/notes/addnote" (Login required)
router.post(
  "/addnote",
  fetchUser,
  //handling input validations
  [
    body("title", "Title must be atleast 3 characters")
      .isLength({ min: 3 })
      .escape(),
    body("description", "Description must be atleast 5 characters")
      .isLength({ min: 5 })
      .escape(),
    body("tag").default("general").escape(),
  ],
  fetchUser,
  async (req, res) => {
    try {
      //Return Errors if input validations doesnt pass
      const inputErrors = validationResult(req);
      if (!inputErrors.isEmpty()) {
        return res.status(400).json({ errors: inputErrors.array() });
      }

      //user input for notes
      const { title, description, tag } = req.body;

      //Got user ID after jwt verification from fetchUser.js
      const userId = req.user.id;

      //Creating new note and saving in 'notes' collection
      const newNote = await Note.create({
        title,
        description,
        tag,
        user: userId,
      });

      const savedNote = await newNote.save();
      res.json(savedNote);

      //if any server side error occurs
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Some Error Occured" });
    }
  }
);

module.exports = router;
