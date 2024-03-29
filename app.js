require("dotenv").config();
const express = require("express");
const { validateMovie, validateUser } = require("./validators.js");
const { hashPassword, isItDwight, verifyPassword, verifyToken } = require("./auth.js");
const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandlers");

const app = express();
app.use(express.json());

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

// the public routes

app.get("/", welcome);
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);

app.post("/api/login", userHandlers.getUserByEmail, verifyPassword)
app.post("/api/users", hashPassword, validateUser, userHandlers.postUser);

// then the routes to protect

app.use(verifyToken); // authentication wall : verifyToken is activated for each route after this line

app.post("/api/movies", verifyToken, validateMovie, movieHandlers.postMovie);

app.put("/api/movies/:id", validateMovie, movieHandlers.updateMovie);
app.put("/api/users/:id", validateUser, userHandlers.updateUser);

app.delete("/api/movies/:id", movieHandlers.deleteMovie);
app.delete("/api/users/:id", userHandlers.deleteUser);

// test github

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});