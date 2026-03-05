/**
 * Character mapping for transliteration (unicode to ASCII).
 * Keys are unicode characters, values are their ASCII replacements.
 * @example
 * { "ä": "a", "ö": "o", "ü": "u", "ß": "ss" }
 */
export type TransliterationMap = Readonly<Record<string, string>>;

/**
 * Configuration options for slug generation.
 */
export interface SlugOptions {
  /**
   * Character used to separate words in the slug.
   * @default "-"
   */
  readonly separator: string;

  /**
   * Maximum length of the generated slug.
   * Truncation