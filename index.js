const connectToDB = require("./database");
const express = require("express");

connectToDB();
const app = express();
const port = 3000;

app.use(express.json());

//available routes
app.use("/api/auth", require("./Routes/auth.js"));
app.use("/api/notes", require("./Routes/notes.js"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
