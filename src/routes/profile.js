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
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

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

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfuly`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = profileRouter;