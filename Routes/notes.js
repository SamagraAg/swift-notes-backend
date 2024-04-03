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
      res.json({ Success: "Note has been created", savedNote });

      //if any server side error occurs
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Some Error Occured" });
    }
  }
);

//Route3 : Update a note: using PUT "/api/notes/updatenote/:id" (Login required)\
router.put("/updatenote/:id", fetchUser, async (req, res) => {
  try {
    //Got user ID after jwt verification from fetchUser.js
    const userId = req.user.id;

    //Fetch the node to be update
    const note = await Note.findById(req.params.id);
    //if the note to be updated not exist return 404
    if (!note) {
      return res.status(404).send("Note not found");
    }

    //Check user is authorise for update or not
    if (note.user.toString() !== userId) {
      return res.status(401).send("Update Not Allowed");
    }

    //user input parameters
    const { title, description, tag } = req.body;

    //Create newNote object, it will contain attributes to be updates
    let newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //Update the note
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, newNote, {
      new: true,
    });
    res.json({ Success: "Note has been updated", updatedNote });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: "Some Error Occured" });
  }
});

//Route4 : Delete a note: using DELETE "/api/notes/deletenote/:id" (Login required)
router.delete("/deletenote/:id", fetchUser, async (req, res) => {
  try {
    //Got user ID after jwt verification from fetchUser.js
    const userId = req.user.id;

    //Fetch the node to be deleted
    const note = await Note.findById(req.params.id);
    //if the note to be deleted not exist return 404
    if (!note) {
      return res.status(404).send("Note not found");
    }

    //Check user is authorise for delete or not
    if (note.user.toString() !== userId) {
      return res.status(401).send("Deletion Not Allowed");
    }

    //Delete the nodes
    const deleteNote = await Note.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been deleted", deleteNote });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: "Some Error Occured" });
  }
});

module.exports = router;
