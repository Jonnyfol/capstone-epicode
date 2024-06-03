import { Router } from "express";
import Post from "../models/post.models.js";
import avatarmulter from "../Middleware/multer.js";
import bcrypt from "bcryptjs";
import { authMiddleware } from "../auth/index.js";

// Creiamo un nuovo Router e esportiamolo per essere utilizzato altrove
export const postRoute = Router();

// Richiesta POST per creare un nuovo post
postRoute.post("/", async (req, res, next) => {
  try {
    // Creiamo un nuovo documento post, con i valori presi dal body della richiesta
    let post = await Post.create(req.body);
    // Mandiamo in risposta il post creato e uno status code di 201 (Created)
    res.status(201).send(post);
  } catch (err) {
    // In caso di errore, procediamo
    next(err);
  }
});

// Richiesta PUT all'indirizzo "/:id"
postRoute.put("/:id", async (req, res, next) => {
  try {
    // Cerchiamo un documento post dal suo id e modifichiamolo con i valori presi dal body della richiesta
    let post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // L'oggetto restituito deve essere quello aggiornato
    });
    res.send(post);
  } catch (err) {
    // In caso di errore, procediamo
    next(err);
  }
});

// Richiesta DELETE all'indirizzo "/:id"
postRoute.delete("/:id", async (req, res, next) => {
  try {
    // Cerchiamo un documento post usando una query specifica: deve avere l'id uguale a quello passato come parametro all'indirizzo
    await Post.deleteOne({
      _id: req.params.id,
    });
    // Mandiamo un messaggio in risposta ed uno status code di 204
    res.status(204).send("Il post è stato eliminato correttamente");
  } catch (err) {
    // In caso di errore, procediamo
    next(err);
  }
});

// Richiesta GET per ottenere tutti i post
postRoute.get("/", async (req, res, next) => {
  try {
    // Cerchiamo tutti i documenti post
    let posts = await Post.find();
    // Mandiamo in risposta i post trovati e uno status code di 200 (OK)
    res.status(200).send(posts);
  } catch (err) {
    // In caso di errore, procediamo
    next(err);
  }
});

// Richiesta PATCH all'indirizzo "/:id/cover"
postRoute.patch(
  "/:id/cover",
  avatarmulter.single("cover"),
  async (req, res, next) => {
    try {
      // Salvataggio dell'URL dell'immagine nel database
      let post = await Post.findByIdAndUpdate(
        req.params.id,
        { cover: req.file.path },
        {
          new: true, // L'oggetto restituito deve essere quello aggiornato
        }
      );
      res.send(post);
    } catch (err) {
      // In caso di errore, procediamo
      next(err);
    }
  }
);

// Richiesta GET per ottenere un singolo post con un determinato ID
postRoute.get("/:id", async (req, res, next) => {
  try {
    // Cerchiamo un singolo documento post usando l'ID passato come parametro nell'URL
    let post = await Post.findById(req.params.id);
    // Se non viene trovato il post, restituiamo uno status 404 (Not Found)
    if (!post) {
      return res.status(404).send("Post non trovato");
    }
    // Mandiamo in risposta il post trovato e uno status code di 200 (OK)
    res.status(200).send(post);
  } catch (err) {
    // In caso di errore, procediamo
    next(err);
  }
});

// Richiesta GET per ottenere tutti i commenti di uno specifico post
postRoute.get("/:id/comments", async (req, res, next) => {
  try {
    // Cerca il post per ID
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send("Post non trovato");
    }
    // Ritorna i commenti del post trovato
    res.status(200).send(post.comments);
  } catch (err) {
    next(err);
  }
});

// Richiesta GET per ottenere un commento specifico di un post specifico
postRoute.get("/:id/comments/:commentId", async (req, res, next) => {
  try {
    // Cerca il post per ID
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send("Post non trovato");
    }
    // Cerca il commento all'interno del post
    const comment = post.comments.find(
      (comment) => comment._id.toString() === req.params.commentId
    );
    if (!comment) {
      return res.status(404).send("Commento non trovato");
    }
    // Ritorna il commento trovato
    res.status(200).send(comment);
  } catch (err) {
    next(err);
  }
});

// Richiesta POST per aggiungere un nuovo commento ad un post specifico
postRoute.post("/:id/comments", async (req, res, next) => {
  try {
    // Cerca il post per ID
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send("Post non trovato");
    }
    // Aggiungi il nuovo commento al post
    post.comments.push(req.body);
    // Salva le modifiche al post
    await post.save();
    res.status(201).send(post);
  } catch (err) {
    next(err);
  }
});

// Richiesta PUT per modificare un commento di un post specifico
postRoute.put("/:id/comments/:commentId", async (req, res, next) => {
  try {
    // Cerca il post per ID
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send("Post non trovato");
    }
    // Cerca il commento all'interno del post
    const comment = post.comments.find(
      (comment) => comment._id.toString() === req.params.commentId
    );
    if (!comment) {
      return res.status(404).send("Commento non trovato");
    }
    // Modifica il commento
    Object.assign(comment, req.body);
    // Salva le modifiche al post
    await post.save();
    res.status(200).send(post);
  } catch (err) {
    next(err);
  }
});

// Richiesta DELETE per eliminare un commento specifico da un post specifico
postRoute.delete("/:id/comments/:commentId", async (req, res, next) => {
  try {
    // Cerca il post per ID
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send("Post non trovato");
    }
    // Trova l'indice del commento all'interno del post
    const index = post.comments.findIndex(
      (comment) => comment._id.toString() === req.params.commentId
    );
    if (index === -1) {
      return res.status(404).send("Commento non trovato");
    }
    // Elimina il commento dall'array dei commenti
    post.comments.splice(index, 1);
    // Salva le modifiche al post
    await post.save();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

postRoute.post("/", authMiddleware, async (req, res, next) => {
  try {
    let post = await Post.create({ ...req.body, author: req.user._id });
    const msg = {
      to: req.body.email, // Change to your recipient
      from: "...", // Change to your verified sender
      subject: "Grazie per aver postato ",
      html: `Hai postato un articolo "${req.body.title}".`,
    };
    await sgMail.send(msg);
    res.send(post);
  } catch (error) {
    next(error);
  }
});

// Richiesta GET per ottenere tutti gli annunci di un determinato autore
postRoute.get("/user-posts", authMiddleware, async (req, res, next) => {
  try {
    const username = req.user.username; // Assicurati che l'authMiddleware aggiunga il campo username a req.user
    let posts = await Post.find({ "company.name": username });
    res.status(200).send(posts);
  } catch (err) {
    next(err);
  }
});
