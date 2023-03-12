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
      bg="dark"
      expand="lg"
      sticky="top">
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
                  variant="outline-secondary"
                  id="region-dropdown">
                  {selectedRegion || "EUW1"}
                </Dropdown.Toggle>
                <Dropdown.Menu variant="dark">
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
                className="bg-dark text-white summoner-form"
                placeholder="Summoner Name"
                onChange={(e) => setSummonerName(e.target.value)}
              />
              <Button
                variant="outline-secondary"
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
