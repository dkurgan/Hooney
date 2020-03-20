const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');
const config = require('config');
//mailgun
const mailgun = require("mailgun-js");
const DOMAIN = process.env.DOMAIN;
const mg = mailgun({ apiKey: process.env.MAIL_KEY, domain: DOMAIN });
const {
    check,
    validationResult
} = require('express-validator');


const User = require('../../models/User');

//register User
router.post('/', [
    check('name', 'Name is requared').not().isEmpty(),
    check('email', 'Email is requred').isEmail(),
    check('password', 'Min lenght is 6 sumb').isLength({ min: 6 })],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, password } = req.body;
        try {
            // See if user exists
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({
                    errors: [{ msg: 'User already exist' }]
                });
            }
            user = new User({
                name,
                email,
                password
            })
            // Encrypt password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();
            // Return jsonwebtoken
            const payload = { user: { id: user.id } };
               //send Email veritification
               const data = {
                from: "Camagru no-reply <postmaster@sandbox97f0e9b8205e478481f7b9e2e5dae7d6.mailgun.org>",
                to: email,
                subject: "Confirmation",
                html: `Click on the link to verify your account <a href="http://hooney.herokuapp.com//verify/${user.id}">Click</a>`
            };
            mg.messages().send(data, (error, body) => {
                console.log(body, "message sent");
            });
            //Create Token for user
            jwt.sign(
                payload,
                config.get('jwtSecret'), {
                expiresIn: 3600000
            },
                (err, token) => {
                    if (err) throw err;
                    res.json({
                        token
                    });
                });

        } catch (err) {
            console.log(err);
            res.status(500).send('Server error');
        }
    });

//Update current User password/email/notifications
router.patch('/update', auth, [
    check('passwordOld', "Old pasword is requred").isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: "Invalid password or login" });
    }
    try {
        const { email,
            passwordOld,
            passwordNew,
            notifications
        } = req.body;
        const user = await User.findById(req.user.id);
        const isMatch = await bcrypt.compare(passwordOld, user.password);
        if (isMatch) {
            if (passwordNew) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(passwordNew, salt);
            }
            if (email) { user.email = email; }
            user.notifications = notifications
            await user.save();
            res.status(200).json({ msg: "User updated successfully" });
        } else
            res.status(400).json({ msg: "user NOT updated" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server error" });
    }
});

//getUSer
router.get('/', auth, async(req, res)=>{
    const user = await User.findOne( {_id: req.user.id}).select('-password');
    if (!user){res.status(404).json({msg: "Cannot get user"})}
    res.json(user);
} );

router.delete('/', auth, async(req,res)=>{
    try {
        let user = await User.findOne({_id: req.user.id});
        if(!user){
            return res.status(400).json({msg: "User doesnot exists"});
        }
        await User.findByIdAndRemove(user.id);
        res.json({msg: "seccus delete"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: "Server Error"});
    }
})

//Reset User password
router.post('/reset', async(req, res)=>{
    const {email} = req.body;
    try {
        const user = await User.findOne({email});
        if (!user){req.status(404).json({msg: "Cannot find user"})}   
        const data = {
            from: "Camagru no-reply <postmaster@sandbox97f0e9b8205e478481f7b9e2e5dae7d6.mailgun.org>",
            to: email,
            subject: "Reset Password",
            html: `Click on the link to verify your account <a href="http://localhost:3000/reset/${user.id}">Click</a>`
        };
        mg.messages().send(data, (error, body)=> {
            console.log(body);
        });
    } catch (error) {
        res.status(500).json({msg: "Server Error"})
    }
})
//Set new password after Reset
router.patch('/reset', async(req,res)=>{
    const {id, password} = req.body;
    try {
        const user = await User.findById(id);
        if (!user){
            res.status(404).json({msg: "Cannot get user"})
        }
        else 
        {const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        res.status(200).json({msg: "Updated password succesfully"});}
    } catch (error) {
        res.status(500).json({msg: "Server died"});
    }
})

module.exports = router;