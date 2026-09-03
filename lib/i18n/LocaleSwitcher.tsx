"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "./DictionaryProvider";

const LOCALES = ["en", "tr", "de"] as const;
const LABELS: Record<string, string> = { en: "EN", tr: "TR", de: "DE" };

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: string) {
    if (next === locale) return;

    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=${60 * 60 * 24 * 365}`;

    const rest = pathname.replace(new RegExp(`^/${locale}`), "") || "";
    router.push(`/${next}${rest}`);
    router.refresh();
  }

  return (
    <div className="locale-switcher">
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          className={l === locale ? "locale-switcher-btn active" : "locale-switcher-btn"}
          onClick={() => switchTo(l)}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  );
}
