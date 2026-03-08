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
  readonly separator?: string;

  /**
   * Maximum length of the generated slug.
   * Truncation occurs at the last word boundary before this length.
   * @default undefined (no truncation)
   */
  readonly maxLength?: number;

  /**
   * Whether to convert the slug to lowercase.
   * @default true
   */
  readonly lowercase?: boolean;

  /**
   * Whether to remove leading separators from the slug.
   * @default true
   */
  readonly trimLeading?: boolean;

  /**
   * Whether to remove trailing separators from the slug.
   * @default true
   */
  readonly trimTrailing?: boolean;

  /**
   * Custom transliteration map to merge with the built-in map.
   * @default {}
   */
  readonly transliterationMap?: TransliterationMap;

  /**
   * Whether to preserve accent characters (e.g., é, ü) instead of stripping them.
   * If `true`, `café` becomes `cafe` (due to transliteration) but `résumé` becomes `résumé` (if no transliteration exists).
   * @default false
   */
  readonly preserveAccents?: boolean;

  /**
   * Whether to remove non-alphanumeric characters entirely instead of replacing them with the separator.
   * If `true`, `Hello! World?` becomes `hello-world` (assuming default separator).
   * This option takes precedence over `separator` for non-alphanumeric characters.
   * @default false
   */
  readonly removeNonAlphanumeric?: boolean;
}
