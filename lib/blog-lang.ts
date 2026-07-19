export type BlogLang = "en" | "zh";

export const BLOG_LANG_STORAGE_KEY = "portfolio-blog-lang";
export const DEFAULT_BLOG_LANG: BlogLang = "en";

export type BilingualString = {
  en: string;
  zh: string;
};

/** Split `English · 中文` or `English | 中文` into parts. */
export function splitBilingualLabel(text: string): BilingualString | null {
  const match = text.match(/^(.+?)\s*[·|]\s*(.+)$/u);
  if (!match) return null;
  const en = match[1].trim();
  const zh = match[2].trim();
  if (!en || !zh) return null;
  return { en, zh };
}

/**
 * Split prose like `English sentence. 中文句子。`
 * Requires a terminal punctuation on the EN side, then CJK.
 */
export function splitBilingualProse(text: string): BilingualString | null {
  const match = text.match(
    /^([\s\S]*?[.!?…])\s+([\u3400-\u9fff\uF900-\uFAFF].+)$/u
  );
  if (!match) return null;
  const en = match[1].trim();
  const zh = match[2].trim();
  if (!en || !zh) return null;
  return { en, zh };
}

export function isBilingualString(value: unknown): value is BilingualString {
  return (
    typeof value === "object" &&
    value !== null &&
    "en" in value &&
    "zh" in value &&
    typeof (value as BilingualString).en === "string" &&
    typeof (value as BilingualString).zh === "string"
  );
}

/** Resolve a bilingual value for the active language. */
export function pickBilingual(
  value: unknown,
  lang: BlogLang
): string | null {
  if (value == null) return null;

  if (isBilingualString(value)) {
    const picked = value[lang]?.trim();
    if (picked) return picked;
    return (lang === "en" ? value.zh : value.en).trim() || null;
  }

  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const fromLabel = splitBilingualLabel(trimmed);
  if (fromLabel) return fromLabel[lang];

  const fromProse = splitBilingualProse(trimmed);
  if (fromProse) return fromProse[lang];

  return trimmed;
}

export function pickBilingualTitle(title: string, lang: BlogLang): string {
  return pickBilingual(title, lang) ?? title;
}
