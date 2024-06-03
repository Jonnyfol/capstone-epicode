import React, { useState, useEffect } from "react";
import { Container, Card, Button, Form, Alert, Image } from "react-bootstrap";

const ProfiloUtente = () => {
  const [profile, setProfile] = useState({
    name: "",
    lastName: "",
    email: "",
    bornDate: "",
    avatar: "",
    username: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("_id");
        const response = await fetch(`http://localhost:3006/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Errore durante il recupero del profilo.");
        }

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleAvatarUpload = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("_id");
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("avatar", avatar);

    try {
      const response = await fetch(
        `http://localhost:3006/user/${userId}/avatar`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Errore durante il caricamento del logo.");
      }

      const data = await response.json();
      setProfile(data);
      setSuccess("Logo aggiornato con successo!");
      setError(null);
    } catch (error) {
      setError(error.message);
      setSuccess(null);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("_id");
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:3006/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error("Errore durante l'aggiornamento del profilo.");
      }

      const data = await response.json();
      setProfile(data);
      setSuccess("Profilo aggiornato con successo!");
      setError(null);
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

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Card.Title>Profilo Utente</Card.Title>
          <Image
            src={profile.avatar}
            roundedCircle
            width="100"
            height="100"
            className="mb-3"
            alt="User Avatar"
          />
          <Form onSubmit={handleProfileUpdate}>
            <Form.Group controlId="formName">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formLastName">
              <Form.Label>Cognome</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBornDate">
              <Form.Label>Data di Nascita</Form.Label>
              <Form.Control
                type="date"
                name="bornDate"
                value={profile.bornDate}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={profile.username}
                readOnly
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Aggiorna Profilo
            </Button>
          </Form>

          <Form onSubmit={handleAvatarUpload} className="mt-3">
            <Form.Group controlId="formAvatar">
              <Form.Label>Carica nuovo avatar</Form.Label>
              <Form.Control type="file" onChange={handleAvatarChange} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Aggiorna Avatar
            </Button>
          </Form>

          {success && (
            <Alert variant="success" className="mt-3">
              {success}
            </Alert>
          )}
          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}

          <Button variant="primary" href="/home-page-user" className="mt-3">
            Torna alla Home
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfiloUtente;
