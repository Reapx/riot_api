import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { Container, Table } from "react-bootstrap";

export default function SummonerLiveGame({ spectater }) {
  const [championData, setChampionData] = useState({});
  const [summonerSpellData, setSummonerSpellData] = useState({});
  const [runesData, setRunesData] = useState({});
  const [summonerData, setSummonerData] = useState([]);
  const [gameVersion, setGameVersion] = useState(["13.4.1"]);
  const [summonerDataFetched, setSummonerDataFetched] = useState(false);

  const fetchGameVersion = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://ddragon.leagueoflegends.com/api/versions.json"
      );
      setGameVersion(await response.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchChampionData = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://ddragon.leagueoflegends.com/cdn/${gameVersion[0]}/data/en_US/champion.json`
      );
      setChampionData(await response.data.data);
    } catch (error) {
      console.error(error);
    }
  }, [gameVersion]);

  const fetchSummonerSpellData = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://ddragon.leagueoflegends.com/cdn/${gameVersion[0]}/data/en_US/summoner.json`
      );
      setSummonerSpellData(await response.data.data);
    } catch (error) {
      console.error(error);
    }
  }, [gameVersion]);

  const fetchRunesData = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://ddragon.leagueoflegends.com/cdn/${gameVersion[0]}/data/en_US/runesReforged.json`
      );
      setRunesData(await response.data);
    } catch (error) {
      console.error(error);
    }
  }, [gameVersion]);

  useEffect(() => {
    fetchGameVersion();
    fetchChampionData();
    fetchSummonerSpellData();
    fetchRunesData();
  }, [
    fetchGameVersion,
    fetchChampionData,
    fetchSummonerSpellData,
    fetchRunesData,
  ]);

  // useEffect(() => {
  //   async function fetchData() {
  //     console.log(spectater);
  //     const promises = spectater.participants.map(async (summoner) => {
  //       console.log(summoner);
  //       const data = await fetchSummonerData(
  //         spectater.platformId.toLowerCase(),
  //         summoner.summonerName
  //       );
  //       return data;
  //     });
  //     const results = await Promise.all(promises);
  //     setSummonerData(results.filter((data) => data !== undefined));
  //   }
  //   fetchData();
  // }, [spectater]);

  const getId = (id, object) => {
    const element = Object.values(object).find(
      (element) => element.key === String(id)
    );
    return element ? element.id : "";
  };

  const getRune = (keyStone, subRunes, object) => {
    if (!object) {
      return "";
    }
    const element = Object.values(object).find(
      (element) => element.id === keyStone
    );
    if (!element) {
      return "";
    }
    for (let i = 0; i < element.slots.length; i++) {
      const runes = element.slots[i].runes;
      if (!runes) {
        continue;
      }
      for (let j = 0; j < runes.length; j++) {
        if (runes[j].id === subRunes) {
          return runes[j].icon;
        }
      }
    }
    return "";
  };

  const fetchSummonerData = async (region, summoner) => {
    console.log(region, summoner);
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();
    console.log(
      `Current time is: ${hours}:${minutes}:${seconds}.${milliseconds}`
    );

    try {
      const response = await axios.get(`/api/league/${region}/${summoner}`);
      let array = await response.data;
      for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (element.queueType === "RANKED_SOLO_5x5") {
          return element;
        }
      }
      // If no data for ranked solo queue is found, return an error message
      return { error: "No data found for ranked solo queue" };
    } catch (error) {
      console.error(error);
      // Return an error message if there is an error
      return { error: "An error occurred while fetching summoner data" };
    }
  };

  if (!summonerDataFetched) {
    setSummonerDataFetched(true);
    async function fetchData() {
      console.log(spectater);
      const array = await Promise.all(
        spectater.participants.map((participant) => {
          return fetchSummonerData(
            spectater.platformId.toLowerCase(),
            participant.summonerName
          );
        })
      );
      setSummonerData(array.filter((data) => data !== undefined));
    }
    fetchData();
  }

  const calculateWR = (wins, losses) => {
    switch (true) {
      case wins === 0 && losses === 0:
        return 0;
      case losses === 0 && wins > 0:
        return 100;
      case wins === 0 && losses > 0:
        return 0;
      default:
        return Math.round((wins / (wins + losses)) * 100 * 100) / 100;
    }
  };

  let filteredSummoners = 0;
  const filterSummoners = (summonerId) => {
    if (summonerData.length > 0 && summonerData.length > filteredSummoners) {
      for (let i = 0; i < summonerData.length; i++) {
        if (summonerData[i].summonerId === summonerId) {
          filteredSummoners++;
          return summonerData[i];
        }
      }
    } else {
      return null;
    }
  };

  return (
    <Container fluid>
      <Table striped="columns">
        <tbody>
          {spectater.participants.map((spectate) => {
            let summoner = filterSummoners(spectate.summonerId);
            return (
              <tr
                key={spectate.summonerId}
                style={{
                  borderLeft:
                    +spectate.teamId === 100
                      ? "5px solid #00BBFB"
                      : "5px solid #FB4545",
                }}>
                <td>
                  <img
                    src={`http://ddragon.leagueoflegends.com/cdn/${
                      gameVersion[0]
                    }/img/champion/${getId(
                      spectate.championId,
                      championData
                    )}.png`}
                    alt={getId(spectate.championId, championData)}
                  />
                </td>
                <td>
                  <img
                    src={`http://ddragon.leagueoflegends.com/cdn/${
                      gameVersion[0]
                    }/img/spell/${getId(
                      spectate.spell1Id,
                      summonerSpellData
                    )}.png`}
                    alt={getId(spectate.spell1Id, summonerSpellData)}
                  />
                  <img
                    src={`http://ddragon.leagueoflegends.com/cdn/${
                      gameVersion[0]
                    }/img/spell/${getId(
                      spectate.spell2Id,
                      summonerSpellData
                    )}.png`}
                    alt={getId(spectate.spell2Id, summonerSpellData)}
                  />
                </td>
                <td>
                  <p>{spectate.summonerName}</p>
                </td>
                <td>
                  {summoner != null && (
                    <div>
                      <p>
                        {summoner.tier} {summoner.rank} -{summoner.leaguePoints}{" "}
                        LP
                      </p>
                      <p>
                        Wins: {summoner.wins} - Losses: {summoner.losses}
                      </p>
                      <p>
                        Win-Rate: {calculateWR(summoner.wins, summoner.losses)}
                      </p>
                    </div>
                  )}
                </td>
                <td>
                  {spectate.perks.perkIds.map((perkId, index) => (
                    <div key={index}>
                      <img
                        src={`./${getRune(
                          spectate.perks.perkStyle,
                          perkId,
                          runesData
                        )}`}
                        alt=""
                      />
                      <img
                        src={`./${getRune(
                          spectate.perks.perkSubStyle,
                          perkId,
                          runesData
                        )}`}
                        alt=""
                      />
                    </div>
                  ))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
}
