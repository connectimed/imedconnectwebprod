import { AuthContextProvider } from "@/lib/context/AuthContext";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "IMED Connect",
  description: "Learn flawlessly remotely.",
};

export default function RootLayout({ children }) {
  return (
    <AuthContextProvider>
      <html lang="en" className={inter.className}>
        <body>
          <main className="h-screen">
            <div className="w-full h-full">{children}</div>
          </main>
        </body>
      </html>
    </AuthContextProvider>
  );
}
