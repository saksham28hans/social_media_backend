const router = require('express').Router();
const Post = require("../models/Post");
const User = require("../models/User")
const { findById } = require('../models/User');

//create a post
router.post("/",async(req,res)=>{
    const newPost = new Post(req.body)
    try{
        const savedPost = await newPost.save();
        return res.status(200).json(savedPost)
    }catch(err){
        return res.status(500).json(err)
    }
})

//update a post
router.put("/:id",async(req,res)=>{
    try{
    const post = await Post.findById(req.params.id);
    if(post.userId === req.body.userId)
    {
        await post.updateOne({$set:req.body});
        res.status(200).json("Post has been updated")
    }else{
        return res.status(403).json("You can update only your post");
    }
   }catch(err)
   {
    return res.status(500).json(err)
   }
})
//delete a post
router.delete("/:id",async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id)
        if(post.userId === req.body.userId)
        {
          await post.deleteOne()
          return res.status(200).json("Your post has deleted")
        }
        else{
            return res.status(403).json("You can delete only your post")
        }
    }catch(err)
    {
        return res.status(500).json(err)
    }
})

//like a post
router.put("/:id/like",async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId))
        {
            await post.updateOne({$push:{likes:req.body.userId}});
            return res.status(200).json("Post has been liked")
        }
        else{
            await post.updateOne({$pull:{likes:req.body.userId}});
            return res.status(200).json("Post has been disliked")
        }
    }
    catch(err)
    {
        return res.status(500).json(err)
    }
})

//get a post
router.get("/:id",async(req,res)=>{
    try{
       const post = await Post.findById(req.params.id)
       return res.status(200).json(post)
    }catch(err)
    {
        return res.status(500).json(err);
    }
})

//get timeline posts
router.get("/timeline/all",async(req,res)=>{
    try{
       const currentUser = await User.findById(req.body.userId)
       const userPosts = await Post.find({userId:currentUser._id});
       const friendPosts = await Promise.all(
        currentUser.following.map((friendId)=>{
           return Post.find({userId:friendId});
        })
       );
       return res.status(200).json(userPosts.concat(...friendPosts))
    }catch(err)
    {
        return res.status(500).json(err);
    }
})

module.exports = router;
