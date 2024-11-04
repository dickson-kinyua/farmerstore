const mongoose = require("mongoose");

const seedsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "usersModel" }, // Reference to User model
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const seedsModel = new mongoose.model("seed", seedsSchema);

module.exports = seedsModel;
