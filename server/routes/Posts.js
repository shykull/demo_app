const express = require('express');
const router = express.Router();
const { Posts, Likes } = require("../models");
const {verifyToken}=require('../middleware/AuthMiddleware');

router.get("/", async (req, res) => {
    const listOfPosts = await Posts.findAll({
      include: [Likes],
      order: [['id', 'ASC']] // Sort by PostId in ascending order
    });
    res.json(listOfPosts);
  });

router.get("/byId/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const post = await Posts.findByPk(id); // Correct method name
        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ message: "Post not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching the post" });
    }
});

router.delete ("/byId/:postId", verifyToken, async (req,res) =>{
    const postId = req.params.postId;

    await Posts.destroy({where:{
        id: postId,
    }})
    res.json("Post Deleted");
})


router.post("/",verifyToken, async (req, res) =>{
    const post = req.body;
    post.username = req.user.username
    await Posts.create(post);
    res.json(post);
});

module.exports =  router;