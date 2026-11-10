import jwt, { type JwtPayload } from "jsonwebtoken";
import type { Session } from "@/types";

let warnedMissingSecret = false;

function accessSecret(): string | null {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    if (!warnedMissingSecret) {
      warnedMissingSecret = true;
      console.warn(
        "[auth] JWT_ACCESS_SECRET is not set: every request is treated as signed out.",
      );
    }
    return null;
  }

  return secret;
}

/** Verifies an API-signed access token and returns its claims, or null. */
export function verifyAccessToken(token?: string): Session | null {
  const secret = accessSecret();

  if (!token || !secret) return null;

  try {
    const payload = jwt.verify(token, secret) as JwtPayload;

    if (!payload.email || !payload.role) return null;

    return {
      id: String(payload.id ?? ""),
      profileId: payload.profileId as string | undefined,
      email: payload.email as string,
      role: payload.role as Session["role"],
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}
