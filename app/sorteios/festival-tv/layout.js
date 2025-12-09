import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata = {
  title: "Sorteio Hipersenna",
  description: "Em desenvolvimento",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <body className={`${roboto.className} antialiased`}>{children}</body>
    </html>
  );
}
