import "dotenv/config";
type JwtPayload = {
    userId: string;
    role: string;
};
export declare function generateToken(payload: JwtPayload): string;
export declare function verifyToken(token: string): JwtPayload;
export {};
//# sourceMappingURL=generateToken.d.ts.map