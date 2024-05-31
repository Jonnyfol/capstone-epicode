import React, { useState } from "react";
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
  NavDropdown,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

const CustomNavbar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [avatar, setAvatar] = useState(localStorage.getItem("avatar"));
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("avatar");
    localStorage.removeItem("_id");
    navigate("/welcome");
  };

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      className="justify-content-between"
    >
      <Navbar.Brand href="#">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/LinkedIn_Logo.svg/1280px-LinkedIn_Logo.svg.png"
          width="100"
          height="30"
          className="d-inline-block align-top"
          alt="Logo"
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />

      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link onClick={() => handleNavigation("/")}>Home</Nav.Link>
          <Nav.Link onClick={() => handleNavigation("/announcements")}>
            Announcements
          </Nav.Link>
          <Nav.Link onClick={() => handleNavigation("/companies")}>
            Companies
          </Nav.Link>
        </Nav>

        <Form inline>
          <FormControl
            type="text"
            placeholder="Search"
            className="mr-sm-2"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Button variant="outline-light">Search</Button>
        </Form>

        <NavDropdown
          title={
            <img
              src={avatar}
              width="70"
              height="50"
              className="d-inline-block align-top"
              alt="User Avatar"
            />
          }
          id="user-dropdown"
          alignRight
        >
          <NavDropdown.Item as={Link} to="/profile">
            Il mio profilo
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
        </NavDropdown>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;
