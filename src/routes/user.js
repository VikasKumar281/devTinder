// const express = require("express");
// const { userAuth } = require("../middlewares/auth");
// const ConnectionRequest = require("../models/connectionRequest");
// const userRouter = express.Router();
// const User = require("../models/user");

// const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";


// //Get all the pending(interested) connection request for the loggedIn user ------------------------------>
// userRouter.get("/user/requests/recieved" , userAuth , async(req , res) => {
//    try{
//       const loggedInUser = req.user;

//       const connectionRequests = await ConnectionRequest.find({
//          toUserId: loggedInUser._id ,
//          status: "interested",
//        }).populate("fromUserId" , USER_SAFE_DATA);
//     //   }).populate("fromUserId" , ["firstName" , "lastName"]);


//       res.json({
//         message: "Data fetched Successfully",
//         data: connectionRequests,
//       });

//     }
//    catch(err){
//      res.status(400).send("ERROR: " + err.message);
//    }
// }); 


// // Get all the connections of loggedIn user--------------------------->
// userRouter.get("/user/connections" , userAuth , async(req , res) => {
//     try{
//         const loggedInUser = req.user;

//         const connectionRequests = await ConnectionRequest.find({

//             $or: [
//                 { toUserId: loggedInUser._id , status: "accepted" },
//                 { fromUserId: loggedInUser._id , status: "accepted" },
//             ]

//         }).populate( "fromUserId" , USER_SAFE_DATA)
//           .populate("toUserId" , USER_SAFE_DATA);


//         const data = connectionRequests.map((row) => { 

//           // if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
//           //   return row.toUserId;
//           // }
//           if(row.fromUserId._id.equals(loggedInUser._id)){
//             return row.toUserId;
//           }
          
//           return row.fromUserId;

//         });


//         res.json({ data });
         
//     }
//     catch(err){
//         res.status(400).send("ERROR: " + err.message);
//     }
// })


// //GET feed of the loggedIn User------------------------------>
// userRouter.get("/user/feed" , userAuth , async(req , res) => {
//   try{

//     const loggedInUser = req.user;

//     const pageno = parseInt(req.query.page) || 1;
//     let limit = parseInt(req.query.limit) || 10;
//      limit = limit > 50 ? 50 : limit;
//     const skip = (pageno - 1) * limit; 


//     // Find all connection requests(sent + recieved)
//     const connectionRequests = await ConnectionRequest.find({
//       $or: [
//         { fromUserId: loggedInUser._id},
//         { toUserId: loggedInUser._id},
//       ]
//     }).select("fromUserId toUserId")

//     const hideUsersFromFeed = new Set(); 
//     connectionRequests.forEach(req => {
//       hideUsersFromFeed.add(req.fromUserId.toString());
//       hideUsersFromFeed.add(req.toUserId.toString());
//     });
     

//      const users = await User.find({
//       $and: [
//          {_id: { $nin: Array.from(hideUsersFromFeed)}},
//          {_id: { $ne: loggedInUser._id } },
//       ],
//      }).select(USER_SAFE_DATA)
//        .skip(skip)
//        .limit(limit);

       
//      res.send(users);

//   }
//   catch(err){
//     res.status(400).json({ message: err.message });
//   }
// });


// module.exports = userRouter;




const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

// Get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    // }).populate("fromUserId", ["firstName", "lastName"]);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    req.statusCode(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    // console.log(connectionRequests);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId  toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
module.exports = userRouter;