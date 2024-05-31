import React, { useState } from "react";

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
        console.log("User added:", data);
      } catch (error) {
        console.error("Error adding user:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nome</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        {errors.name && <span>{errors.name}</span>}
      </div>
      <div>
        <label>Cognome</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        {errors.lastName && <span>{errors.lastName}</span>}
      </div>
      <div>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {errors.email && <span>{errors.email}</span>}
      </div>
      <div>
        <label>Data di nascita</label>
        <input
          type="date"
          name="bornDate"
          value={formData.bornDate}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Avatar</label>
        <input
          type="text"
          name="avatar"
          value={formData.avatar}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Nome utente</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <span>{errors.password}</span>}
      </div>
      <button type="submit">Registrati</button>
    </form>
  );
};

export default UserForm;
