import type { Dictionary } from "./types";
import en from "./dictionaries/en";
import tr from "./dictionaries/tr";
import de from "./dictionaries/de";

const dictionaries: Record<string, Dictionary> = { en, tr, de };

export function getDictionary(locale: string): Dictionary {
  return dictionaries[locale] || dictionaries.en;
}
