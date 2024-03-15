const mongoose = require("mongoose");
const mongoURI = "mongodb://127.0.0.1:27017";
const connectToDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Database Connection successful");
  } catch (error) {
    console.error("Connection error:", error);
  }
};

module.exports = connectToDB;
