const sequelize = require("../config/db");
const User = require("./User");
const Store = require("./Store");
const Rating = require("./Rating");

// A store belongs to one owner (a user with role store_owner)
Store.belongsTo(User, { foreignKey: "ownerId", as: "owner" });
User.hasOne(Store, { foreignKey: "ownerId", as: "store" });

// A rating belongs to a user and a store
Rating.belongsTo(User, { foreignKey: "userId", as: "user" });
Rating.belongsTo(Store, { foreignKey: "storeId", as: "store" });
User.hasMany(Rating, { foreignKey: "userId", as: "ratings" });
Store.hasMany(Rating, { foreignKey: "storeId", as: "ratings" });

module.exports = {
  sequelize,
  User,
  Store,
  Rating,
};
