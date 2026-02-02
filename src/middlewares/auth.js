// // const jwt = require("jsonwebtoken");
// // const User = require("../models/user");


// // //MIDDLEWARE--------------->
// // const userAuth = async (req , res , next) => {

// //  try{  

// // //Read the token from the req cookies--------------->
// //    const { token } = req.cookies;
// //    if(!token){
// //     return res.status(401).send("Please Login!")
// //    };

// // //If Token is present then Verify the token---------------->
// // //Validate the token------------------------------->
// //    const decodedObj = await jwt.verify(token , "DEV@Tinder$356");
// //    const { _id } = decodedObj;

// // //Find the user-------------->
// //    const user = await User.findById(_id);
// //    if(!user){
// //     throw new Error("User not found")
// //    }

// // //When I found the user then I will just attach the user to the request---------->  
// //    req.user=user;
// //    next();
// //  }
// //  catch(err){
// //     res.status(400).send("Error: " + err.message);
// // }


 
// // };

// // module.exports = {
// //     userAuth,
// // };



// const jwt = require("jsonwebtoken");
// const User = require("../models/user");

// const userAuth = async (req, res, next) => {
//   try {
//     const { token } = req.cookies;
//     if (!token) {
//       return res.status(401).send("Please Login!");
//     }

//     const decodedObj = await jwt.verify(token,process.env.JWT_SECRET);

//     const { _id } = decodedObj;

//     const user = await User.findById(_id);
//     if (!user) {
//       throw new Error("User not found");
//     }

//     req.user = user;
//     next();
//   } catch (err) {
//     res.status(400).send("ERROR: " + err.message);
//   }
// };

// module.exports = {
//   userAuth,
// };


const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please login");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).send("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("Unauthorized");
  }
};

module.exports = { userAuth };
