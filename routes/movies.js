const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/getlist", async (req, res) => {
  const { userId } = req.body;

  try {
    const movieList = await pool.query(
      "SELECT movie_list_json FROM movie_list WHERE user_id= $1 ORDER BY modified_date DESC LIMIT 1",
      [userId]
    );
    return res.json(movieList.rows[0].movie_list_json);
  } catch (error) {
    console.log(error);
    res.status(500).json("Server error");
  }
});

router.put("/updatedb", async (req, res) => {
  const { userId, MovieList } = req.body;
  try {
    const new_list_json = JSON.stringify(MovieList);
    await pool.query(
      "UPDATE movie_list SET movie_list_json = $1 WHERE user_id = $2",
      [new_list_json, userId]
    );
    res.json("updated from backend");
  } catch (error) {
    console.log(error);
    res.status(500).json("Server error");
  }
});

module.exports = router;
