import type { Metadata } from "next";
import { DocumentEntryProvider } from "@/components/motion/document-entry";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/vietnamese-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/vietnamese-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/vietnamese-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/inter/vietnamese-700.css";
import "./globals.css";
import "./premium.css";
import "./shadcn-surfaces.css";
export const metadata: Metadata = {
  title: {
    default: "Aptis Studio — Luyện Aptis. Tự tin bước vào phòng thi.",
    template: "%s | Aptis Studio",
  },
  description:
    "Luyện thi Aptis ESOL General với giao diện mô phỏng Listening, Reading, Speaking và Writing. Làm quen thao tác, luyện tập có thời gian và theo dõi bài làm.",
  robots: { index: true, follow: true },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" data-scroll-behavior="smooth">
      <body>
        <DocumentEntryProvider>{children}</DocumentEntryProvider>
      </body>
    </html>
  );
}
