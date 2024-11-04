const mongoose = require("mongoose");

const machineSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
    },
    description: {
      required: true,
      type: String,
    },
    price: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const machineModel = new mongoose.model("machine", machineSchema);

module.exports = machineModel;
