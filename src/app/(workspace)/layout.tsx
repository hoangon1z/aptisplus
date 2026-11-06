import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
export const metadata: Metadata = { robots: { index: false, follow: false } };
import { currentUser } from "@/lib/server/auth";
import { redirect } from "next/navigation";
export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await currentUser())) redirect("/login");
  return <AppShell>{children}</AppShell>;
}
