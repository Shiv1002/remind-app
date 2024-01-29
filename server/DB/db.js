const mongoose = require("mongoose");
const dbUrl = process.env.dbUrl || "mongodb://localhost:27017/user";

async function main() {
  await mongoose.connect(dbUrl);
  console.log("db connected with");
  console.log(dbUrl);
}

module.exports = main;
