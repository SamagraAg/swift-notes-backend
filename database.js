import mongoose from "mongoose";
const dbURI = "mongodb://localhost:27017";
const connectToDB = async () => {
    try {
        await mongoose.connect(dbURI);
        console.log("Database Connection successful");
    } catch (error) {
        console.error("Connection error:", error);
    }
};
connectToDB();
export {connectToDB};