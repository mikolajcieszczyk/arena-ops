import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/i18n/I18nProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Arena Ops - System zarządzania kortami tenisowymi",
  description:
    "Profesjonalny system zarządzania rezerwacjami, klientami i kortami tenisowymi",
  keywords: [
    "arena",
    "rezerwacje",
    "korty",
    "sport",
    "zarządzanie",
    "tenis",
    "tennis",
    "tennis court",
    "tennis court reservation",
    "tennis court reservation system",
    "tennis court reservation system",
    "tennis court reservation system",
  ],
  authors: [{ name: "Mikołaj Cięszczyk" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${inter.variable} font-sans antialiased`}>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
