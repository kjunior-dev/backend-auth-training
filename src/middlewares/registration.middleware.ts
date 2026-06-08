import { timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

function safeCompare(value: string, expected: string) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  return (
    valueBuffer.length === expectedBuffer.length &&
    timingSafeEqual(valueBuffer, expectedBuffer)
  );
}

function getRegistrationToken(req: Request) {
  const headerToken = req.header("x-registration-token");
  const authorization = req.header("authorization");

  if (headerToken) {
    return headerToken;
  }

  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice("Bearer ".length).trim();
  }

  return undefined;
}

export function registrationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const expectedToken = process.env.REGISTRATION_TOKEN;

  if (!expectedToken) {
    return res.status(500).json({
      message: "Registro indisponivel.",
    });
  }

  const token = getRegistrationToken(req);

  if (!token || !safeCompare(token, expectedToken)) {
    return res.status(401).json({
      message: "Token de registro invalido.",
    });
  }

  return next();
}
