const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const { timeStamp } = require("console");


const getSecretRoomId = (userId , targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
    const io = socket(server,{
        cors:{
            origin:"http://localhost:5173"
        },
     });
     
     io.on("connection", (socket) => {
        //Handle Events
        socket.on("joinChat",({ firstName, userId, targetUserId }) => {
          const roomId = getSecretRoomId(userId , targetUserId)

          console.log(firstName + " joined the room: " + roomId);
          socket.join(roomId);
        });

        socket.on("sendMessage",
              async ({firstName,lastName, userId , targetUserId ,text }) =>{
                //Save the messages to the Database-------------------------->
                try{
                    const roomId = getSecretRoomId(userId , targetUserId); 
                    console.log(firstName + " " + text);
    
                    let chat =  await Chat.findOne({
                      participants: {$all : [userId, targetUserId]},
                    });

                    if(!chat){
                         chat = new Chat({
                          participants: [userId, targetUserId],
                          messages: [],
                         })
                    }
                  chat.messages.push({
                    senderId: userId,
                    text,
                  });
                  await chat.save()
                  io.to(roomId).emit("messageReceived",{firstName,lastName, text, timeStamp: new Date() });
                }
                catch(err){
                  console.log(err.message);
                }
        });

        socket.on("disconnect",() => {

        });

     });
};

module.exports = initializeSocket;