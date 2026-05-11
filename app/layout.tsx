import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fintrack — Personal Finance Dashboard",
  description:
    "A premium personal finance dashboard to track expenses, set budgets, and gain spending insights.",
  keywords: ["finance", "expense tracker", "budget", "dashboard"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Preconnect for Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
