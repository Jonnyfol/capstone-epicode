import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";

const UserForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    bornDate: "",
    avatar: "",
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.name) tempErrors.name = "Nome è obbligatorio";
    if (!formData.lastName) tempErrors.lastName = "Cognome è obbligatorio";
    if (!formData.email) tempErrors.email = "Email è obbligatoria";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      tempErrors.email = "Email non valida";
    if (formData.password && formData.password.length < 6)
      tempErrors.password = "La password deve essere di almeno 6 caratteri";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await fetch("http://localhost:3006/register/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setSuccessMessage("Utente registrato con successo!");
        setErrorMessage("");
        console.log("User added:", data);
      } catch (error) {
        setErrorMessage("Errore durante la registrazione dell'utente.");
        setSuccessMessage("");
        console.error("Error adding user:", error);
      }
    }
  };

  return (
    <Container>
      <h2>Registrazione Utente</h2>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formName">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            isInvalid={!!errors.name}
          />
          <Form.Control.Feedback type="invalid">
            {errors.name}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formLastName">
          <Form.Label>Cognome</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            isInvalid={!!errors.lastName}
          />
          <Form.Control.Feedback type="invalid">
            {errors.lastName}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formBornDate">
          <Form.Label>Data di nascita</Form.Label>
          <Form.Control
            type="date"
            name="bornDate"
            value={formData.bornDate}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formAvatar">
          <Form.Label>Avatar</Form.Label>
          <Form.Control
            type="text"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formUsername">
          <Form.Label>Nome utente</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            isInvalid={!!errors.password}
          />
          <Form.Control.Feedback type="invalid">
            {errors.password}
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit">
          Registrati
        </Button>
      </Form>
    </Container>
  );
};

export default UserForm;
