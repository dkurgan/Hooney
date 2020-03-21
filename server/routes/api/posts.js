const express = require('express');
const router = express();
const fs = require('fs');
const { check, validationResult } = require('express-validator');
//mailgun
const mailgun = require("mailgun-js");
const DOMAIN = process.env.DOMAIN;
const mg = mailgun({ apiKey: process.env.MAIL_KEY, domain: DOMAIN });

const auth = require('../../middleware/auth.js');
const Post = require('../../models/Posts');
const User = require('../../models/User');

//Create Post
//Private
router.post('/', auth, async (req, res) => {
    const image = req.body.base64;
    if (!image) {
        return res.status(406).json({ msg: 'Image is required' });
    }
    try {
        const user = await User.findById(req.user.id).select('-password');
        const base64Data = req.body.base64.replace(/^data:image\/png;base64,/, "");
        const filePath = `uploads/posts/${user.name}-${new Date().toISOString()}.jpeg`;
        fs.writeFile(filePath, base64Data, 'base64', function (err) {
            if (err) {
                console.log(err);
            }
        });

        const newPost = new Post({
            user: req.user.id,
            name: user.name,
            imagePost: filePath,
            imageAvatar: user.imageAvatar
        });

        const post = await newPost.save();

        res.json(post);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Server fuck up" });
    }
});

//Get all Posts
//Public
router.get('/', async (req, res) => {
    try {
        let posts = await Post.find();
        if (!posts) {
            return res.status(404).json({ msg: "Cannot get list of Posts" });
        }
        res.json(posts);
    } catch (error) {
        return res.status(500).json({ msg: "Developer sucks" });
    }
})

//Get users post by user_id
//Prublic
router.get('/user/:user_id', async (req, res) => {
    try {
        let posts = await Post.find({ user: req.params.user_id });
        if (!posts) {
            return res.status(404).json({ msg: "Connot find user posts" });
        }
        res.json(posts);
    } catch (error) {
        return res.status(500).json({ msg: "Server error" });
    }
})


//Get post by :post_id
//Public
router.get('/:id', async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Cannot find Post' });
        }
        res.json(post);
    } catch (error) {
        if (error.kind == 'ObjectId') {
            return res.status(404).json({ msg: 'Cannot find Post' });
        }
        return res.status(500).json({ msg: "Server fucked up again" });
    }
});

//Delete Post
//Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(400).json({ msg: "Cannot find Post" });
        }
        fs.unlinkSync(post.imagePost);

        await Post.findByIdAndRemove(post.id);
        res.json({ msg: "Post successfully deleted" });
    } catch (error) {
        return res.status(500).json({ msg: "Server sucks" });
    }
})

//add Comment on Post
//Private
router.post('/comment/:id', auth, [
    check('text', 'Comment text is required').not().isEmpty()],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: "Text is required" });
        }
        try {
            let user = await User.findById(req.user.id).select('-password');
            const newComment = {
                user: req.user.id,
                text: req.body.text,
                name: user.name,
                imageAvatar: user.imageAvatar
            }
            const post = await Post.findById(req.params.id);
            if (!post) {
                return res.status(400).json({ msg: "Looks like post has been deleted" });
            }
            post.comments.unshift(newComment);
            user = await User.findById(post.user).select('-password')
            if (user.notifications === true) {
                const data = {
                    from: "Camagru no-reply <postmaster@sandbox97f0e9b8205e478481f7b9e2e5dae7d6.mailgun.org>",
                    to: user.email,
                    subject: "New comment",
                    html: `You got new comment on this <a href="https://hooney.herokuapp.com/#/post/${req.params.id}">Post</a>`
                };
                mg.messages().send(data, (error, body) => {
                    console.log(body, "message sent");
                });
            }
            await post.save();
            res.json(post.comments);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: "Server Error" });
        }
    })

//Delete :comment from post
//Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        //Pull out exact comment
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);
        if (!comment) {
            return res.status(404).json({ msg: "Cannot find comment" });
        }
        //Check does comment belongs to current user
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "User not authorized to delete this comment" });
        }
        //Find exact index of comment
        let removeIndex = post.comments.map(comment => comment.id);
        removeIndex = removeIndex.indexOf(req.params.comment_id)
        post.comments.splice(removeIndex, 1);
        await post.save();
        res.json(post.comments);
    } catch (error) {
        return res.status(500).json({ msg: "Server tired" });
    }
});

//Like post by post id
router.patch('/like/:id', auth, async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        if (!post) {
            return res.send(400).json({ msg: "Cannot find post" });
        }
        const user = await User.findById(req.user.id);
        //Unlike case
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {

            const removeIndex = post.likes.map(comment => comment.user.toString()).indexOf(req.user.id);
            post.likes.splice(removeIndex, 1);
            await post.save();

            res.json(post.likes);
        } else {
            post.likes.unshift({ user: req.user.id, name: user.name });
            await post.save();
            res.json(post.likes);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Server error" });
    }
});




module.exports = router