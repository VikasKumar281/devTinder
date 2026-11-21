const buffer = require("buffer");
if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = buffer.Buffer;
}

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


const { handleStripeWebhook } = require("./routes/premium");
app.post("/premium/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

app.use(express.json({ limit: "15mb" })); 
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("DevTinder API is running");
});


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
const supportRouter = require("./routes/support");
const { premiumRouter } = require("./routes/premium");




//Use the Routers
app.use("/" , authRouter);
app.use("/" , profileRouter);
app.use("/" , requestRouter);
app.use("/" , userRouter);
app.use("/" , chatRouter);
app.use("/" , supportRouter);
app.use("/" , premiumRouter);


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


const PORT = process.env.PORT || 7777;

connectDB()
  .then(() => {
    console.log("Database connection established");
    server.listen(PORT, "0.0.0.0", () => {
      console.log("Server is listening on port " + PORT);
    });
  })
  .catch((err) => {
    console.error("Database can not be connected", err);
  });



