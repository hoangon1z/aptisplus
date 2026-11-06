"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
export default function AccountPage() {
  const [name, setName] = useState("Học viên");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(({ user }) => {
        setName(user?.name || "");
        setEmail(user?.email || "");
      });
  }, []);
  return (
    <>
      <div className="page-title">
        <div>
          <h1>Tài khoản của bạn</h1>
          <p>Một không gian riêng cho hành trình học tiếng Anh.</p>
        </div>
      </div>
      <div className="account-layout">
        <Card className="profile-summary">
          <Avatar>
            <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <h2>{name}</h2>
          <p>Học viên AptisPlus</p>
          <Badge variant="secondary">Tài khoản đã xác thực</Badge>
        </Card>
        <Card className="settings-panel">
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
            <CardDescription>Cập nhật tên hiển thị của bạn.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const r = await fetch("/api/auth/profile", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ name }),
                });
                setSaved(r.ok);
                if (r.ok)
                  window.dispatchEvent(new Event("aptis-profile-updated"));
              }}
            >
              <Label className="field-stack">
                Họ và tên
                <Input
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSaved(false);
                  }}
                />
              </Label>
              <Label className="field-stack">
                Email
                <Input
                  required
                  type="email"
                  readOnly
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setSaved(false);
                  }}
                />
              </Label>
              <Button type="submit">
                <Icon name="save" />
                Lưu thay đổi
              </Button>
              {saved && (
                <Alert role="status">
                  <Icon name="check_circle" />
                  <AlertDescription>
                    Đã lưu thông tin tài khoản.
                  </AlertDescription>
                </Alert>
              )}
            </form>
            <Separator className="my-7" />
            <h3>Đăng nhập & bảo mật</h3>
            <p>
              Phiên đăng nhập được xác thực bằng cookie bảo mật. Đổi mật khẩu và
              khôi phục qua email chưa được triển khai.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
