import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const CompanyForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    avatar: "",
    email: "",
    position: "",
    password: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3006/register/company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        setSuccessMessage("Company created successfully!");
        setErrorMessage("");
        console.log("Company created successfully:", data);
      } else {
        setSuccessMessage("");
        setErrorMessage("Error creating company: " + response.statusText);
        console.error("Error creating company:", response.statusText);
      }
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage("Error creating company: " + error.message);
      console.error("Error creating company:", error);
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit} className="border p-4 rounded">
        <h2 className="mb-4">Register Company</h2>
        <div className="form-group">
          <label>Company:</label>
          <input
            type="text"
            name="username"
            className="form-control"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <small className="form-text text-muted">
            Inserisci il nome completo della tua azienda.
          </small>
        </div>
        <div className="form-group">
          <label>Logo URL:</label>
          <input
            type="text"
            name="avatar"
            className="form-control"
            value={formData.avatar}
            onChange={handleChange}
          />
          <small className="form-text text-muted">
            Inserisci l'URL del logo della tua azienda.
          </small>
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <small className="form-text text-muted">
            Inserisci un indirizzo email valido.
          </small>
        </div>
        <div className="form-group">
          <label>Position:</label>
          <input
            type="text"
            name="position"
            className="form-control"
            value={formData.position}
            onChange={handleChange}
            required
          />
          <small className="form-text text-muted">Inserisci la sede</small>
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <small className="form-text text-muted">
            La password deve essere di almeno 6 caratteri.
          </small>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
      {successMessage && (
        <div className="alert alert-success mt-3">
          {successMessage}
          <div>
            Grazie per aver registrato la tua azienda. Puoi ora accedere alla
            tua dashboard.
          </div>
        </div>
      )}
      {errorMessage && (
        <div className="alert alert-danger mt-3">
          {errorMessage}
          <div>
            Si prega di verificare i dati inseriti e riprovare. Se il problema
            persiste, contattare il supporto.
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyForm;
