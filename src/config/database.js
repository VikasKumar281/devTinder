const mongoose = require("mongoose");


const connectDB = async () => {
    //This will give a Promise
    await mongoose.connect(
        "mongodb+srv://NamasteDev:UrZxrn4TTTDkwBeH@namastenode.j3gsi.mongodb.net/devTinder"
    );
};

module.exports = connectDB;

