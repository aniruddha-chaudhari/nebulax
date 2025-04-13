import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  variable: "--font-press-start-2p",
  weight: "400",
  subsets: ["latin"],
});

const vt323 = VT323({
  variable: "--font-vt323",
  weight: "400",
  subsets: ["latin"],
});

export const metadata = {
  title: "Pixel Palace Quest",
  description: "An 8-bit arcade adventure game",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${pressStart2P.variable} ${vt323.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
