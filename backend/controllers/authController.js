const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const {
  isValidName,
  isValidAddress,
  isValidPassword,
  isValidEmail,
} = require("../utils/validators");

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
};

// Normal users sign up through this route. They always get role "user".
const signup = async (req, res) => {
  try {
    const { name, email, address, password } = req.body;

    if (!isValidName(name)) {
      return res.status(400).json({ message: "Name must be between 20 and 60 characters" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }
    if (!isValidAddress(address)) {
      return res.status(400).json({ message: "Address must be under 400 characters" });
    }
    if (!isValidPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be 8-16 characters and include at least one uppercase letter and one special character",
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      address,
      password: hashedPassword,
      role: "user",
    });

    const token = generateToken(user);

    res.status(201).json({
      message: "Signup successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong during signup" });
  }
};

// Login works the same way for all three roles
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong during login" });
  }
};

// Any logged in user can change their own password
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!isValidPassword(newPassword)) {
      return res.status(400).json({
        message:
          "New password must be 8-16 characters and include at least one uppercase letter and one special character",
      });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong while changing password" });
  }
};

module.exports = { signup, login, changePassword };
