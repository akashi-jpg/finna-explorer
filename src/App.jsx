import { Routes, Route, Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import Search from "./pages/Search";
import Details from "./pages/Details";
import Collection from "./pages/Collection";

export default function App() {
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" expand="sm">
        <Container>
          <Navbar.Brand as={Link} to="/">Finna Explorer</Navbar.Brand>
          <Nav>
            <Nav.Link as={Link} to="/">Search</Nav.Link>
            <Nav.Link as={Link} to="/collection">My collection</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/record/:id" element={<Details />} />
          <Route path="/collection" element={<Collection />} />
        </Routes>
      </Container>
    </>
  );
}