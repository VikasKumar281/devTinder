const jwt = require("jsonwebtoken");
const User = require("../models/user");


//MIDDLEWARE--------------->
const userAuth = async (req , res , next) => {

 try{  

//Read the token from the req cookies--------------->
   const { token } = req.cookies;
   if(!token){
    return res.status(401).send("Please Login!")
   };

//If Token is present then Verify the token---------------->
//Validate the token------------------------------->
   const decodedObj = await jwt.verify(token , "DEV@Tinder$356");
   const { _id } = decodedObj;

//Find the user-------------->
   const user = await User.findById(_id);
   if(!user){
    throw new Error("User not found")
   }

//When I found the user then I will just attach the user to the request---------->  
   req.user=user;
   next();
 }
 catch(err){
    res.status(400).send("Error: " + err.message);
}


 
};

module.exports = {
    userAuth,
};