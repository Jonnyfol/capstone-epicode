import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Button, Row, Col } from "react-bootstrap";

const DetailsPage = () => {
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch(`http://localhost:3006/post/${id}`);
        const data = await response.json();
        setAnnouncement(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [id]);

  if (loading) {
    return <Container className="mt-4">Loading...</Container>;
  }

  if (error) {
    return <Container className="mt-4">Error: {error}</Container>;
  }

  if (!announcement) {
    return <Container className="mt-4">Announcement not found</Container>;
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Img
          variant="top"
          src={announcement.cover}
          alt={announcement.title}
          style={{ maxWidth: "100%", maxHeight: "400px", objectFit: "cover" }}
        />
        <Card.Body>
          <Row>
            <Col md={2}>
              <img
                src={announcement.company.logo}
                alt={announcement.company.name}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100px",
                  objectFit: "cover",
                }}
              />
            </Col>
            <Col md={10}>
              <Card.Title>{announcement.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {announcement.category}
              </Card.Subtitle>
              <Card.Text>{announcement.content}</Card.Text>
              <Card.Text>
                <small className="text-muted">
                  Company: {announcement.company.name}
                </small>
              </Card.Text>
              <Card.Text>
                <small className="text-muted">
                  Tempo di lettura: {announcement.readTime.value}{" "}
                  {announcement.readTime.unit}
                </small>
              </Card.Text>
              <Button variant="primary" href="/home-page">
                Back
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DetailsPage;
