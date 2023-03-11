import express from "express";
import axios from "axios";

const app = express();
const API_KEY = "RGAPI-89213c86-7584-4bed-9ba8-5888904188cd";

const getByName = (region, name, apiKey) => {
  return axios.get(
    `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${apiKey}`
  );
};

const getSpectators = (region, encryptedSummonerId, apiKey) => {
  return axios.get(
    `https://${region}.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${encryptedSummonerId}?api_key=${apiKey}`
  );
};

const getLeague = (region, encryptedSummonerId, apiKey) => {
  return axios.get(
    `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${encryptedSummonerId}?api_key=${apiKey}`
  );
};

app.get("/api/summoner/:region/:name", (req, res) => {
  const { region, name } = req.params;

  getByName(region, name, API_KEY)
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

app.get("/api/spectators/:region/:name", (req, res) => {
  const { region, name } = req.params;
  getByName(region, name, API_KEY)
    .then((response) => {
      let encryptedSummonerId = response.data.id;
      getSpectators(region, encryptedSummonerId, API_KEY)
        .then((specResponse) => {
          res.status(200).json(specResponse.data);
        })
        .catch((error) => {
          console.error(error);
          if (error.response && error.response.status === 404) {
            res.status(404).json({ error: "Summoner not Ingame" });
          } else {
            res.status(500).json({ error: "Internal server error" });
          }
        });
    })
    .catch((error) => {
      console.error(error);
      if (error.response && error.response.status === 404) {
        res.status(404).json({ error: "Summoner not Found" });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    });
});

app.get("/api/league/:region/:name", (req, res) => {
  const { region, name } = req.params;
  getByName(region, name, API_KEY)
    .then((response) => {
      let encryptedSummonerId = response.data.id;
      getLeague(region, encryptedSummonerId, API_KEY)
        .then((leagueResponse) => {
          res.status(200).json(leagueResponse.data);
        })
        .catch((error) => {
          console.error(error);
          if (error.response && error.response.status === 404) {
            res.status(404).json({ error: "Summoner not Ingame" });
          } else {
            res.status(500).json({ error: "Internal server error" });
          }
        });
    })
    .catch((error) => {
      console.error(error);
      if (error.response && error.response.status === 404) {
        res.status(404).json({ error: "Summoner not Found" });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    });
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
