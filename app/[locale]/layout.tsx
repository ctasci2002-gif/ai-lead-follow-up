import "../globals.css";
import { getDictionary } from "../../lib/i18n/get-dictionary";
import { DictionaryProvider } from "../../lib/i18n/DictionaryProvider";

export const metadata = {
  title: "Zappivot",
  description: "AI-powered prospecting and outreach for agencies",
};

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "tr" }, { locale: "de" }];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return (
    <html lang={locale}>
      <body>
        <DictionaryProvider dict={dict} locale={locale}>
          {children}
        </DictionaryProvider>
      </body>
    </html>
  );
}
