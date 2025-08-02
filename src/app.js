const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const User = require("./models/user");
const http = require("http");

require('dotenv').config();


require("./utils/cronjob");


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// CORS Middleware
app.use(cors({
  origin: ["http://localhost:5173", "https://dev-tinder-web-gules.vercel.app"],
  credentials: true,
}));


app.use(express.json()); 
app.use(cookieParser());


//IMPORTING ROUTERS----->
// const authRouter = require("./routes/authRouter");
// const profileRouter = require("./routes/profileRouter");
// const connectionRequestRouter = require("./routes/request");
// const userRouter = require("./routes/userRouter");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");




//Use the Routers
app.use("/" , authRouter);
app.use("/" , profileRouter);
app.use("/" , requestRouter);
app.use("/" , userRouter);
app.use("/" , chatRouter);


const server = http.createServer(app);
initializeSocket(server);


// // Get user by emailId --------------------------------------------------->
// app.get("/user" , async (req , res) => {
//    const userEmail = req.body.emailId;
   
//    try{
//       //Model.findOne() method---> It will give the oldest document only.
//       //here user is not array
//       const user = await User.findOne({emailId : userEmail});
//       res.send(user);


//       // // users is array
//       // const users = await User.find({ emailId : userEmail});
      
//       // if(users.length === 0){
//       //    res.status(404).send("User not found");
//       // }
//       // else{
//       //   //Sending that user back -->
//       //    res.send(users);
//       //  } 

//    }
//    catch(err){
//       res.status(400).send("Something went wrong");
//    }
// });


// //Feed API - GET /feed - get all the users from the database ------------------------>
// app.get("/feed", async (req , res) => {
   
//    try{ 
//       const users = await User.find({});
//       res.send(users);
//    }
//    catch(err){
//       res.status(400).send("Something went wrong");
//    }

// });


// //Update the data of the user-------------------------------------->
// app.patch("/user/:userId" , async (req , res) => {
   
//    const userId = req.params?.userId;
   
//    // const userId = req.body.userId;
//    // const userId = req.body._id;

//    const data = req.body;

//    try{
//       const ALLOWED_UPDATES = [
//           "photoUrl" , "about" , "gender" , "age" , "skills"
//       ];
   
//       const isUpdateAllowed = Object.keys(data).every((fields) => 
//          ALLOWED_UPDATES.includes(fields)
//       );
//       if(!isUpdateAllowed){
//          throw new Error("You can not update your name and emailId");
//       }
//       if(data?.skills.length > 10){
//          throw new Error("You can not add more than 10 skills");
//       }

//       // const user = await User.findByIdAndUpdate({_id : userId} , data , {returnDocument : "before",});
//       const user = await User.findByIdAndUpdate(userId, data , {
//            returnDocument : "before",
//            runValidators : true,
//       });
//       console.log(user);

//       res.send("User updated successfully");
//    }
//    catch(err){
//       res.status(400).send("UPDATE FAILED " + err.message );
//    }
// });


// //DELETE API - Delete the user from the database------------------------------------------>
// app.delete("/user" , async (req , res) => {
 
//   const userId = req.body.userId;

//   try{
//     const user = await User.findByIdAndDelete(userId);
//    //  const user = await User.findOneAndDelete({_id : userId});

//    res.send("User Deleted Successfully");
//   }
//   catch(err){
//     res.status(400).send("Something went wrong");
//   }
// });


connectDB()
  .then(() => {
     console.log("Database connection established");
     server.listen(process.env.PORT , () => {
     console.log("Server is successfully listening on port 7777....");
      });//Port no. --> 7777
   })
   .catch(err =>{
    console.error("Database can not be connected",err);
  });



