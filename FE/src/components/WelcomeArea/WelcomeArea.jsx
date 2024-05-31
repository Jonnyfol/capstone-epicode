import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const WelcomeArea = () => {
  const navigate = useNavigate();

  const handleUserLogin = () => {
    navigate("/login-user");
  };

  const handleCompanyLogin = () => {
    navigate("/login-company");
  };

  return (
    <Container className="text-center" style={{ marginTop: "100px" }}>
      <h1>Benvenuto</h1>
      <p>Scegli un'opzione per continuare</p>
      <div>
        <Button variant="primary" onClick={handleUserLogin} className="mr-2">
          Login Utente
        </Button>
        <Button
          variant="secondary"
          className=" mx-3"
          onClick={handleCompanyLogin}
        >
          Login Azienda
        </Button>
      </div>
    </Container>
  );
};

export default WelcomeArea;
