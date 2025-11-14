import "./globals.css";
import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Noisy by Nature",
  description: "Handcrafted Eurorack Cases for Sound Explorers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-body bg-noisy-cream text-noisy-black">
        {/* 🧩 Contenu de la page */}
        <main>{children}</main>

        {/* 🔌 Script universel MailerLite */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,e,u,f,l,n){
                w[f]=w[f]||function(){(w[f].q=w[f].q||[]).push(arguments)};
                l=d.createElement(e),l.async=1,l.src=u,
                n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);
              })(window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');
              ml('account', '1914173');
            `,
          }}
        />
      </body>
    </html>
  );
}
