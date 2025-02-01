const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup" ,async (req , res) => {
    //Creating a new instance of a User model 
    const user = new User({
        firstName : "Sachin",
        lastName : "Kumar",
        emailId : "Sachinkumar280204@gmail.com",
        password : "SachinKumar123",
    });
    
    try{
       await user.save();
       res.send("User added successfully");
    } catch(err){
       res.status(400).send("Error saving the user:" + err.message);
    }


});

connectDB()
  .then(() => {
     console.log("Database connection established");
     app.listen(7777 , () => {
     console.log("Server is successfully listening on port 7777....");
      });//Port no. --> 7777
   })
   .catch(err =>{
    console.error("Database can not be connected",err);
  });
