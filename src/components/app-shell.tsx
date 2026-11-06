"use client";
import Link from "next/link";
import styles from "./profile-menu.module.css";
import {
  UserRound,
  History,
  LogOut,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";
import Image from "next/image";
import { Sidebar, DesktopSidebar, SidebarLink } from "./ui/sidebar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./icon";
import { WorkspaceBrand } from "./workspace-brand";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "./ui/sheet";
import { TooltipProvider } from "./ui/tooltip";
import { Separator } from "./ui/separator";
const links = [
  ["/dashboard", "space_dashboard", "Trang chủ"],
  ["/practice", "auto_stories", "Luyện tập"],
  ["/practice#exam-library", "description", "Phòng thi mô phỏng"],
  ["/dashboard#learning-overview", "chart", "Theo dõi tiến độ"],
  ["/results", "history", "Lịch sử bài thi"],
  ["/admin", "edit_square", "Quản lý đề"],
];
export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [logoutError, setLogoutError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [name, setName] = useState("Học viên");
  useEffect(() => {
    const update = () => {
      fetch("/api/auth/me", { cache: "no-store" })
        .then((r) => r.json())
        .then((data) => {
          setName(data.user?.name || "Học viên");
          setEmail(data.user?.email || "");
        })
        .catch(() => {});
    };
    update();
    window.addEventListener("aptis-profile-updated", update);
    return () => window.removeEventListener("aptis-profile-updated", update);
  }, [path]);
  const current = path.startsWith("/results/")
    ? "Chi tiết bài làm"
    : links.find((l) => l[0] === path)?.[2] || "Tài khoản";
  function navigation() {
    return (
      <nav aria-label="Điều hướng học tập">
        {links.map(([href, icon, label]) => (
          <Link
            href={href}
            key={href}
            onClick={() => setOpen(false)}
            aria-current={path === href ? "page" : undefined}
            className={path === href ? "active" : ""}
          >
            <Icon name={icon} />
            {label}
          </Link>
        ))}
      </nav>
    );
  }
  function userMenu() {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={`profile-menu-trigger ${styles.trigger}`}
            aria-label="Menu tài khoản"
          >
            <Avatar>
              <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className={styles.triggerName}>{name}</span>
            <ChevronDown size={14} className={styles.chevron} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={styles.menu}
          align="end"
          sideOffset={10}
          collisionPadding={12}
        >
          <DropdownMenuLabel className={styles.identity}>
            <Avatar className={styles.avatar}>
              <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <strong>{name}</strong>
              <span>{email}</span>
              <small>Tài khoản AptisPlus</small>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className={styles.separator} />
          <div className={styles.group}>
            <DropdownMenuItem asChild className={styles.item}>
              <Link href="/account">
                <UserRound size={18} />
                <span>
                  Thông tin tài khoản<small>Hồ sơ và bảo mật</small>
                </span>
                <ArrowUpRight size={14} />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className={styles.item}>
              <Link href="/results">
                <History size={18} />
                <span>
                  Lịch sử bài thi<small>Xem lại các lần luyện tập</small>
                </span>
                <ArrowUpRight size={14} />
              </Link>
            </DropdownMenuItem>
          </div>
          <DropdownMenuSeparator className={styles.separator} />
          <DropdownMenuItem
            disabled={loggingOut}
            className={`${styles.item} ${styles.logout}`}
            onSelect={async (e) => {
              e.preventDefault();
              setLoggingOut(true);
              setLogoutError("");
              try {
                const r = await fetch("/api/auth/logout", { method: "POST" });
                if (!r.ok) throw new Error();
                window.location.assign("/login");
              } catch {
                setLoggingOut(false);
                setLogoutError("Chưa thể đăng xuất. Vui lòng thử lại.");
              }
            }}
          >
            <LogOut size={18} />
            <span>{loggingOut ? "Đang đăng xuất…" : "Đăng xuất"}</span>
          </DropdownMenuItem>
          {logoutError && (
            <p role="alert" className={styles.error}>
              {logoutError}
            </p>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  return (
    <TooltipProvider>
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
        <div
          className={`app-shell premium-workspace workspace-ui workspace-aceternity ${path === "/dashboard" ? "workspace-dashboard" : ""}`}
        >
          <DesktopSidebar
            className="workspace-aceternity-sidebar sticky top-0 h-dvh justify-between gap-8 overflow-hidden bg-neutral-100"
            role="complementary"
            aria-label="Thanh điều hướng"
          >
            <div className="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
              <Link
                href="/"
                aria-label="AptisPlus — Trang chủ"
                className="flex h-9 shrink-0 items-center gap-3 whitespace-nowrap"
              >
                <Image
                  src="/brand/aptisplus-symbol.svg"
                  alt=""
                  width={28}
                  height={28}
                  className="shrink-0"
                />
                {sidebarOpen && (
                  <span className="text-lg font-semibold text-neutral-900">
                    Aptis<span className="text-[#5055d8]">Plus</span>
                  </span>
                )}
              </Link>
              <nav
                aria-label="Điều hướng học tập"
                className="mt-8 flex flex-col gap-2"
              >
                {links.map(([href, icon, label]) => (
                  <SidebarLink
                    key={href}
                    link={{
                      href,
                      label,
                      icon: (
                        <Icon
                          name={icon}
                          className="h-5 w-5 shrink-0 text-neutral-700"
                        />
                      ),
                    }}
                    aria-current={
                      path === href ||
                      (href === "/results" && path.startsWith("/results/"))
                        ? "page"
                        : undefined
                    }
                    className={
                      path === href ||
                      (href === "/results" && path.startsWith("/results/"))
                        ? "rounded-md bg-[#e9e9f9] text-[#454abf]"
                        : "rounded-md"
                    }
                  />
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-2 pt-8">
                <SidebarLink
                  link={{
                    href: "/account",
                    label: "Cài đặt tài khoản",
                    icon: (
                      <Icon
                        name="settings"
                        className="h-5 w-5 shrink-0 text-neutral-700"
                      />
                    ),
                  }}
                  aria-current={path === "/account" ? "page" : undefined}
                />
                <SidebarLink
                  link={{
                    href: "/#faq",
                    label: "Trợ giúp",
                    icon: (
                      <Icon
                        name="help"
                        className="h-5 w-5 shrink-0 text-neutral-700"
                      />
                    ),
                  }}
                />
              </div>
            </div>
          </DesktopSidebar>
          <div className="app-main">
            <header className="app-topbar">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    className="icon-button mobile-menu"
                    aria-label="Mở điều hướng"
                  >
                    <Icon name="menu" />
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="workspace-mobile-nav workspace-aceternity-mobile"
                >
                  <SheetHeader className="sr-only">
                    <SheetTitle>Điều hướng học tập</SheetTitle>
                    <SheetDescription>
                      Chọn trang trong không gian học tập AptisPlus.
                    </SheetDescription>
                  </SheetHeader>
                  <WorkspaceBrand />
                  {navigation()}
                  <Separator />
                  <Link href="/account" onClick={() => setOpen(false)}>
                    Cài đặt tài khoản
                  </Link>
                  <Link href="/#faq" onClick={() => setOpen(false)}>
                    Trợ giúp
                  </Link>
                </SheetContent>
              </Sheet>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/dashboard">Không gian học tập</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{current}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <div className="topbar-right">{userMenu()}</div>
            </header>
            <main className="app-content">{children}</main>
          </div>
        </div>
      </Sidebar>
    </TooltipProvider>
  );
}
