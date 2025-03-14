const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt= require("bcryptjs");
var jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchUser");

const JWT_SECRET='Harryisagoodb$oy'

//ROUTE 1: Create a user using : POST "/api/auth/createuser". No login required
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success=false;
    //If there are errors return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    //check wheteher the user with this email exsists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success, errors: "Sorry a user with this email already exsists" });
      }
      const salt=await bcrypt.genSalt(10);
      const secPass=await bcrypt.hash(req.body.password, salt)

      //Create a New user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });


      const data={
        user:{
          id:user.id
        }
      }
     const authtoken= jwt.sign(data, JWT_SECRET);
     console.log(authtoken);

      // res.json({ user });
      success=true;
      res.json({success, authtoken})
      //Catch errors
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);


//ROUTE 2:Authenticate a user using : POST "/api/auth/login". No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists()
  ],
  async (req, res) => {
    let success=false;
    //If there are errors return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const{email, password}=req.body;
    try {
      let user= await User.findOne({email});
      if(!user){
        return res.status(400).json({error:"Please try to login with correct credentials"})
      }
      const passwordCompare= await bcrypt.compare(password, user.password);
      if(!passwordCompare){
        return res.status(400).json({success, error:"Please try to login with correct credentials"})
        
      }

      const data={
        user:{
          id:user.id
        }
      }
      const authtoken= jwt.sign(data, JWT_SECRET);
      success=true;
      res.json({success, authtoken})
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }

  })



//ROUTE 3:Get loggedin user Details using : POST "/api/auth/getuser". Login required
router.post( "/getuser", fetchuser,  async (req, res) => {
try {
  userId=req.user.id;
  const user= await User.findById(userId).select("-password")
  res.send(user)
  
} catch (error) {
  console.error(error.message);
      res.status(500).send("Internal Server Error");
}
  })

module.exports = router;
