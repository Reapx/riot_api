import React, { useState } from "react";
import axios from "axios";

export default function SummonerForm() {
  const [summonerName, setSummonerName] = useState("");
  const [rank, setRank] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .get(`/api/summoner/${summonerName}`)
      .then((response) => {
        setRank(response.data.rank);
        console.log(response.data);
        setError(null);
      })
      .catch((error) => {
        setRank(null);
        setError("Summoner not found");
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Summoner name:
        <input
          type="text"
          value={summonerName}
          onChange={(e) => setSummonerName(e.target.value)}
        />
      </label>
      <button type="submit">Submit</button>
      {error && <p>{error}</p>}
      {rank && <p>Rank: {rank}</p>}
    </form>
  );
}
