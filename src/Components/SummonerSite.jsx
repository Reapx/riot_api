import { Button, Container, ListGroup } from "react-bootstrap";

export default function SummonerSite({ summoner, handleSpectate }) {
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
  return (
    <>
      <Container>
        <Button
          variant="outline-success"
          onClick={(e) => handleSpectate(e)}>
          Live Game
        </Button>
        <ListGroup>
          {summoner.map((queue) => (
            <ListGroup.Item key={queue.queueType}>
              <p>{queue.queueType}</p>
              <p>{queue.summonerName}</p>
              <p>
                {queue.tier} {queue.rank} - {queue.leaguePoints}LP
              </p>
              <p>
                Wins: {queue.wins} - Losses: {queue.losses}
              </p>
              <p>Win-Rate: {calculateWR(queue.wins, queue.losses)}</p>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Container>
    </>
  );
}
