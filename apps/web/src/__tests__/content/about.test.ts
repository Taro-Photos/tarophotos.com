import { describe, expect, it } from "vitest";
import { profile } from "@/app/_content/about";

describe("about content", () => {
  describe("profile", () => {
    it("exports profile object with required fields", () => {
      expect(profile).toBeDefined();
      expect(profile).toHaveProperty("name");
      expect(profile).toHaveProperty("tagline");
      expect(profile).toHaveProperty("statement");
      expect(typeof profile.name).toBe("string");
      expect(typeof profile.tagline).toBe("string");
      expect(typeof profile.statement).toBe("string");
    });

    it("has non-empty string values", () => {
      expect(profile.name.length).toBeGreaterThan(0);
      expect(profile.tagline.length).toBeGreaterThan(0);
      expect(profile.statement.length).toBeGreaterThan(0);
    });
  });
});
