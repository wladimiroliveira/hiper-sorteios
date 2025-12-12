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
      <body className={`${roboto.className} antialiased`}>
        <div className="flex flex-col align-items justify-center max-w-[363px] m-auto pt-8 pb-8 pl-4 pr-4 gap-8">
          {children}
        </div>
      </body>
    </html>
  );
}
