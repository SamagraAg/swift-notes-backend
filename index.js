const connectToDB= require('./database');
const express = require('express')

connectToDB();
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello harry')
})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})