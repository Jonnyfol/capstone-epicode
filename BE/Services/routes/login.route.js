import bcrypt from "bcryptjs";
import { authMiddleware, generateJWT } from "../auth/index.js";
import Company from "../models/company.models.js";
import User from "../models/users.models.js";
import { Router } from "express";

export const loginRoute = Router();

loginRoute.post("/register/company", async (req, res, next) => {
  try {
    let company = await Company.create({
      ...req.body,
      password: await bcrypt.hash(req.body.password, 10),
    });
    res.send(company);
  } catch (err) {
    next(err);
  }
});

loginRoute.post("/register/user", async (req, res, next) => {
  try {
    let user = await User.create({
      ...req.body,
      password: await bcrypt.hash(req.body.password, 10),
    });
    res.send(user);
  } catch (err) {
    next(err);
  }
});

// Login Endpoint for Users
loginRoute.post("/login/user", async (req, res, next) => {
  try {
    let userFound = await User.findOne({ username: req.body.username });

    if (userFound) {
      const isPasswordMatching = await bcrypt.compare(
        req.body.password,
        userFound.password
      );

      if (isPasswordMatching) {
        const token = await generateJWT({ username: userFound.username });
        res.send({ user: userFound, token });
      } else {
        res.status(400).send("Password sbagliata");
      }
    } else {
      res.status(400).send("Utente non trovato");
    }
  } catch (err) {
    next(err);
  }
});

// Login Endpoint for Companies
loginRoute.post("/login/company", async (req, res, next) => {
  try {
    const companyFound = await Company.findOne({ username: req.body.username });

    if (companyFound) {
      const isPasswordMatching = await bcrypt.compare(
        req.body.password,
        companyFound.password
      );

      if (isPasswordMatching) {
        const token = await generateJWT({ username: companyFound.username });
        res.send({ company: companyFound, token });
      } else {
        res.status(400).send("Password sbagliata");
      }
    } else {
      res.status(400).send("Azienda non trovata");
    }
  } catch (err) {
    next(err);
  }
});

export default loginRoute;
