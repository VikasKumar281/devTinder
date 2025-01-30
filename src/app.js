const express = require("express");


const app = express();

app.get("/user" , ( req , res) => {
    console.log(req.query);
    res.send({firstName:"Vikas" , secondName:"Kumar"});
});

//DYNAMIC ROUTES-->
app.get("/user/:userId/:name/:password" , ( req , res) => {
    console.log(req.params);
    res.send({firstName:"Vikas" , secondName:"Kumar"});
});


app.get(/.*fly/ , ( req , res) => {
    // regex --> /a/
    //regex --> /.*fly/
    res.send({firstName:"Vikas" , secondName:"Kumar"});
});

app.get("/ab?c" , ( req , res) => {
    // b is optional
    res.send({firstName:"Vikas" , secondName:"Kumar"});
});

app.get("/a(bc)?d" , ( req , res) => {
    // bc is optional
    res.send({firstName:"Vikas" , secondName:"Kumar"});
});

app.get("/ab+c" , ( req , res) => {
    // a and c at the last and there can be you can add many b.
    res.send({firstName:"Vikas" , secondName:"Kumar"});
});

app.get("/ab*cd" , ( req , res) => {
    // anything you can insert between ab and cd , it will run.
    res.send({firstName:"Vikas" , secondName:"Kumar"});
});

app.listen(7777 , () => {
    console.log("Server is successfully listening on port 7777....");
});//Port no. --> 3000
