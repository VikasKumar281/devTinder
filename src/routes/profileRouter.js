const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");



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


//POST /profile/edit API-------------------->   (Here we used Patch but PATCH API does not works due to CORS so we used here POST API to update the Profile)
profileRouter.post("/profile/edit" , userAuth , async (req ,res) => {
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


// PATCH /profile/password API------------------>
profileRouter.patch("/profile/password" , userAuth , async (req , res) => {
 try{ 
  const{password , newPassword} = req.body;
  const userId = req.user._id;

 //Find the user by Id-----> 
  const user = await User.findById(userId);
  if(!user) {
    throw new Error("User not found");
  }


//Verify the oldPassword-------------->  
  const isMatched = bcrypt.compare(password , newPassword);
  if(!isMatched){
    throw new Error("Old password is not matched");
  }


//Create new Password --------------->
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword , salt);
  
  user.password = hashedPassword;
  await user.save();

  res.send("Password updated successfully");

 }
 catch(err){
  res.status(400).send("ERROR: " + err.message);
 }
   
});


module.exports = profileRouter;