const { userAuth } = require("../middlewares/auth");
const express = require("express");
const connectionRequestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");


//POST API to Send Connection Request----------------------->
connectionRequestRouter.post("/request/send/:status/:toUserId",
    userAuth ,
    async (req , res) => {
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        
        const allowedStatus = [ "ignored" , "interested" ];
        if(!allowedStatus.includes(status)){
           return res.status(400).json({
            message:"Invalid status type: " + status  
           });
        };

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(400).json({message: "User not found"})
        }

    // If there is an existing ConnectionRequest
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId , toUserId},
                { fromUserId: toUserId , toUserId: fromUserId}
            ]
        }) ;  
        if(existingConnectionRequest){
            return res .status(400).send({
                message: "Connection Request Already exists"
            })
        }  

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        const data = await connectionRequest.save();
       
        if(status === "ignored"){
            res.json({
                message: req.user.firstName +" "+ status +" "+ toUser.firstName ,
                data,
            });
        };
        if(status === "interested"){
            res.json({
                message: req.user.firstName +" is "+ status +" in "+ toUser.firstName ,
                data,
            });
        };
    }
    catch(err){
        res.status(400).send("ERROR: " + err.message);
    }     
  }
);


module.exports = connectionRequestRouter;