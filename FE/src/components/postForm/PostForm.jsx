import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Image } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Importa i file di stile di React Quill

const PostForm = () => {
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    cover: "",
    readTimeValue: "",
    readTimeUnit: "",
    company: {
      name: "",
      logo: "",
      username: "",
    },
    content: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const companyName = localStorage.getItem("username");
    const logo = localStorage.getItem("avatar");

    if (companyName && logo) {
      setFormData((prevData) => ({
        ...prevData,
        company: {
          name: companyName,
          logo: logo,
          username: companyName,
        },
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "readTimeValue" || name === "readTimeUnit") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else if (name.startsWith("company.")) {
      const field = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        company: {
          ...prevData.company,
          [field]: value,
        },
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.category) errors.push("Categoria è richiesta.");
    if (!formData.title) errors.push("Titolo è richiesto.");
    if (!formData.cover) errors.push("Immagine di copertura è richiesta.");
    if (!formData.readTimeValue || isNaN(formData.readTimeValue))
      errors.push("Tempo di lettura (valore) deve essere un numero.");
    if (!formData.readTimeUnit)
      errors.push("Tempo di lettura (unità) è richiesto.");
    if (!formData.content) errors.push("Contenuto è richiesto.");
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (formErrors.length > 0) {
      setErrorMessage(formErrors.join(" "));
      return;
    }

    const postPayload = {
      category: formData.category,
      title: formData.title,
      cover: formData.cover,
      readTime: {
        value: formData.readTimeValue,
        unit: formData.readTimeUnit,
      },
      company: formData.company,
      content: formData.content,
    };

    try {
      const response = await fetch("http://localhost:3006/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postPayload),
      });

      if (!response.ok) {
        throw new Error("Errore durante l'invio del post.");
      }

      const data = await response.json();
      setSuccessMessage("Post inviato con successo!");
      setErrorMessage("");
      console.log("Post inviato con successo:", data);
      resetForm();
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage("");
      console.error("Errore durante l'invio del post:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      category: "",
      title: "",
      cover: "",
      readTimeValue: "",
      readTimeUnit: "",
      company: {
        name: localStorage.getItem("username") || "",
        logo: localStorage.getItem("avatar") || "",
        username: localStorage.getItem("username") || "",
      },
      content: "",
    });
  };

  return (
    <Container style={{ marginTop: "50px" }}>
      <h2>Crea un nuovo post</h2>
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

        <Form.Group controlId="formCompany">
          <Form.Label>Nome dell'azienda</Form.Label>
          <Form.Control
            type="text"
            name="company.name"
            value={formData.company.name}
            readOnly
          />
        </Form.Group>

        <Form.Group controlId="formLogo">
          <Form.Label>Logo</Form.Label>
          <Image src={formData.company.logo} alt="Company Logo" width="100" />
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

        <Button variant="primary" type="submit" className="mt-3">
          Invia
        </Button>
        <Button
          variant="outline-danger"
          className="mt-3 mx-3"
          href="/home-page"
        >
          Back
        </Button>
      </Form>
    </Container>
  );
};

export default PostForm;
