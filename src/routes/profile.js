// const express = require("express");
// const profileRouter =express.Router();
// const {userauth} = require("../middlewares/auth")
// const {validateEditProfileData,validateNewPassword} =require("../utils/validation")
// const bcrypt = require("bcrypt")
 
// profileRouter.get("/profile/view", userauth ,(req,res) => {
//     try{
//         const user = req.user;
   
//      res.json(user);

//     }
//     catch (err) {
//         res.status(500).send("Error saving user:"+ err.message);
//     }

// });

// profileRouter.post("/profile/edit", userauth , async (req, res) =>{
//  try{
//     // if( !validateEditProfileData(req)){
//     // throw new Error("update invalid");
//     // }
//     const logInUser = req.user;  
//     Object.keys(req.body).forEach((k) =>{
//         logInUser[k] = req.body[k]
//     });
//     await logInUser.save();
//     res.json({
//         message:`${logInUser.firstName} your profile updated successfully`,
//         data : logInUser
//     });
// }
// catch(err){
//     res.status(500).send("Error saving user " + err.message);
// }
// })

// profileRouter.patch("/profile/password",userauth, async (req, res) =>{
//     const user = req.user;
//     const password = req.body.password;
//     const newPassword = req.body.newPassword;
//    try{
//      const isPasswordValidate =  await user.validatePassword(password);
//      if( !isPasswordValidate){
//         throw new Error("password is not correct")
//     }
//     if(validateNewPassword(newPassword)){
//         throw new Error("please enter strong password");
//     }
//     if(password === newPassword){
//         throw new Error("invalid password");
//     }
   
//     const passwordHash =  await bcrypt.hash(newPassword, 10);
//    user.password = passwordHash;
//    await user.save();
//    res.json({message:"password change successfully!"})
//    }
//    catch(err){
//     res.status(500).json({message:"Error savind user " + err.message })
//    }

// });
// module.exports = profileRouter;


















const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const profileRouter = express.Router();
const User = require("../models/user");

const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user.toObject();
    delete user.password;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.post("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;

    if (req.body.emailId) {
      const emailId = String(req.body.emailId).trim().toLowerCase();
      if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
      }
      const existing = await User.findOne({ emailId, _id: { $ne: loggedInUser._id } });
      if (existing) {
        throw new Error("This email is already used");
      }
      req.body.emailId = emailId;
    }

    delete req.body.password;

    if (typeof req.body.firstName === "string") {
      req.body.firstName = req.body.firstName.trim();
    }

    if (typeof req.body.photoUrl === "string") {
      req.body.photoUrl = req.body.photoUrl.trim();
      if (!req.body.photoUrl) {
        delete req.body.photoUrl;
      }
    }

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    const data = loggedInUser.toObject();
    delete data.password;

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfuly`,
      data,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.post("/profile/password", userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    if (!currentPassword || !newPassword) {
      throw new Error("Current password and new password are required");
    }

    const isValid = await user.validatePassword(currentPassword);
    if (!isValid) {
      throw new Error("Current password is wrong");
    }

    if (!validator.isStrongPassword(newPassword)) {
      throw new Error(
        "New password must be at least 8 characters and include uppercase, lowercase, a number, and a symbol"
      );
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = profileRouter;