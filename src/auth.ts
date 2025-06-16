import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { config } from "dotenv";

config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export interface JwtPayload {
  id: number;
  role: string;
}

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
