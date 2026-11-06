"use client";
import * as React from "react";
import { Alert as HeroAlert } from "@heroui/react";
import { Info, CircleCheck, TriangleAlert, CircleX } from "lucide-react";
import { cn } from "cn";
import styles from "./alert.module.css";
type Status = "default" | "accent" | "success" | "warning" | "danger";
function Alert({
  className,
  variant,
  status,
  children,
  role,
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "default" | "destructive";
  status?: Status;
}) {
  const tone =
    status ??
    (variant === "destructive"
      ? "danger"
      : role === "status"
        ? "success"
        : "default");
  const Indicator =
    tone === "danger"
      ? CircleX
      : tone === "warning"
        ? TriangleAlert
        : tone === "success"
          ? CircleCheck
          : Info;
  const content = React.Children.toArray(children).filter(
    (child) =>
      !React.isValidElement(child) ||
      typeof child.type !== "function" ||
      !(child.type as { displayName?: string }).displayName?.includes("Icon"),
  );
  return (
    <HeroAlert
      status={tone}
      data-tone={tone}
      role={
        role ?? (tone === "danger" || tone === "warning" ? "alert" : "status")
      }
      className={cn(styles.root, className)}
      {...props}
    >
      <HeroAlert.Indicator className={styles.indicator}>
        <Indicator size={18} aria-hidden="true" />
      </HeroAlert.Indicator>
      <HeroAlert.Content className={styles.content}>
        {content}
      </HeroAlert.Content>
    </HeroAlert>
  );
}
function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <HeroAlert.Title
      render={(domProps) => (
        <div {...(domProps as React.HTMLAttributes<HTMLDivElement>)} />
      )}
      className={cn(styles.title, className)}
      {...props}
    />
  );
}
function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <HeroAlert.Description
      render={(domProps) => (
        <div {...(domProps as React.HTMLAttributes<HTMLDivElement>)} />
      )}
      className={cn(styles.description, className)}
      {...props}
    />
  );
}
export { Alert, AlertTitle, AlertDescription };
