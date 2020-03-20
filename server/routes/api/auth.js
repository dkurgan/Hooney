const express = require('express');
const config = require('config');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User.js');
const auth = require('../../middleware/auth.js');


//  Get api/auth
// Private

router.get('/', auth, async (req, res) => {
    try {
        let user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        return res.status(500).json({ msg: "Server fail" });
    }
});

// POST api/auth
// Auth user and give token
// Public

router.post('/', [
    check('password', "Password is required(min 6)").exists(),
    check('email', "Email is required").isEmail()],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: "Check Login or Password" });
        }
        const { name, email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ msg: "User doesnot exist" })
            }

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ msg: "Invalid password" });
            }
            const payload = { user: { id: user.id } }
            jwt.sign(payload,
                config.get('jwtSecret'), {
                expiresIn: 360000
            }, (err, token) => {
                if (err) throw err
                res.json({ token });
            }
            )

        } catch (error) {
            return res.status(500).json({ msg: "Server Error" });
        }

    })

router.post('/verify', async (req, res) => {
    const user = await User.findOne({ _id: req.body.id }).select('-password');
    if (!user) { res.status(404).json({ msg: "Cannot get user" }) }
    await User.findByIdAndUpdate(user.id, { isVerify: true }, { new: true });
    const payload = { user: { id: user.id } };
    jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 3600000 },
        (err, token) => { if (err) throw err; res.json({ token }); });
})

module.exports = router