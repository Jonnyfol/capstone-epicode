import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Button,
  Form,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import CustomNavbar from "../navbar/navbar";

const DetailsPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:3006/post/${id}`);
        if (!response.ok) {
          throw new Error("Errore durante il recupero del post.");
        }
        const data = await response.json();
        setPost(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3006/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          to: post.company.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Errore durante l'invio dell'email.");
      }

      setSuccess("Email inviata con successo!");
      setError(null);
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      setError(error.message);
      setSuccess(null);
    }
  };

  if (loading) {
    return <Container className="mt-4">Loading...</Container>;
  }

  if (error) {
    return <Container className="mt-4">Error: {error}</Container>;
  }

  if (!post) {
    return <Container className="mt-4">Post not found</Container>;
  }

  return (
    <div>
      <CustomNavbar />
      <Container className="mt-4">
        <Card>
          <Card.Img
            variant="top"
            src={post.cover}
            alt={post.title}
            style={{ maxWidth: "100%", maxHeight: "400px", objectFit: "cover" }}
          />
          <Card.Body>
            <Row>
              <Col md={2}>
                <img
                  src={post.company.logo}
                  alt={post.company.name}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100px",
                    objectFit: "cover",
                  }}
                />
              </Col>
              <Col md={10}>
                <Card.Title>{post.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {post.category}
                </Card.Subtitle>
                <Card.Text>{post.content}</Card.Text>
                <Card.Text>
                  <small className="text-muted">
                    Company: {post.company.name}
                  </small>
                </Card.Text>
                <Card.Text>
                  <small className="text-muted">
                    Tempo di lettura: {post.readTime.value} {post.readTime.unit}
                  </small>
                </Card.Text>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <h2 className="mt-4">Candidati per questa posizione</h2>
        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formMessage">
            <Form.Label>Messaggio</Form.Label>
            <Form.Control
              as="textarea"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">
            Invia
          </Button>
          <Button
            variant="outline-danger"
            className="mt-3 mx-3"
            onClick={() => navigate("/home-page")}
          >
            Back
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default DetailsPage;
