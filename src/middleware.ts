import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "./auth";

interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authMiddleware = (requiredRole: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "No token provided" });
      return;
    }
    try {
      const payload = verifyToken(token);
      if (requiredRole === "superadmin" && payload.role !== "superadmin") {
        res.status(403).json({ error: "Superadmin access required" });
        return;
      }
      if (
        requiredRole === "admin" &&
        !["admin", "superadmin"].includes(payload.role)
      ) {
        res.status(403).json({ error: "Admin access required" });
        return;
      }
      if (
        requiredRole === "user" &&
        !["user", "admin", "superadmin"].includes(payload.role)
      ) {
        res.status(403).json({ error: "User access required" });
        return;
      }
      req.user = payload;
      next();
    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }
  };
};
