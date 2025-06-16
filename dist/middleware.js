"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const auth_1 = require("./auth");
const authMiddleware = (requiredRole) => {
    return (req, res, next) => {
        var _a;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            res.status(401).json({ error: "No token provided" });
            return;
        }
        try {
            const payload = (0, auth_1.verifyToken)(token);
            if (requiredRole === "superadmin" && payload.role !== "superadmin") {
                res.status(403).json({ error: "Superadmin access required" });
                return;
            }
            if (requiredRole === "admin" &&
                !["admin", "superadmin"].includes(payload.role)) {
                res.status(403).json({ error: "Admin access required" });
                return;
            }
            if (requiredRole === "user" &&
                !["user", "admin", "superadmin"].includes(payload.role)) {
                res.status(403).json({ error: "User access required" });
                return;
            }
            req.user = payload;
            next();
        }
        catch (error) {
            res.status(401).json({ error: "Invalid token" });
            return;
        }
    };
};
exports.authMiddleware = authMiddleware;
