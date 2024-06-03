import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import CustomNavbar from "../navbar/navbar";

const UserPosts = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3006/post", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Errore durante il recupero degli annunci.");
        }

        const data = await response.json();
        setAnnouncements(data.filter((post) => post.company.name === username));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [username]);

  const handleDetails = (id) => {
    navigate(`/details/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3006/post/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setAnnouncements(announcements.filter((a) => a._id !== id));
      } else {
        throw new Error("Errore durante l'eliminazione del post");
      }
    } catch (error) {
      setError(error.message);
    }
  };

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
      <div>
        <CustomNavbar />
        <Container className="mt-4">
          <Alert variant="danger">Errore: {error}</Alert>
        </Container>
      </div>
    );
  }

  return (
    <div>
      <CustomNavbar />
      <Container className="mt-4">
        <h2>I Miei Annunci</h2>
        <Row>
          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <Col
                key={announcement._id}
                sm={12}
                md={6}
                lg={4}
                className="mb-3"
              >
                <Card>
                  <Card.Img variant="top" src={announcement.cover} />
                  <Card.Body>
                    <Card.Title>{announcement.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {announcement.category}
                    </Card.Subtitle>
                    <Card.Text>
                      {announcement.content.slice(0, 100)}...
                    </Card.Text>
                    <Card.Text>
                      <small className="text-muted">
                        Tempo di lettura: {announcement.readTime.value}{" "}
                        {announcement.readTime.unit}
                      </small>
                    </Card.Text>
                    <Button
                      variant="primary"
                      onClick={() => handleDetails(announcement._id)}
                    >
                      Dettagli
                    </Button>
                    {announcement.company.name === username && (
                      <>
                        <Button
                          variant="outline-secondary"
                          className="ml-2"
                          onClick={() => handleEdit(announcement._id)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline-danger"
                          className="ml-2"
                          onClick={() => handleDelete(announcement._id)}
                        >
                          <FaTrash />
                        </Button>
                      </>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p>Non hai pubblicato nessun annuncio.</p>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default UserPosts;
