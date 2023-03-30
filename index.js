import express, { json, urlencoded } from "express";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes/index.js";
import db from "./config/mongoose.js";

const App = express();
const PORT = 8000;

//when ever we use type="module"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

App.use(express.json());
App.use(express.urlencoded({ extended: true }));

App.set("view engine", "ejs");
App.set("views", "./views");

App.use(express.static("./assets"));
App.use("/", router);

App.listen(PORT, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`server is running on ${PORT} Port`);
});
