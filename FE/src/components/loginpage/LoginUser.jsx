import React, { useContext, useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/toke";

const LoginUser = ({ userType }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setToken, setAuthorId, setUsername, setAvatar } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      setError("Username e password sono richiesti.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3006/login/${userType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Errore durante il login.");
      }

      setToken(data.token);
      setAuthorId(data.user ? data.user._id : data.company._id);
      setUsername(data.user ? data.user.username : data.company.username);
      setAvatar(data.user ? data.user.avatar : data.company.avatar);

      if (userType === "user") {
        navigate("/home-page-user");
      } else {
        navigate("/home-page");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ marginTop: "200px" }}>
      <h2>Effettua il login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
            isInvalid={!!error}
          />
          <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            isInvalid={!!error}
          />
          <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
        </Form.Group>
        <div>
          <Button
            variant="primary"
            type="submit"
            className="mt-3"
            disabled={loading}
          >
            {loading ? "Caricamento..." : "Login"}
          </Button>
          <Button
            variant="outline-primary"
            className="mt-3 mx-3"
            href={userType === "user" ? "/new-user" : "/new-company"}
          >
            Iscriviti
          </Button>
        </div>
        <div>
          <Button variant="outline-danger" className="mt-3" href="/">
            Back
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default LoginUser;
