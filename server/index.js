console.log("Starting the server...");

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require("cors");
// const path = require("path");

require('dotenv').config();  // Load .env file

// const _dirname = path.dirname("")
// const buildPath = path.join(_dirname, "../client/build")

app.use(express.json());
// app.use(express.static(buildPath));
app.use(cookieParser());
app.use(cors({
  origin: '*', // Frontend URL
  credentials: true, // Allow credentials (cookies)
}));

// app.get("/*", function(req,res){
//   res.sendFile(
//     path.join(__dirname, "../client/build/index.html"),
//     function(err){
//       if (err){
//         res.status(500).send(err);
//       }
//     }
//   );
// })

const db = require("./models");
// Routers
const postRouter = require('./routes/Posts');
app.use("/api/posts", postRouter);
const commentsRouter = require('./routes/Comments');
app.use("/api/comments", commentsRouter);
const usersRouter = require('./routes/Users');
app.use("/api/auth", usersRouter);
const likesRouter = require('./routes/Likes');
app.use("/api/like", likesRouter);



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
