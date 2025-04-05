// const mongoose = require("mongoose");
// const validator = require('validator');
// const jwt = require("jsonwebtoken")
// const bcrypt = require("bcrypt")

//  const userSchema =  new mongoose.Schema({
//     firstName: {
//         type: String,
//         required: true,
//         minLength: 3,
//         maxLength:50,
//         trim: true,
//     },
//     lastName: {
//         type: String,
//         required: true,
//         minLength: 3,
//         maxLength:50,
//         trim: true,
//     },
//     emailId: {
//         type: String,
//         required: true,
//         unique: true,
//         trim: true,
//         validate(value){
//         if(!validator.isEmail(value)){
//             throw new Error("email not valid");
//         }
//         }
//     },
//     password: {
//         type: String,
//         required: true,
//         unique: true,
//         trim: true,
//         validate(value){
//             if(!validator.isStrongPassword(value)){
//                 throw new Error("password note be strong");
//             }
//             }
//     },
//     age: {
//         type: Number,
//         // required: true,
//         min: 15,
//         max:100,
//         trim: true,
//     },
//     gender: {
//         type: String,
//         // required: true,
//         trim: true,
//         enum: {
//             values: ["male","female","other"],
//             message: `{VALUE} gender data is not valid`
//         }
       
       
//     },
//     photoUrl: {
//         type: String,
//         trim: true,
//         maxlength:50000,
//         default:"https://res.cloudinary.com/demo/image/upload/d_avatar.png/non_existing_id.png",
//         validate(value){
//             if(!validator.isURL(value)){
//                 throw new Error("URL is wrong");
//             }
//             }
//     },
//     skills: {
//         type: [String],
//         validate(value){
//             if(value.length > 10){
//                 throw new Error("you are not add skills more then 10");
//             }
//         }
//     },
//     about: {
//         type : String,
//         maxlength:1000,
//         trim: true,
//     }

//  },{timestamps: true});

//  userSchema.index({firstName:1, lastName:2});

//  userSchema.methods.getJWT = async function(){
//     const user = this;
//     const token = await jwt.sign({_id:user._id},"DEV@Tinder$356", {expiresIn: "1d"});
//     return token;
//  };
 
//  userSchema.methods.validatePassword = async function(passwordInputByUser){
//     const user = this;
//     const passwordhash = user.password
//     const isPasswordValidate = await bcrypt.compare(passwordInputByUser, passwordhash);
    
//     return isPasswordValidate;
//  }

//  module.exports = mongoose.model("User",userSchema);








const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a Strong Password: " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: `{VALUE} is not a valid gender type`,
      },
      // validate(value) {
      //   if (!["male", "female", "others"].includes(value)) {
      //     throw new Error("Gender data is not valid");
      //   }
      // },
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    membershipType: {
      type: String,
    },
    photoUrl: {
      type: String,
      maxlength:1000,
      trim: true,
      default: "https://geographyandyou.com/images/user-profile.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL: " + value);
        }
      },
    },
    about: {
      type: String,
      maxlength:1000,
      trim: true,
      default: "This is a default about of the user!",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$356", {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );

  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);