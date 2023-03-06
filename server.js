import express from "express";
import axios from "axios";

const app = express();

app.get("/api/summoner/:name", (req, res) => {
  const { name } = req.params;
  const apiKey = "RGAPI-4914bad9-7068-47f8-87bb-2fd316130e52";
  const region = "euw1";

  axios
    .get(
      `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${apiKey}`
    )
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((error) => {
      console.error(error);
      if (error.response && error.response.status === 404) {
        res.status(404).json({ error: "Summoner not found" });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    });
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
