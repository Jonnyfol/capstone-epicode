import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const emailRoute = express.Router();

emailRoute.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: process.env.SMTP_MAIL_USERNAME,
      pass: process.env.SMTP_MAIL_PASSWORD,
    },
  });

  const mailBody = `
    <h1>Nuova candidatura ricevuta</h1>
    <p><strong>Nome:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Messaggio:</strong></p>
    <p>${message}</p>
  `;

  try {
    const mail = await transporter.sendMail({
      from: `"Epicode Tester" <${process.env.SMTP_MAIL_USERNAME}>`,
      to: email,
      subject: "Nuova candidatura ricevuta",
      html: mailBody,
    });

    console.log("Mail inviata:", mail.messageId);
    res.status(200).send("Email inviata con successo");
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).send("Errore durante l'invio dell'email");
  }
});

export default emailRoute;
