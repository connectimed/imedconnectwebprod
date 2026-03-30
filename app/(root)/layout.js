import "../globals.css";
import { Roboto } from "next/font/google";
import Topbar from "@/components/shared/Topbar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";
import Bottombar from "@/components/shared/Bottombar";
import { AuthContextProvider } from "@/lib/context/AuthContext";
import { LanguageProvider } from "@/lib/context/LanguageContext";

const roboto = Roboto({ weight: "400", subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "IMED Connect",
  description: "Learn flawlessly",
};

export default function RootLayout({ children }) {
  return (
    <AuthContextProvider>
      <LanguageProvider>
        <html lang="en" className={roboto.className}>
          <body>
            <Topbar />
            <main className="flex flex-row">
              <LeftSidebar />

              <section className="main-container">
                <div className="w-full max-w-4xl h-full">{children}</div>
              </section>
            </main>
            {/* <Bottombar /> */}
          </body>
        </html>
      </LanguageProvider>
    </AuthContextProvider>
  );
}
