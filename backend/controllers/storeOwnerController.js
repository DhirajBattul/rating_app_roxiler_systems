const { fn, col } = require("sequelize");
const { Store, Rating, User } = require("../models");

// Store owner dashboard: list of users who rated their store + average rating
const getMyStoreDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const store = await Store.findOne({ where: { ownerId } });
    if (!store) {
      return res.status(404).json({ message: "No store is linked to this account" });
    }

    const ratings = await Rating.findAll({
      where: { storeId: store.id },
      include: [{ model: User, as: "user", attributes: ["id", "name", "email"] }],
    });

    const avgResult = await Rating.findOne({
      where: { storeId: store.id },
      attributes: [[fn("AVG", col("rating")), "avgRating"]],
      raw: true,
    });

    res.json({
      store: { id: store.id, name: store.name, email: store.email, address: store.address },
      averageRating: avgResult.avgRating ? parseFloat(avgResult.avgRating).toFixed(2) : null,
      raters: ratings.map((r) => ({
        userId: r.user.id,
        name: r.user.name,
        email: r.user.email,
        rating: r.rating,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load store dashboard" });
  }
};

module.exports = { getMyStoreDashboard };
