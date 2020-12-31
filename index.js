const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const port = 5000;

app.use(cors());
app.use(express.json()); //for post method

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/checkjwt", (req, res) => {
  res.json(true);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    //testing communication to frontend
    const testquery = await pool.query(
      "SELECT movie_list_json FROM movie_list WHERE user_id='e6632b42-75ad-4f58-b125-2f4e540c9522' ORDER BY modified_date DESC LIMIT 1"
    );
    res.json(testquery.rows[0].movie_list_json);
  } catch (error) {
    console.log(error);
  }
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  //check if user already exists

  res.json(true);
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
