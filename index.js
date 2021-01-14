const express = require("express");
const app = express();
const cors = require("cors");
const auth = require("./routes/authentication");
const movies = require("./routes/movies");
let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}
app.use(
  cors({
    origin: "https://movie-app-717.herokuapp.com/",
    methods: "GET,PUT,POST",
    credentials: true,
  })
);
app.use(express.json()); //for post method

app.get("/", (req, res) => {
  res.json(`working`);
});

app.use("/auth", auth);
app.use("/movies", movies);

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
