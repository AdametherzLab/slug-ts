import type { TransliterationMap } from "./types";

/**
 * Built-in transliteration map covering Latin extended, Greek, Cyrillic, and common symbols.
 */
export const TRANSLITERATION_MAP = {
  // Latin Extended
  "à": "a", "á": "a", "â": "a", "ã": "a", "ä": "a", "å": "a", "ā": "a", "ą": "a", "ă": "a",
  "è": "e", "é": "e", "ê": "e", "ë": "e", "ē": "e", "ę": "e", "ě": "e", "ė": "e",
  "ì": "i", "í": "i", "î": "i", "ï": "i", "ī": "i", "į": "i",
  "ò": "o", "ó": "o", "ô": "o", "õ": "o", "ö": "o", "ø": "o", "ō": "o", "ő": "o",
  "ù": "u", "ú": "u", "û": "u", "ü": "u", "ū": "u", "ű": "u", "ů": "u",
  "ý": "y", "ÿ": "y", "ȳ": "y",
  "ñ": "n", "ń": "n", "ň": "n",
  "ç": "c", "ć": "c", "č": "c",
  "ş": "s", "ś": "s", "š": "s", "ș": "s",
  "ž": "z", "ź": "z", "ż": "z",
  "æ": "ae", "œ": "oe", "ß": "ss",
  // Greek
  "α": "a", "β": "b", "γ": "g", "δ": "d", "ε": "e", "ζ": "z", "η": "h", "θ": "th",
  "ι": "i", "κ": "k", "λ": "l", "μ": "m", "ν": "n", "ξ": "x", "ο": "o", "π": "p",
  "ρ": "r", "σ": "s", "τ": "t", "υ": "u", "φ": "ph", "χ": "ch", "ψ": "ps", "ω": "o",
  "ά": "a", "έ": "e", "ή": "h", "ί": "i", "ό": "o", "ύ": "u", "ώ": "o",
  "ϊ": "i", "ϋ": "u", "ΐ": "i", "ΰ": "u",
  // Cyrillic
  "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "yo", "ж": "zh",
  "з": "z", "и": "i", "й": "y", "к": "k", "л": "l", "м": "m", "н": "n", "о": "o",
  "п": "p", "р": "r", "с": "s", "т": "t", "у": "u", "ф": "f", "х": "h", "ц": "ts",
  "ч": "ch", "ш": "sh", "щ": "sch", "ъ": "", "ы": "y", "ь": "", "э": "e", "ю": "yu", "я": "ya",
  // Symbols
  "©": "c", "®": "r", "™": "tm", "€": "e", "£": "l", "¥": "y", "§": "s", "¶": "p",
  "†": "t", "‡": "d", "•": "", "…": "...", "′": "'", "″": "\"", "‹": "<", "›": ">",
  "℠": "sm", "℡": "tel", "№": "no", "°": "o", "±": "pm", "×": "x", "÷": "d",
  "¡": "i", "¿": "q", "¬": "not", "¦": "|", "¤": "a", "¢": "c",
  // Punctuation to remove
  "!": "", "?": "", ":": "", ";": "", "'": "", "\"": "", "(": "", ")": "",
  "[": "", "]": "", "{": "", "}": "", "<": "", ">": "", "/": "", "\\": "",
  "|": "", "_": " ", "=": " ", "+": " ", "*": "", "%": "p", "$": "s", "@": "at",
  "#": "n", "^": "", "`": "", "~": " ", " ": " ",
} satisfies TransliterationMap;

/**
 * Applies transliteration to a string using a custom map merged with the built-in map.
 * @param input - The string to transliterate
 * @param customMap - Optional custom transliteration map to merge with the built-in map
 * @returns The transliterated string with characters replaced according to the map
 * @example
 * applyTransliteration("café") // "cafe"
 * applyTransliteration("Привет", { "П": "P", "р": "r" }) // "Privet"
 */
export function applyTransliteration(input: string, customMap?: TransliterationMap): string {
  const mergedMap: TransliterationMap = customMap
    ? { ...TRANSLITERATION_MAP, ...customMap }
    : TRANSLITERATION_MAP;

  let result = "";
  for (const char of input) {
    result += mergedMap[char] ?? char;
  }
  return result;
}

/**
 * Truncates a slug string at the last word boundary within the specified maximum length.
 * Finds the last occurrence of the separator before maxLength and cuts there,
 * avoiding mid-word truncation. If no separator exists in range, returns truncated text.
 * @param slug - The slug string to truncate
 * @param maxLength - Maximum allowed length
 * @returns The truncated slug at the nearest word boundary
 * @throws {RangeError} If maxLength is negative
 * @example
 * truncateAtWordBoundary("hello-world-foo-bar", 12) // "hello-world"
 * truncateAtWordBoundary("helloworld", 5) // "hello"
 */
export function truncateAtWordBoundary(slug: string, maxLength: number): string {
  if (maxLength < 0) {
    throw new RangeError(`maxLength must not be negative: ${maxLength}`);
  }
  if (slug.length <= maxLength) {
    return slug;
  }

  const truncated = slug.slice(0, maxLength);
  const lastSeparatorIndex = truncated.lastIndexOf("-");

  if (lastSeparatorIndex === -1) {
    return truncated;
  }

  return truncated.slice(0, lastSeparatorIndex);
}

/**
 * Normalizes the separator in a slug by collapsing multiple consecutive separators
 * into a single separator and trimming leading/trailing separators.
 * @param slug - The slug string to normalize
 * @param separator - The separator character to use (default: "-")
 * @returns The normalized slug with consistent separator usage
 * @throws {Error} If separator is empty
 * @example
 * normalizeSeparator("--hello--world--", "-") // "hello-world"
 * normalizeSeparator("  foo   bar  ", "-") // "foo-bar"
 */
export function normalizeSeparator(slug: string, separator: string = "-"): string {
  if (separator.length === 0) {
    throw new Error("Separator cannot be empty");
  }

  // Replace whitespace sequences with separator first
  let normalizedSlug = slug.replace(/\s+/g, separator);

  // Escape special regex characters in separator
  const escapedSeparator = separator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Collapse multiple separators into one
  normalizedSlug = normalizedSlug.replace(new RegExp(`${escapedSeparator}+`, "g"), separator);

  // Trim leading and trailing separators
  normalizedSlug = normalizedSlug.replace(new RegExp(`^${escapedSeparator}|${escapedSeparator}$`, "g"), "");

  return normalizedSlug;
}