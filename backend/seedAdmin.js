// Run this once with `node seedAdmin.js` to create the first admin account.
// After that, the admin can create more users from the dashboard.

const bcrypt = require("bcryptjs");
const sequelize = require("./config/db");
const { User } = require("./models");
require("dotenv").config();

const run = async () => {
  try {
    await sequelize.sync();

    const email = "admin@storeapp.com";
    const existing = await User.findOne({ where: { email } });

    if (existing) {
      console.log("Admin user already exists:", email);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin@1234", 10);

    await User.create({
      name: "System Administrator Account",
      email,
      password: hashedPassword,
      address: "Head Office",
      role: "admin",
    });

    console.log("Admin user created!");
    console.log("Email:", email);
    console.log("Password: Admin@1234");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
