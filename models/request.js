const mongoose = require("mongoose");

const requestSchema = {
  product: {
    type: String,
    required: true,
  },
  variety: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "usersModel" }, // Reference to User model
  createdAt: { type: Date, default: Date.now },
};

const requestModel = new mongoose.model("request", requestSchema);

module.exports = requestModel;
