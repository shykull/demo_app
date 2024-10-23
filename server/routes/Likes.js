const express = require('express');
const router = express.Router();
const { Likes } = require("../models");
const {verifyToken}=require('../middleware/AuthMiddleware');

router.post ("/",verifyToken, async (req,res) =>{
    const {PostId} = req.body;
    const UserId = req.user.id;

    const found = await Likes.findOne({where:{PostId: PostId, UserId: UserId},});

    if (!found){
        await Likes.create({PostId: PostId, UserId: UserId});
        res.json({ liked: true });
    } else {
        await Likes.destroy({where :{PostId: PostId, UserId: UserId},});
        res.json({ liked: false });
    }
});

router.get("/:postId", verifyToken, async (req, res) => {
    const PostId = req.params.postId;
    const UserId = req.user.id;
  
    const found = await Likes.findOne({
      where: { PostId: PostId, UserId: UserId },
    });
  
    if (found) {
      res.json({ liked: true });
    } else {
      res.json({ liked: false });
    }
  });
  

module.exports =  router;