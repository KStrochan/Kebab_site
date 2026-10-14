import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { CartProvider } from "@/lib/cart";
import "./globals.css";

const heading = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin", "cyrillic"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Kebab Bro | Стрий",
  description:
    "Шаурма, хот-доги та бургери в Стрию. Замовляйте з доставкою або самовивозом.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uk" className={`${heading.variable} ${body.variable}`}>
      <body className="min-h-screen">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
