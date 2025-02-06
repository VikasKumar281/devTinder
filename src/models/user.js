const mongoose = require("mongoose");

const validator = require("validator");

const userSchema = new mongoose.Schema({ 
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
    },
    lastName: {
        type: String ,
    },
    emailId: {
        type: String,
        lowercase : true, 
        required: true,
        unique : true,
        trim : true, 
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address " + value);
            }
        },
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Your Password is not strong " + value);
            }
        }
    },
    age: {
        type: Number,
        min:18, 
    },
    gender: {
        type: String,
        validate(value){
            if(!["male","female" ,"others"].includes(value)){
                throw new Error("Gender data is not valid  " + value);
            }
        },
    },
    photoUrl: {
        type: String,
        default : "https://media.istockphoto.com/id/1327592506/vector/default-avatar-photo-placeholder-icon-grey-profile-picture-business-man.jpg?s=612x612&w=0&k=20&c=BpR0FVaEa5F24GIw7K8nMWiiGmbb8qmhfkpXcp1dhQg=",
        validate(value) {
           if(!validator.isURL(value)){
            throw new Error("Invalid URL" + value);
           }
        }
    },
    about : {
        type: String,
        default : "This is a default about of the user!",
    },
    skills: {
        type : [String],
    },
    // createdAt: {
    //     type: Date,
    // },
    // updatedAt : {
    //     type: Date,
    // }
},{
    timestamps : true,
});


module.exports = mongoose.model("User" , userSchema);;