import User from "../models/userSchema.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

 export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "User already exists",
      });
    }
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    const newUser = new User({ name, email, password: hash, phone });
    const savedUser = await newUser.save();
    return res.status(200).json({
      status: true,
      message: "successful",
      data: savedUser,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};


export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        status: false,
        message: "Invalid email or password",
      });
    }

    const isPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (isPassword) {
      const token = jwt.sign(
        { userId: user._id, userEmail: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_TOKEN_EXPIRY }
      );

      return res.status(200).json({
        status: true,
        message: "successful",
        data: null,
        result: user,
        access_token: token,
      });
    } else {
      return res.status(401).json({
        status: false,
        message: "Incorrect password",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};


