"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const auth_1 = require("./auth");
const middleware_1 = require("./middleware");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Signup for User
app.post("/user/signup", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ error: "Email already exists" });
            return;
        }
        const hashedPassword = await (0, auth_1.hashPassword)(password);
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword, role: "user" },
        });
        const token = (0, auth_1.generateToken)({ id: user.id, role: user.role });
        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});
// Signup for Admin
app.post("/admin/signup", async (req, res) => {
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
        const hashedPassword = await (0, auth_1.hashPassword)(password);
        const admin = await prisma.admin.create({
            data: { name, email, password: hashedPassword, role },
        });
        const token = (0, auth_1.generateToken)({ id: admin.id, role: admin.role });
        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});
// Login for User/Admin
app.post("/login", async (req, res) => {
    const { email, password, type } = req.body;
    try {
        let user;
        if (type === "user") {
            user = await prisma.user.findUnique({ where: { email } });
        }
        else if (type === "admin") {
            user = await prisma.admin.findUnique({ where: { email } });
        }
        else {
            res.status(400).json({ error: "Invalid type" });
            return;
        }
        if (!user) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        const isValid = await (0, auth_1.comparePassword)(password, user.password);
        if (!isValid) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        const token = (0, auth_1.generateToken)({ id: user.id, role: user.role });
        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});
// Protected Routes
app.get("/user/protected", (0, middleware_1.authMiddleware)("user"), (req, res) => {
    res.json({ message: "User protected route", user: req.user });
});
app.get("/admin/protected", (0, middleware_1.authMiddleware)("admin"), (req, res) => {
    res.json({ message: "Admin protected route", user: req.user });
});
app.get("/superadmin/protected", (0, middleware_1.authMiddleware)("superadmin"), (req, res) => {
    res.json({ message: "Superadmin protected route", user: req.user });
});
app.listen(3000, () => console.log("Server running on port 3000"));
