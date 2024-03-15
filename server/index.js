require('dotenv').config();

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const LoginRoute = require("./routes/LoginRoute");
const RegisterRoute = require("./routes/RegisterRoute");
const RecipeRoute = require("./routes/RecipeRoute");
const ForgotPassword = require("./routes/forgotPassword");
const Home = require("./controllers/controller");
const verifyToken = require("./Middleware/middleware");

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to the database");
    app.listen(process.env.PORT, () => {
      console.log(`Server Started on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

app.use("/auth", LoginRoute);
app.use("/auth", RegisterRoute);
app.use("/auth", RecipeRoute);
app.use("/auth", ForgotPassword);

app.get("/", verifyToken, Home.Home);
