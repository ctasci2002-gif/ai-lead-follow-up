import "./globals.css";

export const metadata = {
  title: "AI Lead Follow-Up",
  description: "AI-powered lead follow-up automation SaaS",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="tr"><body>{children}</body></html>;
}