const bcrypt = require("bcryptjs");
const { Op, fn, col } = require("sequelize");
const { User, Store, Rating } = require("../models");
const {
  isValidName,
  isValidAddress,
  isValidPassword,
  isValidEmail,
} = require("../utils/validators");

// Dashboard totals shown on the admin home page
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load dashboard stats" });
  }
};

// Admin can create a user with any role (admin, user, store_owner)
const createUser = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;

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
    const allowedRoles = ["admin", "user", "store_owner"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Role must be admin, user or store_owner" });
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
      role,
    });

    res.status(201).json({
      message: "User created successfully",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong while creating the user" });
  }
};

// Admin can create a new store, optionally linked to an existing store_owner user
const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    if (!isValidName(name)) {
      return res.status(400).json({ message: "Name must be between 20 and 60 characters" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }
    if (!isValidAddress(address)) {
      return res.status(400).json({ message: "Address must be under 400 characters" });
    }

    const existingStore = await Store.findOne({ where: { email } });
    if (existingStore) {
      return res.status(400).json({ message: "A store with this email already exists" });
    }

    if (ownerId) {
      const owner = await User.findByPk(ownerId);
      if (!owner || owner.role !== "store_owner") {
        return res.status(400).json({ message: "ownerId must belong to a store_owner user" });
      }
    }

    const store = await Store.create({ name, email, address, ownerId: ownerId || null });

    res.status(201).json({ message: "Store created successfully", store });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong while creating the store" });
  }
};

// List stores with name/email/address filters, average rating included, sortable
const listStores = async (req, res) => {
  try {
    const { name, email, address, sortBy = "name", order = "ASC" } = req.query;

    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const stores = await Store.findAll({
      where,
      include: [{ model: Rating, as: "ratings", attributes: [] }],
      attributes: {
        include: [[fn("AVG", col("ratings.rating")), "avgRating"]],
      },
      group: ["Store.id"],
      subQuery: false,
      order: [[sortBy, order.toUpperCase() === "DESC" ? "DESC" : "ASC"]],
    });

    res.json(stores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load stores" });
  }
};

// List users (normal + admin + store_owner) with filters
const listUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy = "name", order = "ASC" } = req.query;

    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };
    if (role) where.role = role;

    const users = await User.findAll({
      where,
      attributes: ["id", "name", "email", "address", "role", "createdAt"],
      order: [[sortBy, order.toUpperCase() === "DESC" ? "DESC" : "ASC"]],
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load users" });
  }
};

// View a single user's details. If they are a store owner, include their store's rating.
const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: ["id", "name", "email", "address", "role"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let responseData = user.toJSON();

    if (user.role === "store_owner") {
      const store = await Store.findOne({
        where: { ownerId: user.id },
        include: [{ model: Rating, as: "ratings", attributes: [] }],
        attributes: {
          include: [[fn("AVG", col("ratings.rating")), "avgRating"]],
        },
        group: ["Store.id"],
      });
      responseData.storeRating = store ? store.get("avgRating") : null;
    }

    res.json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load user details" });
  }
};

module.exports = {
  getDashboardStats,
  createUser,
  createStore,
  listStores,
  listUsers,
  getUserDetails,
};
