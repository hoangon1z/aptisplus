import { AuthForm } from "@/components/auth-form";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Đăng ký",
  robots: { index: false, follow: false },
};
export default function Register() {
  return <AuthForm register />;
}
