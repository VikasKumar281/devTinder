const { userAuth } = require("../middlewares/auth");



const express = require("express");

const profileRouter = express.Router();


//Profile API ------------------>
profileRouter.get("/profile" , userAuth , async (req , res) => {

    try{ 
     const user = req.user;
     res.send(user);
    }
    catch(err){
      res.status(400).send("Error saving the user:" + err.message);
    }
});


module.exports = profileRouter;