console.log("Starting the server...");

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require("cors");

require('dotenv').config();  // Load .env file

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true, // Allow credentials (cookies)
}));

const db = require("./models");
// Routers
const postRouter = require('./routes/Posts');
app.use("/posts", postRouter);
const commentsRouter = require('./routes/Comments');
app.use("/comments", commentsRouter);
const usersRouter = require('./routes/Users');
app.use("/auth", usersRouter);
const likesRouter = require('./routes/Likes');
app.use("/like", likesRouter);



db.sequelize.sync()
  .then(() => {
    console.log("Database synchronized successfully.");
    app.listen(3001, () => {
      console.log("Server Running on port 3001");
    });
  })
  .catch((error) => {
    console.error("Error during synchronization:", error);
  });
