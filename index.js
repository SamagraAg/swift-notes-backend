const connectToDB = require("./database");
const express = require("express");
const cors = require('cors')

connectToDB();
const app = express();
const port = 5000;

app.use(cors())
app.use(express.json());

//available routes
app.use("/api/auth", require("./Routes/auth.js"));
app.use("/api/notes", require("./Routes/notes.js"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
