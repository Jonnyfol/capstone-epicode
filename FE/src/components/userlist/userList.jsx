import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import "./userList.css";
import CustomNavbar from "../navbar/navbar";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3006/user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Errore durante il recupero degli utenti.");
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <Container className="mt-4">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">Errore: {error}</Alert>
      </Container>
    );
  }

  return (
    <div>
      <CustomNavbar />
      <Container className="mt-4">
        <Row>
          {users.map((user) => (
            <Col key={user._id} sm={12} md={6} lg={4} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>
                    {user.name} {user.lastName}
                  </Card.Title>
                  <Card.Text>
                    <strong>Email:</strong> {user.email}
                  </Card.Text>
                  <Card.Text>
                    <strong>Data di Nascita:</strong>{" "}
                    {new Date(user.bornDate).toLocaleDateString()}
                  </Card.Text>
                  <Card.Text>
                    <strong>Username:</strong> {user.username}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default UserList;
