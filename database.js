const mongoose = require("mongoose");
const mongoURI = "mongodb+srv://samagra110:samagra110@cluster0.pzd70zz.mongodb.net/swift-notes";
const connectToDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Database Connection successful");
  } catch (error) {
    console.error("Connection error:", error);
  }
};

module.exports = connectToDB;
