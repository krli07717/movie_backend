const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcrypt");
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

  try {
    //check if user already exists
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length) {
      return res.status(401).json({ error: "User already exists" });
    }
    //creates new user account and his/her empty movieList
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    let newUser = await pool.query(
      "INSERT INTO users ( user_email, user_password ) VALUES ($1, $2) RETURNING *",
      [email, hashPassword]
    );

    await pool.query(
      "INSERT INTO movie_list (movie_list_json, user_id) VALUES ($1, (SELECT user_id from users WHERE user_id = $2 ))",
      ["[]", newUser.rows[0].user_id]
    );

    return res.json({ message: "successful registration" });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server error");
  }
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
