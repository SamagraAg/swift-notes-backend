const express = require('express')
const router = express.Router()

router.get('/',(req,res)=>{
    res.send("Authentication endpoint hit")
})

module.exports = router