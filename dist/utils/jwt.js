import "dotenv/config";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET nao definido no .env");
}
const jwtSecret = JWT_SECRET;
export function generateToken(payload) {
    const expiresIn = (process.env.JWT_EXPIRES_IN || "7d");
    const options = {
        expiresIn,
    };
    return jwt.sign(payload, jwtSecret, options);
}
export function verifyToken(token) {
    return jwt.verify(token, jwtSecret);
}
//# sourceMappingURL=jwt.js.map