const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {
    check,
    validationResult
} = require('express-validator');


const User = require('../../models/User');


router.post('/', [
    check('name', 'Name is requared').not().isEmpty(),
    check('email', 'Email is requred').isEmail(),
    check('password', 'Min lenght is 8 sumb').isLength({ min: 8 })],
    async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        const {
            name,
            email,
            password
                } = req.body;
    try {
        // See if user exists
        const user = await User.findOne({ email });

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

    module.exports = router;