import type { Metadata } from "next";

import "../globals.css";
import Script from "next/script";


export const metadata: Metadata = {
  title: "Pixi Live2D Demo",
  description: "Pixi Live2D Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
