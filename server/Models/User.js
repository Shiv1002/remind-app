const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const mySchema = new Schema({
  uid: String,
  email: String,
  reminders: Array,
});

module.exports = mongoose.model("user_datas", mySchema);
