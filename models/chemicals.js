const mongoose = require("mongoose");

const chemicalSchema = {
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
};

const chemicalModel = new mongoose.model("chemical", chemicalSchema);

module.exports = chemicalModel;
