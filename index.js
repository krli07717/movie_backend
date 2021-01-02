const express = require("express");
const app = express();
const cors = require("cors");
const auth = require("./routes/authentication");
const movies = require("./routes/movies");
const port = 5000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json()); //for post method

app.use("/auth", auth);
app.use("/movies", movies);

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
