[![CI](https://github.com/AdametherzLab/slug-ts/actions/workflows/ci.yml/badge.svg)](https://github.com/AdametherzLab/slug-ts/actions) [![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

# slug-ts 🐌

## Features

- **Unicode to ASCII** — Converts "Café résumé" → "cafe-resume", "Привет" → "privet"
- **Word-boundary truncation** — Never cut words in half; truncates cleanly at maxLength
- **Custom transliteration** — Bring your own character map or use the built-in one
- **Flexible separators** — Use `-`, `_`, or any character you like
- **Zero dependencies** — Pure TypeScript, tiny bundle, blazing fast

## Installation

```bash
npm install @adametherzlab/slug-ts
```

```bash
bun add @adametherzLab/slug-ts
```

## Quick Start

```typescript
// REMOVED external import: import { slugify } from "@adametherzlab/slug-ts";

slugify("Hello World!");                    // "hello-world"
slugify("Café résumé");                     // "cafe-resume"
slugify("  --weird--input--  ");            // "weird-input"
slugify("Hello 👋 World", { maxLength: 8 }); // "hello"
```

## API Reference

### `slugify(input, options?)`

Core slugification engine. Converts any input to a URL-safe slug string.

**Signature:**
```typescript
function slugify(input: SlugInput, options?: SlugOptions): string
```

**Parameters:**
- `input` — The value to convert (string, number, or falsy)
- `options` — Optional configuration (see `SlugOptions` below)

**Returns:** A URL-safe slug string

**Examples:**
```typescript
slugify("Hello World"); // "hello-world"
slugify("Café résumé", { preserveAccents: false }); // "cafe-resume"
slugify("  --test--  "); // "test"
slugify("Héllo Wörld", { preserveAccents: true }); // "héllo-wörld"
slugify("super-long-slug", { maxLength: 10, separator: "_" }); // "super_long"
slugify("Keep::Multiple::Separators", { separator: "-" }); // "keep-multiple-separators"
```

---

### `SlugOptions`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `separator` | `string` | `"-"` | Character used to join words |
| `lowercase` | `boolean` | `true` | Convert output to lowercase |
| `maxLength` | `number` | `undefined` | Maximum slug length (truncates at word boundary) |
| `preserveAccents` | `boolean` | `false` | Keep accented characters instead of transliterating |
| `trim` | `boolean` | `true` | Remove leading/trailing whitespace and separators |
| `transliterationMap` | `TransliterationMap` | `TRANSLITERATION_MAP` | Custom character mapping |

---

### `TRANSLITERATION_MAP`

Built-in transliteration map covering Latin extended, Greek, Cyrillic, and common symbols.

**Signature:**
```typescript
const TRANSLITERATION_MAP: TransliterationMap
```

**Type:**
```typescript
type TransliterationMap = Readonly<Record<string, string>>
```

---

### `applyTransliteration(input, customMap?)`

**Signature:**
```typescript
function applyTransliteration(input: string, customMap?: TransliterationMap): string
```

**Parameters:**
- `input` — The string to transliterate
- `customMap` — Optional custom transliteration map to merge with the built-in map

**Returns:** The transliterated string

**Examples:**
```typescript
applyTransliteration("café"); // "cafe"
applyTransliteration("Привет", { "П": "P", "р": "r" }); // "Privet"
```

---

### `truncateAtWordBoundary(slug, maxLength)`

**Signature:**
```typescript
function truncateAtWordBoundary(slug: string, maxLength: number): string
```

**Parameters:**
- `slug` — The slug string to truncate
- `maxLength` — Maximum allowed length

**Returns:** The truncated slug at the nearest word boundary

**Throws:** `RangeError` if maxLength is negative

**Examples:**
```typescript
truncateAtWordBoundary("hello-world-foo-bar", 12); // "hello-world"
truncateAtWordBoundary("helloworld", 5); // "hello"
truncateAtWordBoundary("abc-def", 100); // "abc-def"
```

---

### `normalizeSeparator(slug, separator?)`

**Signature:**
```typescript
function normalizeSeparator(slug: string, separator: string = "-"): string
```

**Parameters:**
- `slug` — The slug string to normalize
- `separator` — The separator character to use (default: "-")

**Returns:** The normalized slug with consistent separator usage

**Throws:** `Error` if separator is empty

**Examples:**
```typescript
normalizeSeparator("--hello--world--", "-"); // "hello-world"
normalizeSeparator("  foo   bar  ", "-"); // "foo-bar"
normalizeSeparator("a__b__c", "_"); // "a_b_c"
```

---

## Advanced Usage

```typescript
import { 
  slugify, 
  applyTransliteration, 
  truncateAtWordBoundary, 
  normalizeSeparator,
  TRANSLITERATION_MAP 
} from "@adametherzlab/slug-ts";

// Custom map for Polish characters
const polishMap: TransliterationMap = {
  ...TRANSLITERATION_MAP,
  "ą": "a", "ć": "c", "ę": "e", "ł": "l", "ń": "n", "ó": "o", "ś": "s", "ź": "z", "ż": "z"
};

// Generate a clean slug from a blog post title
const title = "10 Najlepszych Restauracji w Warszawie 🇵🇱";
const rawSlug = slugify(title, {
  maxLength: 50,
  separator: "-",
  transliterationMap: polishMap
});
console.log(rawSlug); // "10-najlepszych-restauracji-w-warszawie"

// Use applyTransliteration for custom preprocessing
const userInput = "User's Review: ★★★★★ Amazing!";
const cleaned = normalizeSeparator(userInput, "-");
const final = slugify(cleaned, { preserveAccents: true });
console.log(final); // "users-review-amazing"

// Manual word-boundary truncation for special cases
const longSlug = "this-is-a-very-long-slug-that-needs-smart-truncation";
const truncated = truncateAtWordBoundary(longSlug, 25);
console.log(truncated); // "this-is-a-very-long-slug"
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT (c) [AdametherzLab](https://github.com/AdametherzLab)