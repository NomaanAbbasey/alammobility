import type { Metadata } from "next";
import type { ReactNode } from "react";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alam Mobility",
  description: "Wheelchair-accessible rides to medical appointments.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en" className={GeistSans.variable}>
    <body><a className="skip-link" href="#main">Skip to content</a>{children}</body>
  </html>;
}
