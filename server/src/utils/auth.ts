import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT_SECRET!;
const expiration = "2h";

export function signToken(user: { _id: string; username: string }) {
  return jwt.sign({ data: user }, secret, { expiresIn: expiration });
}

export function authMiddleware({ req }: any) {
  let token = req.headers.authorization || "";

  if (token.startsWith("Bearer ")) {
    token = token.slice(7).trim();
  }

  if (!token) {
    return { user: null };
  }

  try {
    const { data } = jwt.verify(token, secret) as any;
    req.user = data;
  } catch {
    console.warn("Invalid token");
    req.user = null;
  }

  return { user: req.user };
}
