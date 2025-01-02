import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Inter_Tight } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { PacificoFont } from "@/app/fonts";
import { RouteIcon } from "@/components/ui/route";
import Link from "next/link";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Trail",
  description: "A simple, fast, and secure job application tracker",
};

const Inter = Inter_Tight({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${Inter.className} antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
              <nav className="shadow-xl sticky z-40 top-0 w-full mt-5 max-w-6xl flex justify-center border rounded-md border-foreground/10 h-12">
                <div className="flex items-center px-5 text-lg">
                  <span className={`${PacificoFont.className}`}>
                    <div className="grid grid-cols-2 gap-2 items-center">
                      <RouteIcon />
                    </div>
                  </span>
                </div>
                <div className="w-full flex justify-end items-center p-3 px-5 text-sm gap-4">
                  <HeaderAuth />
                  <ThemeSwitcher />
                </div>
              </nav>
            </div>
            <div className="">{children}</div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
