import type { Role } from "@prisma/client";
import type { Request } from "express";

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type AuthenticatedRequest = Request & {
  user?: AuthenticatedUser;
};
