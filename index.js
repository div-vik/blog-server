const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const authController = require("./controllers/authController");
const blogController = require("./controllers/blogController");
const multer = require("multer");

const app = express();

// const client = new MongoClient(process.env.MONGO_URI);

// async function run() {
//   try {
//     await client.connect();
//     console.log("Database is connected successfully!");
//   } finally {
//     // Close the database connection when finished or an error occurs
//     await client.close();
//   }
// }
// run().catch(console.error);

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to mongoDB");
  } catch (error) {
    console.log(error);
  }
};
app.use("/images", express.static("public/images"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authController);
app.use("/blog", blogController);

const storage = multer.diskStorage({
  destination: function (req, dile, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, req.body.filename);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("image"), async (req, res) => {
  return res.status(200).json({ msg: "Successfully uploaded" });
});

app.listen(process.env.PORT, () => {
  connect();
  console.log("Server has been started successfully!");
});
