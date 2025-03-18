const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
 {
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // reference to the user collection
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // reference to the user collection
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored" , "interested" , "accepted", "rejected" ],
            message: `{Value} is incorrect status type`
        }
    }
 },
 {
    timestamps:true,
 }
);


// ConnectionRequest.find({ fromUserId: 283746837shgc763gebiue7 , toUserId: 387648473vhswwd6328te});
connectionRequestSchema.index({ fromUserId: 1 , toUserId: 1 });


connectionRequestSchema.pre("save" , function (next) {
  const connectionRequest = this;

  //Check if the fromUserId is same as toUserId
  if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
     throw new Error("Cannot send connection request to yourself !!");
  }

  next();

});


const ConnectionRequest = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
);

module.exports = ConnectionRequest;