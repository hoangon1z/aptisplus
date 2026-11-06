import { randomBytes, scrypt, timingSafeEqual, createHmac } from "node:crypto";
import { promisify } from "node:util";
const derive = promisify(scrypt);
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "./db";
export const cookieName =
  process.env.NODE_ENV === "production"
    ? "__Host-aptis-session"
    : "aptis-session";
function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32)
    throw new Error("AUTH_SECRET must contain at least32 characters");
  return new TextEncoder().encode(s);
}
export async function hashPassword(p: string) {
  const salt = randomBytes(16).toString("hex");
  return salt + ":" + ((await derive(p, salt, 64)) as Buffer).toString("hex");
}
export async function verifyPassword(p: string, h: string) {
  const [salt, hash] = h.split(":");
  const actual = (await derive(p, salt, 64)) as Buffer;
  return timingSafeEqual(actual, Buffer.from(hash, "hex"));
}
export function digest(s: string) {
  return createHmac("sha256", secret()).update(s).digest("hex");
}
export async function currentUser() {
  try {
    const token = (await cookies()).get(cookieName)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, secret(), {
      algorithms: ["HS256"],
      issuer: "aptisplus",
      audience: "aptisplus-web",
    });
    const r = await db.query(
      "SELECT u.id,u.name,u.email,u.role FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.id=$1 AND s.user_id=$2 AND s.revoked_at IS NULL AND s.expires_at>now()",
      [payload.jti, payload.sub],
    );
    return r.rows[0] ?? null;
  } catch {
    return null;
  }
}
export async function createSession(userId: string, ip: string, agent: string) {
  const id = randomBytes(24).toString("hex");
  await db.query(
    "INSERT INTO sessions(id,user_id,ip_hash,user_agent,expires_at) VALUES($1,$2,$3,$4,now()+interval '7 days')",
    [id, userId, digest(ip), agent.slice(0, 512)],
  );
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer("aptisplus")
    .setAudience("aptisplus-web")
    .setSubject(userId)
    .setJti(id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
  (await cookies()).set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 604800,
  });
}
export async function logout() {
  const jar = await cookies();
  const token = jar.get(cookieName)?.value;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret(), {
        issuer: "aptisplus",
        audience: "aptisplus-web",
      });
      await db.query("UPDATE sessions SET revoked_at=now() WHERE id=$1", [
        payload.jti,
      ]);
    } catch {}
  }
  jar.delete(cookieName);
}
