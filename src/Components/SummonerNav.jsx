import {
  Button,
  Container,
  Dropdown,
  Form,
  InputGroup,
  Nav,
  Navbar,
} from "react-bootstrap";

export default function SummonerNav({
  selectedRegion,
  regions,
  handleRegionChange,
  setSummonerName,
  handleSubmit,
}) {
  return (
    <Navbar
      bg="light"
      expand="lg"
      sticky="top"
      className="border-bottom">
      <Container fluid>
        <Navbar.Brand href="#">
          <img
            src="./logo_transparent.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="LoLStats"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0"></Nav>
          <Form
            className="d-flex"
            onSubmit={(e) => handleSubmit(e)}>
            <InputGroup>
              <Dropdown>
                <Dropdown.Toggle
                  value={selectedRegion}
                  variant="outline-success"
                  id="region-dropdown">
                  {selectedRegion || "EUW1"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {regions.map((region) => (
                    <Dropdown.Item
                      key={region}
                      onClick={(e) => handleRegionChange(e)}
                      value={region}>
                      {region.toUpperCase()}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <Form.Control
                placeholder="Summoner Name"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                onChange={(e) => setSummonerName(e.target.value)}
              />
              <Button
                variant="outline-success"
                onClick={(e) => handleSubmit(e)}>
                Search
              </Button>
            </InputGroup>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
