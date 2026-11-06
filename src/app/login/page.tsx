import { AuthForm } from "@/components/auth-form";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Đăng nhập",
  robots: { index: false, follow: false },
};
export default function Login() {
  return <AuthForm />;
}
