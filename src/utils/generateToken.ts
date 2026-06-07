import "dotenv/config";
import jwt from "jsonwebtoken";

type JwtPayload = {
  userId: string;
  role: string;
};

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET nao definido no .env");
}

const jwtSecret: jwt.Secret = JWT_SECRET;

export function generateToken(payload: JwtPayload) {
  const expiresIn = (process.env.JWT_EXPIRES_IN || "7d") as NonNullable<jwt.SignOptions["expiresIn"]>;

  const options: jwt.SignOptions = {
    expiresIn,
  };

  return jwt.sign(payload, jwtSecret, options);
}

export function verifyToken(token: string) {
  return jwt.verify(token, jwtSecret) as unknown as JwtPayload;
}
