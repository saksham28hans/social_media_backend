const router = require("express").Router()
const User = require('../models/User');
const bcrypt = require('bcrypt')

//Register
router.post('/register', async (req, res) => {



    try {
        //Generate new Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        //Creating new User
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })

        //Saving user and sending response
        const user = await newUser.save()
        res.status(200).json(user)
    }
    catch (err) {
        res.status(400).json(err);
    }
})

//Login

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user)
            return res.status(400).json("User Not Found");

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword)
            return res.status(400).json("Please enter valid credentials");
        return res.status(200).json(user)
    }
    catch (err) {
        //console.log(err);
        return res.status(500).json(err)
    }
})
module.exports = router