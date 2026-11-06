"use client";

import { MotionConfig } from "motion/react";
import SidebarDemo from "@/components/sidebar-demo";

export default function SidebarDemoPage() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="min-h-screen bg-white p-4 md:p-10 [&_.animate-pulse]:motion-reduce:animate-none">
        <SidebarDemo />
      </main>
    </MotionConfig>
  );
}
