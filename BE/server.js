import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import { companyRoute } from "./Services/routes/company.route.js";
import nodemailer from "nodemailer";
import { userRoute } from "./Services/routes/user.route.js";
import { loginRoute } from "./Services/routes/login.route.js";
import { postRoute } from "./Services/routes/post.route.js";

config();
const PORT = process.env.PORT || 3006;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/", loginRoute);
app.use("/company", companyRoute);
app.use("/user", userRoute);
app.use("/post", postRoute);

const initServer = async () => {
  try {
    await mongoose.connect(process.env.DBURL);
    app.listen(PORT, () => {
      console.log(`Server is listening at port: ${PORT}`);
    });
  } catch (err) {
    console.error("Connessione al database fallita!", err);
  }
};

initServer();

const sendEmail = async () => {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: process.env.SMTP_MAIL_USERNAME,
      pass: process.env.SMTP_MAIL_PASSWORD,
    },
  });

  const mailBody = `
      <h1>Ciao da Epicode</h1>
    `;

  try {
    const mail = await transporter.sendMail({
      from: "Epicode Tester <stephon.bechtlar@ethereal.email>",
      to: "test@gmail.com",
      subject: "Epicode Testing",
      html: mailBody,
    });

    console.log(mail.messageId);
  } catch (err) {
    console.log(err);
  }
};

sendEmail();
