import mongoose from "mongoose";

mongoose.set("strictQuery", false);

mongoose.connect(`mongodb://127.0.0.1:27017/csv_upload`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error connecting to db"));

db.once("open", function () {
  console.log("connected to mongo db");
});

export default db;
