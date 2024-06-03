import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    cover: "",
    readTimeValue: "",
    readTimeUnit: "",
    content: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:3006/post/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Errore durante il recupero del post.");
        }

        const data = await response.json();
        setFormData({
          category: data.category,
          title: data.title,
          cover: data.cover,
          readTimeValue: data.readTime.value,
          readTimeUnit: data.readTime.unit,
          content: data.content,
        });
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postPayload = {
      category: formData.category,
      title: formData.title,
      cover: formData.cover,
      readTime: {
        value: formData.readTimeValue,
        unit: formData.readTimeUnit,
      },
      content: formData.content,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3006/post/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postPayload),
      });

      if (!response.ok) {
        throw new Error("Errore durante l'aggiornamento del post.");
      }

      setSuccessMessage("Post aggiornato con successo!");
      setErrorMessage("");
      navigate("/home-page-user");
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage("");
    }
  };

  if (loading) {
    return <Container className="mt-4">Loading...</Container>;
  }

  return (
    <Container className="mt-4">
      <h2>Modifica Post</h2>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formCategory">
          <Form.Label>Categoria</Form.Label>
          <Form.Control
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formTitle">
          <Form.Label>Titolo</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formCover">
          <Form.Label>Immagine di copertura</Form.Label>
          <Form.Control
            type="text"
            name="cover"
            value={formData.cover}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formReadTimeValue">
          <Form.Label>Tempo di lettura (Valore)</Form.Label>
          <Form.Control
            type="number"
            name="readTimeValue"
            value={formData.readTimeValue}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formReadTimeUnit">
          <Form.Label>Tempo di lettura (Unità)</Form.Label>
          <Form.Control
            type="text"
            name="readTimeUnit"
            value={formData.readTimeUnit}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formContent">
          <Form.Label>Contenuto</Form.Label>
          <Form.Control
            as="textarea"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Aggiorna Post
        </Button>
      </Form>
    </Container>
  );
};

export default EditPost;
