import { Router } from "express";
import User from "../models/users.models.js";
import { v2 as cloudinary } from "cloudinary";
import avatarmulter from "../Middleware/multer.js";
import bcrypt from "bcryptjs";
import { authMiddleware } from "../auth/index.js";
import passport from "passport";

// Creiamo un nuovo Router e esportiamolo per essere utilizzato altrove
export const userRoute = Router();

// Route per l'autenticazione con Google
// userRoute.get(
//   "/googleLogin",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );
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

// Richiesta POST
userRoute.post("/", async (req, res, next) => {
  try {
    let user = await User.create(req.body);
    res.status(201).send(user);
  } catch (err) {
    next(err);
  }
});

// Richiesta PUT
userRoute.put("/:id", async (req, res, next) => {
  try {
    let user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(user);
  } catch (err) {
    next(err);
  }
});

// Richiesta DELETE
userRoute.delete("/:id", async (req, res, next) => {
  try {
    await User.deleteOne({
      _id: req.params.id,
    });
    res.status(204).send("L'utente è stato eliminato correttamente");
  } catch (err) {
    next(err);
  }
});

// Richiesta GET
userRoute.get("/", async (req, res, next) => {
  try {
    let users = await User.find();
    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
});

// Richiesta PATCH
// userRoute.patch(
//   "/:id/avatar",
//   avatarmulter.single("avatar"),
//   async (req, res, next) => {
//     try {
//       const result = await cloudinary.uploader.upload(req.file.path);

//       let user = await User.findByIdAndUpdate(
//         req.params.id,
//         { avatar: result.secure_url },
//         { new: true }
//       );
//       res.send(user);
//     } catch (err) {
//       next(err);
//     }
//   }
// );

// funzionante altro codice
userRoute.patch(
  "/:id/avatar",
  authMiddleware,
  avatarmulter.single("avatar"),
  async (req, res, next) => {
    try {
      // Salvataggio dell'URL dell'immagine nel database
      let user = await User.findByIdAndUpdate(
        req.params.id,
        { avatar: req.file.path },
        {
          new: true, // L'oggetto restituito deve essere quello aggiornato
        }
      );
      res.send(user);
    } catch (err) {
      // In caso di errore, procediamo
      next(err);
    }
  }
);

// Richiesta GET per ottenere un singolo autore con un determinato ID
userRoute.get("/:id", async (req, res, next) => {
  try {
    // Cerchiamo un singolo autore usando l'ID passato come parametro nell'URL
    let user = await User.findById(req.params.id);
    // Se non viene trovato l'autore, restituiamo uno status 404 (Not Found)
    if (!user) {
      return res.status(404).send("Post non trovato");
    }
    // Mandiamo in risposta l'autore trovato e uno status code di 200 (OK)
    res.status(200).send(user);
  } catch (err) {
    // In caso di errore, procediamo
    next(err);
  }
});

// Endpoint in cui l'autenticazione è necessaria
userRoute.get("/profile", authMiddleware, async (req, res, next) => {
  // Utilizzando il middleware authMiddleware, l'oggetto  req avrà il parametro user popolato con i dati presi dal database
  try {
    let user = await User.findById(req.user.id);

    res.send(user);
  } catch (err) {
    next(err);
  }
});

// Richiesta GET per ottenere l'utente collegato al token d'accesso
userRoute.get("/me", authMiddleware, async (req, res, next) => {
  try {
    // Utilizzando il middleware authMiddleware, l'oggetto req avrà il parametro user popolato con i dati presi dal database
    let user = await User.findById(req.user.id);

    // Se l'utente non viene trovato, restituisci uno status 404 (Not Found)
    if (!user) {
      return res.status(404).send("Utente non trovato");
    }

    // Mandiamo in risposta l'utente trovato e uno status code di 200 (OK)
    res.status(200).send(user);
  } catch (err) {
    // In caso di errore, procediamo
    next(err);
  }
});
