import { applyTransliteration } from "./utils";
import type { SlugOptions } from "./types";

type SlugInput = string | number | null | undefined;

/**
 * Default options for slug generation.
 */
const DEFAULT_OPTIONS: Required<SlugOptions> = {
  separator: "-",
  maxLength: undefined,
  lowercase: true,
  trimLeading: true,
  trimTrailing: true,
  transliterationMap: {},
  preserveAccents: false,
  removeNonAlphanumeric: false,
  preserveNumbers: true,
};

/**
 * Regular expression to match combining diacritical marks (Unicode category Mn).
 */
const DIACRITIC_REGEX = /\p{Mn}/gu;

/**
 * Core slugification engine.
 * Converts any input to a URL-safe slug string.
 *
 * @param input - The value to convert to a slug (string, number, or falsy)
 * @param options - Configuration options for slug generation
 * @returns A URL-safe slug string
 * @example
 * slugify("Hello World"); // "hello-world"
 * slugify("Café résumé", { preserveAccents: false }); // "cafe-resume"
 * slugify("  --test--  "); // "test"
 */
export function slugify(input: SlugInput, options: SlugOptions = {}): string {
  const config: Required<SlugOptions> = { ...DEFAULT_OPTIONS, ...options };

  // Step 1: Coerce input to string
  let slug = coerceToString(input);

  // Step 2: Apply transliteration using custom map merged with built-in
  slug = applyTransliteration(slug, config.transliterationMap);

  // Step 3: Normalize unicode and strip diacritics
  slug = normalizeAndStripDiacritics(slug, config.preserveAccents);

  // Step 4: Replace non-alphanumeric characters with separator or remove them
  let nonAlphanumericRegex: RegExp;
  if (config.preserveNumbers) {
    // Match anything that is NOT a letter, number, or the separator
    const separatorPattern = config.separator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    nonAlphanumericRegex = new RegExp(`[^\p{L}\p{N}${separatorPattern}]+`, "gu");
  } else {
    // Match anything that is NOT a letter
    nonAlphanumericRegex = /[^\p{L}]+/gu;
  }

  if (config.removeNonAlphanumeric) {
    // If removeNonAlphanumeric is true, replace matched characters with empty string
    slug = slug.replace(nonAlphanumericRegex, "");
  } else {
    // Otherwise, replace matched characters with the separator
    slug = slug.replace(nonAlphanumericRegex, config.separator);
  }

  // Step 5: Collapse consecutive separators into one
  const collapseRegex = new RegExp(`\${config.separator}+`, "g");
  slug = slug.replace(collapseRegex, config.separator);

  // Step 6: Trim leading/trailing separators
  if (config.trimLeading) {
    slug = slug.replace(new RegExp(`^\${config.separator}+`), "");
  }
  if (config.trimTrailing) {
    slug = slug.replace(new RegExp(`\${config.separator}+$`), "");
  }

  // Step 7: Optionally lowercase
  if (config.lowercase) {
    slug = slug.toLowerCase();
  }

  // Step 8: Optionally truncate at word boundaries
  if (config.maxLength !== undefined && config.maxLength > 0 && slug.length > config.maxLength) {
    const lastBoundaryIndex = slug.lastIndexOf(config.separator, config.maxLength);
    slug = lastBoundaryIndex !== -1 ? slug.slice(0, lastBoundaryIndex) : slug.slice(0, config.maxLength);
  }

  return slug;
}

/**
 * Coerce any input to a string representation.
 * @param input - The input value
 * @returns String representation
 */
function coerceToString(input: SlugInput): string {
  if (input === null || input === undefined) {
    return "";
  }

  if (typeof input === "number") {
    if (Number.isNaN(input) || !Number.isFinite(input)) {
      return "";
    }
    return String(input);
  }

  return String(input);
}

/**
 * Normalize unicode and optionally strip diacritical marks.
 * @param text - Input text
 * @param preserveAccents - Whether to preserve accent characters
 * @returns Normalized text
 */
function normalizeAndStripDiacritics(text: string, preserveAccents: boolean): string {
  // Normalize to NFD (Canonical Decomposition)
  let result = text.normalize("NFD");

  if (!preserveAccents) {
    // Remove combining diacritical marks (accents)
    result = result.replace(DIACRITIC_REGEX, "");
  }

  return result;
}
