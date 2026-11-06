"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceBrand } from "./workspace-brand";
import { Icon } from "./icon";
import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
export function AuthForm({ register = false }: { register?: boolean }) {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => {
      router.replace("/practice");
      router.refresh();
    }, 1000);
    return () => clearTimeout(timer);
  }, [success, router]);
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [reset, setReset] = useState(false);
  const [error, setError] = useState("");
  return (
    <main className="auth-page public-auth">
      <div className="auth-left">
        <WorkspaceBrand />
        <div className="auth-form-wrap">
          <Link href="/" className="back-link">
            <Icon name="arrow_back" />
            Về trang chủ
          </Link>
          <h1>
            {reset
              ? "Quên mật khẩu?"
              : register
                ? "Hành trình mới,\nbắt đầu từ đây."
                : "Chào bạn,\nrất vui được gặp lại."}
          </h1>
          <p>
            {reset
              ? "Tính năng khôi phục sẽ được kết nối khi có backend."
              : register
                ? "Tạo hồ sơ để bắt đầu luyện thi theo cách của bạn."
                : "Đăng nhập để tiếp tục hành trình luyện Aptis."}
          </p>
          <form
            aria-busy={busy}
            onSubmit={async (e) => {
              e.preventDefault();
              if (busy || success) return;
              setError("");
              const data = new FormData(e.currentTarget);
              if (register && data.get("password") !== data.get("confirm")) {
                setError("Mật khẩu xác nhận chưa khớp.");
                return;
              }
              setBusy(true);
              try {
                const response = await fetch(
                  `/api/auth/${register ? "register" : "login"}`,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(Object.fromEntries(data)),
                  },
                );
                const result = await response.json();
                if (!response.ok) throw new Error(result.error);
                setSuccess(true);
              } catch (err) {
                setError(
                  err instanceof Error ? err.message : "Không thể kết nối.",
                );
                setBusy(false);
              }
            }}
          >
            {register && (
              <Label>
                Họ và tên
                <Input
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="Tên của bạn"
                />
              </Label>
            )}
            <Label>
              Email
              <Input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="ban@example.com"
              />
            </Label>
            {!reset && (
              <>
                <Label>
                  Mật khẩu
                  <div className="password-field">
                    <Input
                      name="password"
                      type={show ? "text" : "password"}
                      minLength={12}
                      required
                      autoComplete={
                        register ? "new-password" : "current-password"
                      }
                      placeholder="Ít nhất 12 ký tự"
                    />
                    <button
                      type="button"
                      onClick={() => setShow(!show)}
                      aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      <Icon name={show ? "visibility_off" : "visibility"} />
                    </button>
                  </div>
                </Label>
                {register ? (
                  <Label>
                    Xác nhận mật khẩu
                    <Input
                      name="confirm"
                      type={show ? "text" : "password"}
                      minLength={12}
                      required
                      autoComplete="new-password"
                      placeholder="Nhập lại mật khẩu"
                    />
                  </Label>
                ) : (
                  <button
                    type="button"
                    className="forgot-link"
                    disabled
                    title="Khôi phục mật khẩu chưa được triển khai"
                  >
                    Quên mật khẩu?
                  </button>
                )}
              </>
            )}
            {busy && (
              <Alert status={success ? "success" : "accent"} role="status">
                <AlertTitle>
                  {success
                    ? register
                      ? "Đăng ký thành công"
                      : "Đăng nhập thành công"
                    : register
                      ? "Đang tạo tài khoản"
                      : "Đang xác thực tài khoản"}
                </AlertTitle>
                <AlertDescription>
                  <span className="auth-progress">
                    <LoaderCircle
                      size={18}
                      className="auth-spinner"
                      aria-hidden="true"
                    />
                    {success
                      ? "Đang chuyển đến không gian luyện tập…"
                      : "Vui lòng chờ trong giây lát…"}
                  </span>
                </AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {reset ? (
              <Button type="button" onClick={() => setReset(false)}>
                Trở lại đăng nhập
              </Button>
            ) : (
              <Button disabled={busy} type="submit">
                {busy
                  ? success
                    ? "Đang chuyển trang…"
                    : "Đang xác thực…"
                  : register
                    ? "Đăng ký"
                    : "Đăng nhập"}
                {busy ? (
                  <LoaderCircle
                    size={18}
                    className="auth-spinner"
                    aria-hidden="true"
                  />
                ) : (
                  <Icon name="arrow_forward" />
                )}
              </Button>
            )}
          </form>
          <p className="auth-switch">
            {register ? "Đã có tài khoản?" : "Chưa có tài khoản?"}{" "}
            <Link href={register ? "/login" : "/register"}>
              {register ? "Đăng nhập" : "Đăng ký"}
            </Link>
          </p>
        </div>
        <small className="auth-copyright">
          © AptisPlus · Learn at your own pace.
        </small>
      </div>
      <div className="auth-right">
        <span>A LITTLE PRACTICE, EVERY DAY.</span>
        <Image
          sizes="(max-width: 800px) 100vw, 50vw"
          src="/assets/indigo-ribbon.png"
          alt=""
          width="1536"
          height="1024"
        />
        <div>
          <h2>
            Không chỉ sẵn sàng.
            <br />
            <em>Mà còn tự tin.</em>
          </h2>
          <p>Không gian riêng cho hành trình Aptis của bạn.</p>
        </div>
      </div>
    </main>
  );
}
