const { Op, fn, col } = require("sequelize");
const { Store, Rating } = require("../models");

// Normal users viewing the list of stores, with their own submitted rating included
const listStoresForUser = async (req, res) => {
  try {
    const { name, address, sortBy = "name", order = "ASC" } = req.query;
    const userId = req.user.id;

    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
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

    // For each store, find this user's own rating (if any)
    const storeIds = stores.map((s) => s.id);
    const myRatings = await Rating.findAll({
      where: { userId, storeId: storeIds },
    });
    const myRatingMap = {};
    myRatings.forEach((r) => {
      myRatingMap[r.storeId] = r.rating;
    });

    const result = stores.map((store) => {
      const storeData = store.toJSON();
      storeData.userRating = myRatingMap[store.id] || null;
      return storeData;
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load stores" });
  }
};

// Submit a new rating (1-5) for a store
const submitRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { storeId, rating } = req.body;

    const ratingValue = Number(rating);
    if (!storeId || !ratingValue || ratingValue < 1 || ratingValue > 5) {
      return res.status(400).json({ message: "Rating must be a number between 1 and 5" });
    }

    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    const existing = await Rating.findOne({ where: { userId, storeId } });
    if (existing) {
      return res.status(400).json({ message: "You already rated this store, use update instead" });
    }

    const newRating = await Rating.create({ userId, storeId, rating: ratingValue });

    res.status(201).json({ message: "Rating submitted", rating: newRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not submit rating" });
  }
};

// Modify a rating the user already submitted
const updateRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { storeId, rating } = req.body;

    const ratingValue = Number(rating);
    if (!storeId || !ratingValue || ratingValue < 1 || ratingValue > 5) {
      return res.status(400).json({ message: "Rating must be a number between 1 and 5" });
    }

    const existing = await Rating.findOne({ where: { userId, storeId } });
    if (!existing) {
      return res.status(404).json({ message: "You have not rated this store yet" });
    }

    existing.rating = ratingValue;
    await existing.save();

    res.json({ message: "Rating updated", rating: existing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not update rating" });
  }
};

module.exports = { listStoresForUser, submitRating, updateRating };
