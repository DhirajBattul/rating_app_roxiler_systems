const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Store = sequelize.define(
  "Store",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.STRING(400),
      allowNull: true,
    },
    // links the store to a store_owner user, so the owner can see their dashboard
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "owner_id",
    },
  },
  {
    tableName: "stores",
    timestamps: true,
  }
);

module.exports = Store;
