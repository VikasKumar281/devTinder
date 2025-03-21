// const { validateSignUpData } = require("../utils/validation");
// const User = require("../models/user");
// const bcrypt = require("bcrypt");
// const validator = require("validator");


// const express = require("express");

// const authRouter = express.Router();

// // POST /signup API --> Post the users info (as document) in the MongoDB collection
// authRouter.post("/signup" ,async (req , res) => {
 
//     try{
//     // Validation of data ------------------------------->
//        validateSignUpData(req);
    
//     //Encrypt the password--------------------------------->
//        const { firstName , lastName , emailId , password , skills ,age , gender ,photoUrl ,about } = req.body;
//        const passwordHash = await bcrypt.hash(password , 10);
//        // console.log(passwordHash); 
    
//        // console.log(req.body);
//        // const user = new User(req.body);
//        const user = new User({
//           firstName,
//           lastName,
//           emailId,
//           password: passwordHash,
//           skills,
//           age,
//           gender,
//           photoUrl,
//           about,
//        });
    
//     //Creating a new instance of a User model ----------------------------->
//     // This is a JavaScript Object not JSON object
//        //  const user = new User({
//        //      firstName : "Mahendra",
//        //      lastName : "Singh",
//        //      emailId : "MahendraSinghDhoni280204@gmail.com",
//        //      password : "MahendraDhoni 123",
//        //  });
        
//          const savedUser = await user.save();

//          const token = await savedUser.getJWT();

//        //Add the token to Cookie and send the response back to the user-------------------->
//          res.cookie("token", token ,{
//            // Expires after 10 hours ago
//            expires: new Date(Date.now() + 10 * 900000)
//          });
         
//          res.json({ message:"User added successfully" , data: savedUser });
//         }
//         catch(err){
//            res.status(400).send("Error saving the user:" + err.message);
//         }
// });

// //POST /login API -------------------->
// authRouter.post("/login", async(req , res) => {
//    try{
//       const {emailId , password} = req.body;
//       if(!validator.isEmail(emailId)){
//          throw new Error("Invalid Email "+ emailId);
//       };
      
//       const user = await User.findOne({emailId : emailId});
//       if(!user){
//          throw new Error("email or password is invalid!  , Try again..");
//       }

//       const isPasswordValid = await user.validatePassword(password);
//       if(isPasswordValid){
         
//        //Create a JWT Token--------------->
//          const token = await user.getJWT();

//        //Add the token to Cookie and send the response back to the user-------------------->
//             res.cookie("token", token ,{
//        // Expires after 10 hours ago
//               expires: new Date(Date.now() + 10 * 900000)
//             });
//             res.send(user);

//       }
//       else{
//          throw new Error("Invalid Credentials");
//       }
//    }
//    catch(err){
//       res.status(400).send("Error: " + err.message);
//    }
// });

// //POST /logout API -------------------->
// authRouter.post("/logout" , async (req , res) => {
//     res.cookie("token" , null , {
//         expires: new Date(Date.now()),
//     });
//     res.send("Logged out successfully");
   
// });

// module.exports = authRouter;


















const express = require("express");
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    // Validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    //   Creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.json({ message: "User Added successfully!", data: savedUser });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Successful!!");
});

module.exports = authRouter;