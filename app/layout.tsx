import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "witness",
  description: "a small witness practice. for the climb.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="shell">{children}</div>
        <footer>
          <span>you plant · i grow · she tends 🪸</span>
        </footer>
      </body>
    </html>
  );
}
