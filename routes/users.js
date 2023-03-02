const router = require("express").Router()
const User = require("../models/User");
const bcrypt = require('bcrypt')
//update user
router.put("/:id",async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin)
    {
       if(req.body.password){
        try{
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password,salt);
        }catch(err)
        {
            return res.status(500).json(err)
        }
       }
       try{
        const user = await User.findByIdAndUpdate(req.params.id,{
            $set : req.body,
        });
        res.status(200).json("Account has been updated")
       }
       catch(err)
       {
        return res.status(500).json(err)
       }
    }else{
        return res.status(403).json("You can update only your account")
    }
})   
//delete user
router.delete("/:id",async(req,res)=>{
    
    if(req.body.userId === req.params.id || req.body.isAdmin)
    {
       try{
        const user = await User.findByIdAndDelete(req.params.id);
        res.status(200).json("Account has been deleted")
       }
       catch(err)
       {
        return res.status(500).json(err)
       }
    }else{
        return res.status(403).json("You can delete only your account")
    }
})   

//get a user
router.get("/:id",async(req,res)=>{
    try{
       const user = await User.findById(req.params.id)
       if(user)
       {
        const {password, updatedAt, ...other} = user._doc
        res.status(200).json(other)
       }
       else
       res.status(400).json("No user found")
    }catch(err)
    {
        return res.status(500).json(err)
    }
})
//get all users
//follow a user
router.put('/:id/follow',async(req,res)=>{
    if(req.body.userId !==req.params.id)
    {
       try{
         const user = await User.findById(req.params.id)
         const currentuser = await User.findById(req.body.userId)
         if(!user.followers.includes(req.body.userId))
         {
               await user.updateOne({ $push : {followers:req.body.userId}})
               await currentuser.updateOne({ $push : {following : req.params.id}})
               res.status(200).json("Follow request was successfull")
         }
         else
         {
            return res.status(403).json("You already follow that user")
         }
       }
       catch(err)
       {
        return res.status(500).json(err)
       }
    }
    else
    {
        return res.status(403).json("You cannot follow yourself")
    }
})


//unfollow a user
router.put('/:id/unfollow',async(req,res)=>{
    if(req.body.userId !==req.params.id)
    {
       try{
         const user = await User.findById(req.params.id)
         const currentuser = await User.findById(req.body.userId)
         if(user.followers.includes(req.body.userId))
         {
           
               await user.updateOne({ $pull : {followers:req.body.userId}})
               await currentuser.updateOne({ $pull : {following : req.params.id}})
               res.status(200).json("Unfollow request was successfull")
         }
         else
         {
            return res.status(403).json("You are not following the user")
         }
       }
       catch(err)
       {
        return res.status(500).json(err)
       }
    }
    else
    {
        return res.status(403).json("You cannot unfollow yourself")
    }
})

module.exports = router