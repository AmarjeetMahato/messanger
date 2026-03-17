import { Request, Response, NextFunction } from "express";

export const requireRole = (requiredRole: string) => {
  return (req:Request, res:Response, next:NextFunction) => {
    const user = req?.user; // set in auth middleware
       if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.user.roles ||!req.user.roles.includes(requiredRole)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};