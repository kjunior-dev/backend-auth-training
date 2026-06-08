import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import type { AuthenticatedRequest } from "../types/authRequest.js";
import { generateToken } from "../utils/generateToken.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Nome, email e password sao obrigatorios.",
      });
    }

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return res.status(409).json({
        message: "Este email ja esta registado.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      success: 'Ok',
      message: "Utilizador criado com sucesso.",
      user,
    });
  } catch {
    return res.status(500).json({
      message: "Erro interno ao registar utilizador.",
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email e password sao obrigatorios.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        message: "Credenciais invalidas.",
      });
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({
        message: "Credenciais invalidas.",
      });
    }

    const token = generateToken({
      userId: user.id,
      role: user.role,
    });

    res.cookie("access_token", token, cookieOptions);

    return res.json({
      success: "Ok",
      message: "Login feito com sucesso.",
      accessToken: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    return res.status(500).json({
      message: "Erro interno ao fazer login.",
    });
  }
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie("access_token", cookieOptions);

  return res.json({
    message: "Logout feito com sucesso.",
  });
}

export async function me(req: Request, res: Response) {
  return res.json({
    user: (req as AuthenticatedRequest).user,
  });
}
