const { userAuth } = require("../middlewares/auth");


const express = require("express");

const connectionRequestRouter = express.Router();

//POST API to Send Connection Request----------------------->
connectionRequestRouter.post("/sendConnectionRequest" , userAuth , async (req , res) => {
    const user = req.user;
      
    res.send(user.firstName + " sent a connection request");
});


module.exports = connectionRequestRouter;