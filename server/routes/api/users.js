const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');
const config = require('config');
const {
    check,
    validationResult
} = require('express-validator');


const User = require('../../models/User');


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
            return res.status(400).json({ errors: [{ msg: 'User already exist' }]
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
        console.log(user, "Saved");
        // Return jsonwebtoken
        const payload = { user: { id: user.id } };
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

    //Update current User password/email
    router.patch('/update', auth, [
        check('passwordOld', "Old pasword is requred").isLength({min: 6})
    ],async(req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({msg: "Invalid credationals"});
        }
      try {
        const { email, 
            passwordOld,
            passwordNew } = req.body;
        const user = await User.findById(req.user.id);
        const isMatch = await bcrypt.compare(passwordOld, user.password);
        if (isMatch){
            if (passwordNew){
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(passwordNew, salt);
            }
            if (email){
                user.email = email;
            }
            await user.save();
            res.status(200).json({msg: "User updated successfully"});
        }else 
        res.status(400).json({msg: "user NOT updated"});
      } catch (error) {
          console.log(error);
          res.status(500).json({msg: "Server error"});
      }
    });

    module.exports = router;