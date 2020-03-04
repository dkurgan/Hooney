const express = require('express');
const auth = require('../../middleware/auth');
const router = express();
const fs = require('fs');

//Storage images
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/avatar');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname);
    }
})
const fileFilter = (req, file, cb) =>{
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'){
    cb(null, true);
    }
    //reject files with different types
    else {
    cb(null, false)
    }
}

const upload = multer({storage, limits: {
    //file upload maximum size
    fileSize: 1024 * 1024 * 3 }, fileFilter
    });

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Posts');

//Get all users 
//Public
router.get('/', async(req, res)=>{
    try {
        let profiles = await Profile.find().populate('user', ['name', 'imageAvatar']);
        if (!profiles){
            return res.status(404).json({msg: 'Profile not founded'});
        }
        res.send(profiles);
    } catch (error) {
        return res.status(500).json({msg: "Server Fail"});
    }
})

//Get current user info
//Private
router.get('/me', auth,async(req, res)=>{
    try {
        let profile = await Profile.findOne({user: req.user.id}).populate('user', ['name', 'imageAvatar', 'email']);
    if (!profile){
        return res.status(404).json({msg: 'Profile not founded'});
    }
    res.json(profile);    
    } catch (error) {
        return res.status(500).json({msg: 'Server Fail'});
    }
});

//Create or update user Profile
//Private
router.post('/', auth, upload.single('imageAvatar'), async(req,res)=>{
    const { website, 
            bio, 
            facebook, 
            twitter, 
            instagram
                } = req.body;
    const imageAvatar = req.file;
    const profileFields = {};
    profileFields.user = req.user.id;
    if (website) profileFields.website = website;
    if (bio) profileFields.bio = bio;

    profileFields.social = {};
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;

    try {
        let profile = await Profile.findOne({ user: req.user.id });
        // If Profile exist update info and avatarPhoto
        if (profile) {
            profile = await Profile.findOneAndUpdate({ user: req.user.id }, 
                {$set: profileFields}, { new: true }
                );
                //Update and delete previus user's Avatar
            if (imageAvatar){
                let user = await User.findOne(profile.user);
                console.log(profile.user);
                if (user.imageAvatar !== 'uploads/anonymous.png'){
                    fs.unlinkSync(user.imageAvatar);
                }
                await User.findByIdAndUpdate(profile.user, {imageAvatar: imageAvatar.path}, {new: true});
                await Post.updateMany({user: profile.user}, {imageAvatar: imageAvatar.path}, {new: true});
                }    
            return res.json(profile);
        }
        //create new Profile
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: "Server Error"});
    }
})

//Delete profile
router.delete('/', auth, async(req, res)=>{
    try {
        let profile = await Profile.findOne({user: req.user.id});
        console.log(profile)
        if(!profile){
            return res.status(400).json({msg: "Profile doesnot exists"});
        }
        await Profile.findByIdAndRemove(profile.id);
        res.json({msg: "seccus delete"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: "Server Error"});
    }
})

// Get user profile by user_id
//Public
router.get('/user/:user_id', async (req, res) => {
    try {

        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'imageAvatar']);
        if (!profile) {
            return res.status(404).json({ msg: 'Profile not found' });
        }
        res.json(profile);

    } catch (err) {
        console.log(err);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        res.status(500).send("Server Error");
    }
})

module.exports = router