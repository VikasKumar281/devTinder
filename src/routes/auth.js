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


















// const express = require("express");
// const authRouter = express.Router();

// const { validateSignUpData } = require("../utils/validation");
// const User = require("../models/user");
// const bcrypt = require("bcrypt");

// authRouter.post("/signup", async (req, res) => {
//   try {
//     // Validation of data
//     validateSignUpData(req);

//     const { firstName, lastName, emailId, password } = req.body;

//     // Encrypt the password
//     const passwordHash = await bcrypt.hash(password, 10);
//     console.log(passwordHash);

//     //   Creating a new instance of the User model
//     const user = new User({
//       firstName,
//       lastName,
//       emailId,
//       password: passwordHash,
//     });

//     const savedUser = await user.save();
//     const token = await savedUser.getJWT();

//     res.cookie("token", token, {
//       expires: new Date(Date.now() + 8 * 3600000),
//     });

//     res.json({ message: "User Added successfully!", data: savedUser });
//   } catch (err) {
//     res.status(400).send("ERROR : " + err.message);
//   }
// });

// authRouter.post("/login", async (req, res) => {
//   try {
//     const { emailId, password } = req.body;

//     const user = await User.findOne({ emailId: emailId });
//     if (!user) {
//       throw new Error("Invalid credentials");
//     }
//     const isPasswordValid = await user.validatePassword(password);

//     if (isPasswordValid) {
//       const token = await user.getJWT();

//       res.cookie("token", token, {
//         expires: new Date(Date.now() + 8 * 3600000),
//       });
//       res.send(user);
//     } else {
//       throw new Error("Invalid credentials");
//     }
//   } catch (err) {
//     res.status(400).send("ERROR : " + err.message);
//   }
// });

// authRouter.post("/logout", async (req, res) => {
//   res.cookie("token", null, {
//     expires: new Date(Date.now()),
//   });
//   res.send("Loggged out Successfullly!!");
// });

// module.exports = authRouter;



const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const validator = require("validator");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/user");

const authRouter = express.Router();

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "None" : "Lax",
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
};

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !emailId || !password) {
      throw new Error("All required fields must be filled");
    }

    if (!validator.isStrongPassword(password)) {
      throw new Error(
        "Password must be at least 8 characters and include uppercase, lowercase, a number, and a symbol"
      );
    }

    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const token = user.getJWT();
    res.cookie("token", token, cookieOptions);

    const savedUser = user.toObject();
    delete savedUser.password;
    res.status(201).json({ data: savedUser });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValid = await user.validatePassword(password);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    const token = user.getJWT();
    res.cookie("token", token, cookieOptions);

    const loggedInUser = user.toObject();
    delete loggedInUser.password;
    res.json(loggedInUser);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

const googleClientId =
  process.env.GOOGLE_CLIENT_ID ||
  "906413381089-qm4m82gvie7gdu7r1qdr1faq8i5upqbu.apps.googleusercontent.com";

authRouter.get("/auth/google-config", (req, res) => {
  res.json({ clientId: googleClientId });
});

authRouter.post("/auth/google", async (req, res) => {
  try {
    const { credential, accessToken } = req.body;
    const clientId = googleClientId;
    if (!clientId) {
      throw new Error("Google login is not configured");
    }

    let payload = null;
    if (credential) {
      const googleClient = new OAuth2Client(clientId);
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: clientId,
      });
      payload = ticket.getPayload();
    } else if (accessToken) {
      const info = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: "Bearer " + accessToken },
      });
      if (!info.ok) {
        throw new Error("Google account could not be verified");
      }
      payload = await info.json();
    } else {
      throw new Error("Google credential missing");
    }

    if (!payload?.email || payload.email_verified === false) {
      throw new Error("Google account is not verified");
    }

    const emailId = payload.email.toLowerCase();
    const given = String(payload.given_name || payload.name || "User").trim();
    const firstName = given.slice(0, 50) || "User";
    const lastName = String(payload.family_name || "").trim();
    const photoUrl = payload.picture;
    const googleSub = payload.sub || payload.id;

    let user = await User.findOne({
      $or: [{ googleId: googleSub }, { emailId }],
    });

    if (!user) {
      const passwordHash = await bcrypt.hash(crypto.randomBytes(24).toString("hex"), 10);
      user = await User.create({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
        googleId: googleSub,
        authProvider: "google",
        photoUrl: photoUrl || undefined,
      });
    } else if (!user.googleId) {
      user.googleId = googleSub;
      user.authProvider = user.authProvider || "google";
      if (!user.photoUrl && photoUrl) user.photoUrl = photoUrl;
      await user.save();
    }

    const token = user.getJWT();
    res.cookie("token", token, cookieOptions);
    const safeUser = user.toObject();
    delete safeUser.password;
    res.json(safeUser);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    ...cookieOptions,
    expires: new Date(Date.now()),
  });
  res.send("Logged out successfully");
});

module.exports = authRouter;
