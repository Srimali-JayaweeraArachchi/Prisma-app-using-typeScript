import express, { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import {
  hashPassword,
  comparePassword,
  generateToken,
  JwtPayload,
} from "./auth";
import { authMiddleware } from "./middleware";

// Extend Express Request to include user property
interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
    [key: string]: any;
  };
}

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// Signup for User
app.post("/user/signup", async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "Email already exists" });
      return;
    }
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: "user" },
    });
    const token = generateToken({ id: user.id, role: user.role });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Signup for Admin
app.post(
  "/admin/signup",
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, role } = req.body;
    const validRoles = ["admin", "superadmin"];
    if (!validRoles.includes(role)) {
      res.status(400).json({ error: "Invalid role" });
      return;
    }
    try {
      const existingAdmin = await prisma.admin.findUnique({ where: { email } });
      if (existingAdmin) {
        res.status(400).json({ error: "Email already exists" });
        return;
      }
      const hashedPassword = await hashPassword(password);
      const admin = await prisma.admin.create({
        data: { name, email, password: hashedPassword, role },
      });
      const token = generateToken({ id: admin.id, role: admin.role });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Login for User/Admin
app.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password, type } = req.body;
  try {
    let user;
    if (type === "user") {
      user = await prisma.user.findUnique({ where: { email } });
    } else if (type === "admin") {
      user = await prisma.admin.findUnique({ where: { email } });
    } else {
      res.status(400).json({ error: "Invalid type" });
      return;
    }
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const token = generateToken({ id: user.id, role: user.role });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Protected Routes
app.get(
  "/user/protected",
  authMiddleware("user"),
  (req: AuthRequest, res: Response) => {
    res.json({ message: "User protected route", user: req.user });
  }
);

app.get(
  "/admin/protected",
  authMiddleware("admin"),
  (req: AuthRequest, res: Response): void => {
    res.json({ message: "Admin protected route", user: req.user });
  }
);

app.get(
  "/superadmin/protected",
  authMiddleware("superadmin"),
  (req: AuthRequest, res: Response): void => {
    res.json({ message: "Superadmin protected route", user: req.user });
  }
);

app.listen(3000, () => console.log("Server running on port 3000"));
