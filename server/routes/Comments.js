const express = require('express');
const router = express.Router();
const { Comments } = require("../models");
const {verifyToken}=require('../middleware/AuthMiddleware');

router.get("/:postId", async (req, res) => {
    const postId = req.params.postId;
    try {
        const comments = await Comments.findAll({where:{PostId: postId}}); // Correct method name
        if (comments) {
            res.json(comments);
        } else {
            res.status(404).json({ message: "Comments not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching the comments" });
    }
});

router.post("/", verifyToken, async (req, res) => {
    try {
        // Extract the comment data from the request body
        const comments = req.body;
        
        // Add the authenticated user's username to the comment
        const username = req.user.username;
        comments.username = username;

        // Create the comment in the database
        const newComment = await Comments.create(comments);

        // Return the newly created comment as a response
        res.json(newComment);
    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ error: "Failed to create comment" });
    }
});

router.delete ("/:commentId", verifyToken, async (req,res) =>{
    const commentId = req.params.commentId;

    await Comments.destroy({where:{
        id: commentId,
    }})

    res.json("Comment Deleted");
})



module.exports =  router;