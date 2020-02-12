const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  user_email: { type: String, required: true },
  date: { type: String, required: true },
  value: { type: Number, required: true },
  currency: { type: String, required: true }
});

module.exports = model("Order", schema);
