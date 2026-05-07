import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret";
const COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? "moov_session";

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signJwt(payload: object, expiresIn = "7d") {
  const secret = JWT_SECRET as string;
  // use any to avoid strict types from jsonwebtoken declarations in this wrapper
  return (jwt as any).sign(payload, secret, { expiresIn });
}

export function verifyJwt<T = any>(token: string): T | null {
  try {
    const secret = JWT_SECRET as string;
    return (jwt as any).verify(token, secret) as T;
  } catch (e) {
    return null;
  }
}

export function cookieHeaderForToken(token: string, maxAge = 60 * 60 * 24 * 7) {
  const secure = process.env.NODE_ENV === "production";
  const sameSite = "lax";
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=${sameSite}; Max-Age=${maxAge}${secure ? "; Secure" : ""}`;
}
