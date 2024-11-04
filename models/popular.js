const mongoose = require("mongoose");

const popularsSchema = new mongoose.Schema(
  {
    product: {
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
  },
  {
    timestamps: true,
  }
);

const popularModel = new mongoose.model("popular", popularsSchema);

module.exports = popularModel;
