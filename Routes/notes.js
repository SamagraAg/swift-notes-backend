const express = require("express");
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

module.exports = router;
