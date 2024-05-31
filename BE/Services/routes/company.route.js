import { Router } from "express";
import Company from "../models/company.models.js";
// import { v2 as cloudinary } from "cloudinary";
// import bcrypt from "bcryptjs";
import { authMiddleware } from "../auth/index.js";
import { avatarmulter } from "../Middleware/multer.js";

// import passport from "passport";

// Creiamo un nuovo Router e esportiamolo per essere utilizzato altrove
export const companyRoute = Router();

// // Route per l'autenticazione con Google
// companyRoute.get(
//   "/googleLogin",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// companyRoute.get(
//   "/callback",
//   passport.authenticate("google", { session: false }),
//   (req, res, next) => {
//     try {
//       res.redirect(
//         `http://localhost:3000/welcome?accessToken=${req.user.accToken}`
//       );
//     } catch (error) {
//       next(error);
//     }
//   }
// );

companyRoute.post("/", async (req, res, next) => {
  try {
    let company = await Company.create(req.body);
    res.status(201).send(company);
  } catch (err) {
    next(err);
  }
});

// Richiesta PUT all'indirizzo "/:id"
companyRoute.put("/:id", async (req, res, next) => {
  try {
    let company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(company);
  } catch (err) {
    next(err);
  }
});

// Richiesta DELETE all'indirizzo "/:id"
companyRoute.delete("/:id", async (req, res, next) => {
  try {
    await Company.deleteOne({
      _id: req.params.id,
    });
    res.status(204).send("L'utente è stato eliminato correttamente");
  } catch (err) {
    next(err);
  }
});

// Richiesta GET per le company
companyRoute.get("/", async (req, res, next) => {
  try {
    let company = await Company.find();
    res.status(200).send(company);
  } catch (err) {
    next(err);
  }
});

// Richiesta PATCH all'indirizzo "/:id/avatar"
companyRoute.patch(
  "/:id/avatar",
  authMiddleware,
  avatarmulter.single("avatar"),
  async (req, res, next) => {
    try {
      // Il percorso dell'immagine caricata sarà disponibile in req.file.path
      const result = await cloudinary.uploader.upload(req.file.path);

      // Salvataggio dell'URL dell'immagine nel database
      const company = await Company.findByIdAndUpdate(
        req.params.id,
        { avatar: result.secure_url },
        {
          new: true, // L'oggetto restituito deve essere quello aggiornato
        }
      );
      res.send(company);
    } catch (err) {
      // In caso di errore, procediamo
      next(err);
    }
  }
);

// Richiesta GET per ottenere una singola company con un determinato ID
companyRoute.get("/:id", async (req, res, next) => {
  try {
    let company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).send("Azienda non trovata");
    }
    res.status(200).send(company);
  } catch (err) {
    next(err);
  }
});

// Endpoint in cui l'autenticazione è necessaria
companyRoute.get("/profile", async (req, res, next) => {
  try {
    let company = await Company.findById(req.company.id);

    res.send(company);
  } catch (err) {
    next(err);
  }
});

// pagination
companyRoute.get("/pagination", async (req, re, next) => {
  try {
    let company = await Company.find().sort({
      name: 1,
    });

    res.send(company);
  } catch (error) {
    next(err);
  }
});

companyRoute.get("/:id", authMiddleware, async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Azienda non trovata" });
    }
    res.status(200).json(company);
  } catch (err) {
    next(err);
  }
});
