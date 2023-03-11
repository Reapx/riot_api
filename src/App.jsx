import React, { useState } from "react";
import axios from "axios";
import SummonerNav from "./Components/SummonerNav";
import SummonerLiveGame from "./Components/SummonerLiveGame";
import SummonerSite from "./Components/SummonerSite";

export default function App() {
  const [summonerName, setSummonerName] = useState("");
  const [summoner, setSummoner] = useState([]);
  const [spectater, setSpectater] = useState({});
  const [selectedRegion, setSelectedRegion] = useState("");

  const REGIONS = [
    "br1",
    "eun1",
    "euw1",
    "jp1",
    "kr",
    "la1",
    "la2",
    "na1",
    "oc1",
    "tr1",
    "ru",
    "ph2",
    "sg2",
    "th2",
    "tw2",
    "vn2",
  ];
  const FALLBACK_REGION = "euw1";

  const handleSubmit = async (event) => {
    event.preventDefault();
    const finalRegion =
      selectedRegion !== "" ? selectedRegion : FALLBACK_REGION;
    try {
      const response = await axios.get(
        `/api/league/${finalRegion}/${summonerName}`
      );
      setSummoner(response.data);
      console.log(response.data);
    } catch (error) {
      setSummoner([]);
      console.error(error);
    }
  };

  const handleSpectate = async (event) => {
    event.preventDefault();
    const finalRegion =
      selectedRegion !== "" ? selectedRegion : FALLBACK_REGION;
    try {
      const response = await axios.get(
        `/api/spectators/${finalRegion}/${summonerName}`
      );
      setSpectater(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.attributes[0].nodeValue);
  };

  return (
    <>
      <SummonerNav
        selectedRegion={selectedRegion}
        regions={REGIONS}
        handleRegionChange={handleRegionChange}
        setSummonerName={setSummonerName}
        handleSubmit={handleSubmit}
      />
      {summoner.length > 0 && (
        <SummonerSite
          summoner={summoner}
          handleSpectate={handleSpectate}
        />
      )}
      {Object.keys(spectater).length > 0 && (
        <SummonerLiveGame spectater={spectater} />
      )}
    </>
  );
}
