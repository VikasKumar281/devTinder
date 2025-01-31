const express = require("express");

const app = express();

app.get("/user" , ( req , res , next) => {
    //the function is Known as Route Handler.
    console.log("Handling the route user");
    // next();
    // res.send("Route Handler 1"); 
    next();
} ,
[( req , res , next) => {
    console.log("Handling the route user 2");
    // res.send("Route Handler 2");
    next();
},
( req , res , next) => {
    console.log("Handling the route user 3");
    // res.send("Route Handler 3");
    next();
}],
( req , res , next) => {
    console.log("Handling the route user 4");
    // res.send("Route Handler 4");
    next();
},
( req , res) => {
    console.log("Handling the route user 5");
    res.send("Route Handler 5");
},

);

app.listen(7777 , () => {
    console.log("Server is successfully listening on port 7777....");
});//Port no. --> 3000
