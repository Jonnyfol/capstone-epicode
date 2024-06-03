import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate, Link } from "react-router-dom";
import React, { useState } from "react";
import { FormControl } from "react-bootstrap";

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
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="#">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/LinkedIn_Logo.svg/1280px-LinkedIn_Logo.svg.png"
            width="100"
            height="30"
            className="d-inline-block align-top"
            alt="Logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Nav.Link onClick={() => handleNavigation("/home-page-user")}>
              Home
            </Nav.Link>
          </Nav>
          <Form className="d-flex">
            <FormControl
              type="search"
              placeholder="Search"
              className="me-2"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Button variant="outline-success">Search</Button>
          </Form>
          <Nav>
            <NavDropdown
              title={
                <img
                  src={avatar}
                  width="50"
                  height="30"
                  className="d-inline-block align-top  mx-5"
                  alt="User Avatar"
                />
              }
              id="user-dropdown"
              alignRight
            >
              <NavDropdown.Item as={Link} to="/profilo-utente">
                Il mio profilo
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
