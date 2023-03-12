import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { Button, Container, Table } from "react-bootstrap";
import WinrateBar from "./WinrateBar";

export default function SummonerLiveGame({ spectater }) {
  const [championData, setChampionData] = useState({});
  const [summonerSpellData, setSummonerSpellData] = useState({});
  const [runesData, setRunesData] = useState({});
  const [summonerData, setSummonerData] = useState([]);
  const [gameVersion, setGameVersion] = useState(["13.4.1"]);
  const [summonerDataFetched, setSummonerDataFetched] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleShowRunesClick = (spectate) => {
    setSelectedRow((prevSelectedRow) => {
      if (prevSelectedRow === spectate) {
        return null;
      } else {
        return spectate;
      }
    });
  };

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

  const getId = (id, object) => {
    const element = Object.values(object).find(
      (element) => element.key === String(id)
    );
    return element ? element.id : "";
  };

  const getRune = (keyStone, subRunes, object, statmods) => {
    if (statmods) {
      if (subRunes === 5008) {
        return "perk-images/StatMods/StatModsAdaptiveForceIcon.png";
      } else if (subRunes === 5005) {
        return "perk-images/StatMods/StatModsAttackSpeedIcon.png";
      } else if (subRunes === 5007) {
        return "perk-images/StatMods/StatModsCDRScalingIcon.png";
      } else if (subRunes === 5002) {
        return "perk-images/StatMods/StatModsArmorIcon.png";
      } else if (subRunes === 5003) {
        return "perk-images/StatMods/StatModsHealthScalingIcon.png";
      } else if (subRunes === 5001) {
        return "perk-images/StatMods/StatModsHealthScalingIcon.png";
      }
    }
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
      return { error: "No data found for ranked solo queue" };
    } catch (error) {
      console.error(error);
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

  const teamRows = (spectate, team) => {
    if (spectate.teamId === team) {
      let summoner = filterSummoners(spectate.summonerId);
      return (
        <>
          <tr
            key={spectate.summonerId}
            style={{
              borderLeft:
                +spectate.teamId === 100
                  ? "5px solid #00BBFB"
                  : "5px solid #FB4545",
            }}>
            <td style={{ width: "100px", verticalAlign: "middle" }}>
              <img
                src={`http://ddragon.leagueoflegends.com/cdn/${
                  gameVersion[0]
                }/img/champion/${getId(spectate.championId, championData)}.png`}
                alt={getId(spectate.championId, championData)}
                style={{
                  width: "50px",
                  height: "auto",
                  borderRadius: "5px",
                }}
              />
              <div
                style={{
                  display: "inline-block",
                  verticalAlign: "middle",
                  marginLeft: "5px",
                }}>
                <img
                  src={`http://ddragon.leagueoflegends.com/cdn/${
                    gameVersion[0]
                  }/img/spell/${getId(
                    spectate.spell1Id,
                    summonerSpellData
                  )}.png`}
                  alt={getId(spectate.spell1Id, summonerSpellData)}
                  style={{
                    width: "25px",
                    height: "auto",
                    borderRadius: "5px",
                    display: "block",
                  }}
                />
                <img
                  src={`http://ddragon.leagueoflegends.com/cdn/${
                    gameVersion[0]
                  }/img/spell/${getId(
                    spectate.spell2Id,
                    summonerSpellData
                  )}.png`}
                  alt={getId(spectate.spell2Id, summonerSpellData)}
                  style={{
                    width: "25px",
                    height: "auto",
                    borderRadius: "5px",
                    display: "block",
                  }}
                />
              </div>
            </td>
            <td style={{ verticalAlign: "middle", width: "375px" }}>
              <strong>{spectate.summonerName}</strong>
            </td>
            <td>
              {summoner != null && (
                <div style={{ textAlign: "center" }}>
                  <span>
                    <img
                      src={`./rank-images/${summoner.tier}.png`}
                      alt=""
                      style={{ width: "50px", height: "auto" }}
                    />
                    {["MASTER", "GRANDMASTER", "CHALLENGER"].includes(
                      summoner.tier
                    ) ? (
                      <span>
                        {summoner.tier.charAt(0) +
                          summoner.tier.slice(1).toLowerCase()}{" "}
                        - {summoner.leaguePoints} LP
                      </span>
                    ) : (
                      <span>
                        {summoner.tier.charAt(0) +
                          summoner.tier.slice(1).toLowerCase()}{" "}
                        {summoner.rank} - {summoner.leaguePoints} LP
                      </span>
                    )}
                  </span>
                  <WinrateBar
                    winrate={calculateWR(summoner.wins, summoner.losses)}
                    totalWins={summoner.wins}
                    totalLosses={summoner.losses}
                  />
                </div>
              )}
            </td>
            <td
              style={{
                verticalAlign: "middle",
              }}
              className="text-center">
              <Button
                variant="outline-secondary"
                className="rounded-0"
                onClick={() => handleShowRunesClick(spectate.summonerId)}>
                Show Runes
              </Button>
            </td>
          </tr>
          {selectedRow === spectate.summonerId && (
            <tr style={{ borderLeft: "5px solid #35383d" }}>
              <td colSpan={4}>
                <div style={{ whiteSpace: "nowrap" }}>
                  {spectate.perks.perkIds.map((perkId, index) => (
                    <div
                      key={index}
                      style={{ display: "inline-block" }}>
                      {getRune(
                        spectate.perks.perkSubStyle,
                        perkId,
                        runesData,
                        false
                      ) === "" ? (
                        <img
                          src={`./${getRune(
                            spectate.perks.perkStyle,
                            perkId,
                            runesData,
                            true
                          )}`}
                          alt=""
                        />
                      ) : (
                        <img
                          src={`./${getRune(
                            spectate.perks.perkSubStyle,
                            perkId,
                            runesData,
                            false
                          )}`}
                          alt=""
                        />
                      )}
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          )}
        </>
      );
    }
  };
  let teamId = 0;
  return (
    <Container>
      {[...Array(2)].map((_, i) => {
        teamId += 100;
        return (
          <Table
            key={i}
            hover>
            <thead>
              <tr>
                <th>
                  {teamId === 100 ? (
                    <strong style={{ color: "#00BBFB" }}>Blue Team</strong>
                  ) : (
                    <strong style={{ color: "#FB4545" }}>Red Team</strong>
                  )}
                </th>
                <th>Summoner</th>
                <th>Season 2023 Winrate</th>
                <th>Runes</th>
              </tr>
            </thead>
            <tbody>
              {spectater.participants.map((spectate) => {
                return teamRows(spectate, teamId);
              })}
            </tbody>
          </Table>
        );
      })}
    </Container>
  );
}
