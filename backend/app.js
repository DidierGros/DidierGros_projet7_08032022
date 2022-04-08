const express = require("express");
const path = require("path");
const helmet = require("helmet");


const messageRoutes = require("./Routes/message");
const commentRoutes = require("./Routes/comment");
const userRoutes = require("./Routes/user");
const profileRoutes = require("./Routes/profil");

const app = express();

//DB connection//
require("./config/dbConnexion");


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

app.use(express.json());

// Ajoute extra headers pour protéger les routes
app.use(helmet());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/messages/", messageRoutes, commentRoutes);
// app.use("/api/messages/", commentRoutes);
app.use("/api/auth", userRoutes, profileRoutes );
// app.use("/api/auth", profileRoutes);

module.exports = app;
