import type { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import type { AuthenticatedRequest } from "../types/authRequest.js";
import { verifyToken } from "../utils/generateToken.js";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies?.access_token;

    if (!token) {
      return res.status(401).json({
        message: "Nao autenticado.",
      });
    }

    const payload = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Sessao invalida.",
      });
    }

    (req as AuthenticatedRequest).user = user;

    return next();
  } catch {
    return res.status(401).json({
      message: "Token invalido ou expirado.",
    });
  }
}
