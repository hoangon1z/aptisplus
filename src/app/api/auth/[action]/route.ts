import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/server/db";
import {
  createSession,
  currentUser,
  hashPassword,
  verifyPassword,
  logout,
  digest,
} from "@/lib/server/auth";
export const runtime = "nodejs";
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ action: string }> },
) {
  const { action } = await params;
  if (action !== "me")
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  const user = await currentUser();
  return NextResponse.json(
    { user },
    { status: user ? 200 : 401, headers: { "Cache-Control": "no-store" } },
  );
}
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ action: string }> },
) {
  const { action } = await params;
  if (
    !process.env.APP_ORIGIN ||
    req.headers.get("origin") !== process.env.APP_ORIGIN
  )
    return NextResponse.json(
      { error: "Yêu cầu không hợp lệ." },
      { status: 403 },
    );
  const ip =
    process.env.TRUST_PROXY === "true"
      ? (req.headers.get("x-real-ip") ?? "unknown")
      : "direct";
  try {
    if (action === "logout") {
      await logout();
      return NextResponse.json({ ok: true });
    }
    if (!["login", "register", "profile"].includes(action))
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    const raw = await req.text();
    if (raw.length > 4096)
      return NextResponse.json({ error: "Dữ liệu quá lớn." }, { status: 413 });
    const body = JSON.parse(raw);
    if (action === "profile") {
      const user = await currentUser();
      if (!user)
        return NextResponse.json(
          { error: "Vui lòng đăng nhập." },
          { status: 401 },
        );
      const data = z
        .object({ name: z.string().trim().min(2).max(100) })
        .parse(body);
      await db.query("UPDATE users SET name=$1 WHERE id=$2", [
        data.name,
        user.id,
      ]);
      return NextResponse.json({ ok: true });
    }
    const data = z
      .object({
        email: z
          .string()
          .trim()
          .email()
          .max(254)
          .transform((v) => v.toLowerCase()),
        password: z.string().min(12).max(128),
        name: z.string().trim().min(2).max(100).optional(),
      })
      .parse(body);
    for (const key of [digest("ip:" + ip), digest("email:" + data.email)]) {
      const limit = await db.query(
        "INSERT INTO auth_limits(key,hits,window_start) VALUES($1,1,now()) ON CONFLICT(key) DO UPDATE SET hits=CASE WHEN auth_limits.window_start<now()-interval '15 minutes' THEN 1 ELSE auth_limits.hits+1 END,window_start=CASE WHEN auth_limits.window_start<now()-interval '15 minutes' THEN now() ELSE auth_limits.window_start END RETURNING hits",
        [key],
      );
      if (limit.rows[0].hits > 20)
        return NextResponse.json(
          { error: "Quá nhiều yêu cầu. Vui lòng thử lại sau 15 phút." },
          { status: 429, headers: { "Retry-After": "900" } },
        );
    }
    await db.query(
      "INSERT INTO auth_events(ip_hash,email_hash,event) VALUES($1,$2,$3)",
      [digest(ip), digest(data.email), action],
    );
    let user;
    if (action === "register") {
      if (!data.name)
        return NextResponse.json(
          { error: "Vui lòng nhập họ tên." },
          { status: 400 },
        );
      const r = await db.query(
        "INSERT INTO users(email,name,password_hash) VALUES($1,$2,$3) ON CONFLICT(email) DO NOTHING RETURNING id",
        [data.email, data.name, await hashPassword(data.password)],
      );
      user = r.rows[0];
      if (!user)
        return NextResponse.json(
          { error: "Không thể tạo tài khoản với thông tin này." },
          { status: 400 },
        );
    } else {
      const r = await db.query(
        "SELECT id,password_hash FROM users WHERE email=$1",
        [data.email],
      );
      user = r.rows[0];
      const valid = await verifyPassword(
        data.password,
        user?.password_hash ??
          (await hashPassword("dummy-password-for-timing")),
      );
      if (!user || !valid)
        return NextResponse.json(
          { error: "Email hoặc mật khẩu không đúng." },
          { status: 401 },
        );
    }
    await createSession(user.id, ip, req.headers.get("user-agent") ?? "");
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError || error instanceof SyntaxError)
      return NextResponse.json(
        { error: "Kiểm tra thông tin. Mật khẩu cần12–128 ký tự." },
        { status: 400 },
      );
    console.error("Auth request failed");
    return NextResponse.json(
      { error: "Không thể xử lý lúc này. Vui lòng thử lại." },
      { status: 503 },
    );
  }
}
