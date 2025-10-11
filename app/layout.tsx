import type { Metadata } from "next";
import './styles/font.css'
import "./globals.css";
import ClientWrapper from "./ClientWrapper";

export const metadata: Metadata = {
  title: "FeelFrameStudio",
  description: "Generate stunning video products for your business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={`font-clash`}>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
