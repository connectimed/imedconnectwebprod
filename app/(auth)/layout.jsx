import { AuthContextProvider } from "@/lib/context/AuthContext";
import { LanguageProvider } from "@/lib/context/LanguageContext";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "IMED Connect",
  description: "Learn flawlessly.",
};

export default function RootLayout({ children }) {
  return (
    <AuthContextProvider>
      <LanguageProvider>
        <html lang="en" className={inter.className}>
          <body>
            <main className="h-screen">
              <div className="w-full h-full">{children}</div>
            </main>
          </body>
        </html>
      </LanguageProvider>
    </AuthContextProvider>
  );
}
