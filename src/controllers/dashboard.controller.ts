import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../types/authRequest.js";

export async function getDashboard(req: Request, res: Response) {
  return res.json({
    message: "Bem-vindo ao dashboard protegido.",
    user: (req as AuthenticatedRequest).user,
    stats: {
      totalUsers: 1,
      totalOrders: 0,
      notifications: 3,
    },
  });
}
