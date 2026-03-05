import { describe, it, expect } from "bun:test";
import { slugify, TRANSLITERATION_MAP, applyTransliteration, truncateAtWordBoundary, normalizeSeparator } from "../src/index.ts";

describe("slugify", () => {
  it("converts basic ASCII string to lowercase slug with hyphens", () => {
    const result = slugify("Hello World");
    expect(result).toBe("hello-world");
  });

  it("strips unicode diacritics from Latin extended characters", () => {
    const result = slugify("café résumé");
    expect(result).toBe("cafe-resume");
  });

  it("transliterates Cyrillic characters to Latin equivalents", () => {
    const result = slugify("Привет мир");
    expect(result).toBe("privet-mir");
  });

  it("respects custom separator option", () => {
    const result = slugify("Hello World", { separator: "_" });
    expect(result).toBe("hello_world");
  });

  it("truncates at word boundary when maxLength is specified", () => {
    const result = slugify("hello world foo bar", { maxLength: 12 });
    expect(result).toBe("hello-world");
  });
});