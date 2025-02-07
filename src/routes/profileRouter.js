const { userAuth } = require("../middlewares/auth");
const user = require("../models/user");
const { validateEditProfileData } = require("../utils/validation");


const express = require("express");

const profileRouter = express.Router();


//GET /profile/view API ------------------>
profileRouter.get("/profile/view" , userAuth , async (req , res) => {

    try{ 
     const user = req.user;
     res.send(user);
    }
    catch(err){
      res.status(400).send("Error saving the user:" + err.message);
    }
});

//PATCH /profile/edit API-------------------->
profileRouter.patch("/profile/edit" , userAuth , async (req ,res) => {
   try{
       if(!validateEditProfileData(req)) {
         throw new Error("Invalid Edit Request");
       };

       const loggedInUser = req.user;

       Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key])); 

//This will save the updated data in the document----->
       await loggedInUser.save();
       res.json({ message : `${loggedInUser.firstName}, your profile is updated successfully` , 
          user : loggedInUser ,
        });
   }   
   catch(err){
      res.status(400).send("ERROR: " + err.message);
   }
     
})

module.exports = profileRouter;