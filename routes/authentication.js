require("dotenv").config();
const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const jwtGenerator = (user_id) => {
  const payload = { user_id: user_id };
  return jwt.sign(payload, process.env.jwt_key, { expiresIn: "12h" });
};

router.post("/login", async (req, res) => {
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

    //giving jwt token
    const jwtToken = jwtGenerator(user.rows[0].user_id);

    return res
      .cookie("token", jwtToken, {
        sameSite: "strict",
        path: "/",
        maxAge: 43200000,
        httpOnly: true,
        //   secure: true,
      })
      .json({
        userId: user.rows[0].user_id,
        // movieList: userList,
      });
  } catch (error) {
    console.log(error);
  }
});

router.post("/register", async (req, res) => {
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

    //giving jwt token
    const jwtToken = jwtGenerator(newUser.rows[0].user_id);

    return res
      .cookie("token", jwtToken, {
        sameSite: "strict",
        path: "/",
        maxAge: 43200000,
        httpOnly: true,
        //   secure: true,
      })
      .json({
        userId: newUser.rows[0].user_id,
        message: "successful registration",
      });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server error");
  }
});

router.get("/deleteToken", (req, res) => {
  res.status(202).clearCookie("token").send("Cookie cleared");
});

router.get("/checkjwt", cookieParser(), (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(403).json("no token found");
  }
  try {
    const { user_id } = jwt.verify(token, process.env.jwt_key);
    res.status(200).json({ user_id: user_id });
  } catch (error) {
    console.log(error);
    res.status(403).json("token is not valid");
  }
});

module.exports = router;
