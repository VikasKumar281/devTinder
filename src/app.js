const express = require("express");

const app = express();

const { adminAuth , userAuth } = require("./middlewares/auth");

//Handle Auth Middleware for all GET , POST ,... requests
app.use("/admin" , adminAuth);

app.post("/user/login" , (req , res) => {
    res.send("User logged in Successfully");
})

app.get("/user" , userAuth ,  (req , res) => {
    res.send("User Data Sent"); 
});

app.get("/admin/getAllData" , ( req , res) => {
    //Logic of checking if the request is authorised
    res.send("All Data Sent");
});

app.get("/admin/deleteAUser" , ( req , res) => {
    res.send("Deleted a User");
});

app.listen(7777 , () => {
    console.log("Server is successfully listening on port 7777....");
});//Port no. --> 3000
