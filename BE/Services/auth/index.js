import jwt from "jsonwebtoken";
import User from "../models/users.models.js";
import Company from "../models/company.models.js";

export const generateJWT = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,

      process.env.JWT_SECRET,

      { expiresIn: "1d" },

      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};

export const verifyJWT = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,

      process.env.JWT_SECRET,

      (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      }
    );
  });
};

// export const authMiddleware = async (req, res, next) => {
//   try {
//     if (!req.headers.authorization) {
//       res.status(400).send("Effettua il login");
//     } else {
//       const decoded = await verifyJWT(
//         req.headers.authorization.replace("Bearer ", "")
//       );

//       if (decoded.exp) {
//         delete decoded.iat;
//         delete decoded.exp;

//         const me = await User.findOne({
//           ...decoded,
//         });

//         if (me) {
//           req.user = me;
//           next();
//         } else {
//           res.status(401).send("Utente non trovato");
//         }
//       } else {
//         res.status(401).send("Rieffettua il login");
//       }
//     }
//   } catch (err) {
//     next(err);
//   }
// };

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      const company = await Company.findById(decoded.id);
      req.user = user || company;
      next();
    } catch (error) {
      res.status(401).json({ message: "Autenticazione fallita" });
    }
  } else {
    res.status(401).json({ message: "Token mancante" });
  }
};
export { authMiddleware };
