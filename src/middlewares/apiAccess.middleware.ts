import { timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/generateToken.js";

function safeCompare(value: string, expected: string) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  return (
    valueBuffer.length === expectedBuffer.length &&
    timingSafeEqual(valueBuffer, expectedBuffer)
  );
}

function getBearerToken(req: Request) {
  const authorization = req.header("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return undefined;
  }

  return authorization.slice("Bearer ".length).trim();
}

function hasValidApiToken(req: Request, expectedToken: string) {
  const apiToken = req.header("x-api-token");
  const bearerToken = getBearerToken(req);

  return (
    (!!apiToken && safeCompare(apiToken, expectedToken)) ||
    (!!bearerToken && safeCompare(bearerToken, expectedToken))
  );
}

function hasValidJwt(req: Request) {
  const bearerToken = getBearerToken(req);
  const cookieToken = req.cookies?.access_token;
  const token = bearerToken ?? cookieToken;

  if (!token) {
    return false;
  }

  try {
    verifyToken(token);
    return true;
  } catch {
    return false;
  }
}

export function apiAccessMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const expectedToken = process.env.API_ACCESS_TOKEN;

  if (!expectedToken) {
    return res.status(500).json({
      message: "API indisponivel.",
    });
  }

  if (hasValidApiToken(req, expectedToken) || hasValidJwt(req)) {
    return next();
  }

  return res.status(401).json({
    message: "Autorizacao obrigatoria.",
  });
}
