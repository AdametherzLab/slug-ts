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

  it("keeps case when lowercase option is false", () => {
    const result = slugify("Hello World", { lowercase: false });
    expect(result).toBe("Hello-World");
  });

  it("keeps case and respects transliteration when lowercase is false", () => {
    const result = slugify("Café Résumé", { lowercase: false });
    expect(result).toBe("Cafe-Resume");
  });

  it("keeps case and respects custom separator when lowercase is false", () => {
    const result = slugify("My Awesome Title", { lowercase: false, separator: "_" });
    expect(result).toBe("My_Awesome_Title");
  });

  it("removes non-alphanumeric characters entirely when removeNonAlphanumeric is true", () => {
    const result = slugify("Hello! World? 123.", { removeNonAlphanumeric: true });
    expect(result).toBe("hello-world-123");
  });

  it("removes non-alphanumeric characters entirely and preserves case", () => {
    const result = slugify("Hello! World? 123.", { removeNonAlphanumeric: true, lowercase: false });
    expect(result).toBe("Hello-World-123");
  });

  it("removes non-alphanumeric characters entirely and uses custom separator", () => {
    const result = slugify("Hello! World? 123.", { removeNonAlphanumeric: true, separator: "_" });
    expect(result).toBe("hello_world_123");
  });

  it("handles mixed characters with removeNonAlphanumeric", () => {
    const result = slugify("Café! Résumé? Привет мир!", { removeNonAlphanumeric: true });
    expect(result).toBe("cafe-resume-privet-mir");
  });

  it("does not remove non-alphanumeric characters when removeNonAlphanumeric is false", () => {
    const result = slugify("Hello! World?", { removeNonAlphanumeric: false });
    expect(result).toBe("hello-world"); // Default behavior still replaces with separator
  });
});
