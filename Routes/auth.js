const express = require('express')
const router = express.Router()
const User = require('../Models/User')

router.post('/',(req,res)=>{
    res.send(req.body)
    const user = User(req.body)
    user.save()
})

module.exports = router