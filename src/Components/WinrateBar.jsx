import React from "react";

const WinrateBar = ({ winrate, totalWins, totalLosses }) => {
  const winrateColor =
    winrate >= 70
      ? "DodgerBlue"
      : winrate >= 60
      ? "darkgreen"
      : winrate >= 55
      ? "green"
      : winrate >= 50
      ? "yellowgreen"
      : winrate >= 45
      ? "orange"
      : winrate >= 40
      ? "orangered"
      : "red";
  const winrateWidth = `${winrate}%`;
  return (
    <div
      style={{
        width: "100%",
        height: "20px",
        backgroundColor: "#3C3C3C",
        borderRadius: "90px",
      }}>
      <div
        style={{
          width: winrateWidth,
          height: "100%",
          backgroundColor: winrateColor,
          textAlign: "center",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: `0 0 10px ${winrateColor}`,
          borderRadius: "90px",
        }}>
        <strong className="me-1">{winrate}%</strong>/
        <small className="mx-1">{totalWins}W</small>
        <small>{totalLosses}L</small>
      </div>
    </div>
  );
};

export default WinrateBar;
