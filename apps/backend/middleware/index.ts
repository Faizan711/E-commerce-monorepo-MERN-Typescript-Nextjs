import jwt  from "jsonwebtoken";
import { secret } from "..";
import { Request, Response, NextFunction } from "express";

export const SECRET = secret!;
// console.log(SECRET);

export const authenticateJwt = (req:Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, SECRET, (err, payload) => {
        if (err) {
          return res.sendStatus(403);
        }
        if (!payload) {
          return res.sendStatus(403);
        }
        if (typeof payload === "string") {
          return res.sendStatus(403);
        }
        
        req.headers["Id"] = payload.id;
        next();
      });
    } else {
      res.sendStatus(401);
    };
};
