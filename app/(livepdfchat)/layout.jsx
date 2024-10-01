import { AuthContextProvider } from "@/lib/context/AuthContext";
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
      <html lang="en">
        <body>
          <section className={inter.className}>
            <div className="w-full h-screen">{children}</div>
          </section>
        </body>
      </html>
    </AuthContextProvider>
  );
}
