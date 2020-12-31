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
    // check if user_email typo/ not even exists
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (!user.rows.length) {
      return res.status(401).json({ error: "Wrong username" });
    }

    //check if password is correct
    const isValidPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!isValidPassword) {
      return res.status(401).json({ error: "Wrong password" });
    }

    //get his/her movieList
    const movieList = await pool.query(
      "SELECT movie_list_json FROM movie_list WHERE user_id= $1 ORDER BY modified_date DESC LIMIT 1",
      [user.rows[0].user_id]
    );

    const userList = await movieList.rows[0].movie_list_json;

    res.json(userList);
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
    //creates new user account
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await pool.query(
      "INSERT INTO users ( user_email, user_password ) VALUES ($1, $2) RETURNING *",
      [email, hashPassword]
    );

    //creates his/her empty movieList
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
