import React, { useState, useEffect } from "react";
import { Container, Card, Button, Form, Alert } from "react-bootstrap";

const Profile = ({ setAvatarUrl }) => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("_id");
        const response = await fetch(
          `http://localhost:3006/company/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Errore durante il recupero del profilo.");
        }

        const data = await response.json();
        setProfile(data);
        setAvatarUrl(data.avatar);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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
        `http://localhost:3006/company/${userId}/avatar`,
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
      setAvatarUrl(data.avatar);
      setSuccess("Logo aggiornato con successo!");
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
          <Card.Title>{profile.username}</Card.Title>
          <Card.Text>
            <strong>Email:</strong> {profile.email}
          </Card.Text>
          <Card.Text>
            <strong>Posizione:</strong> {profile.position}
          </Card.Text>
          <Card.Text>
            <img
              src={profile.avatar}
              alt="User Avatar"
              className="img-fluid rounded-circle"
              width="100"
            />
          </Card.Text>
          <Form onSubmit={handleAvatarUpload}>
            <Form.Group controlId="formAvatar">
              <Form.Label>Carica nuovo avatar</Form.Label>
              <Form.Control type="file" onChange={handleAvatarChange} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Aggiorna il logo
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
          <Button variant="primary" href="/home-page" className="mt-3">
            Back
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
