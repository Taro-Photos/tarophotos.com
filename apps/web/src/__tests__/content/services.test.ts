import { describe, expect, it } from "vitest";
import { servicePlans, visibleServicePlans, processSteps, faqs } from "@/app/_content/services";

describe("services content", () => {
  describe("servicePlans", () => {
    it("exports an array of service plans", () => {
      expect(Array.isArray(servicePlans)).toBe(true);
      expect(servicePlans.length).toBeGreaterThan(0);
    });

    it("each service plan has required fields", () => {
      servicePlans.forEach((plan) => {
        expect(plan).toHaveProperty("slug");
        expect(plan).toHaveProperty("title");
        expect(plan).toHaveProperty("summary");
        expect(plan).toHaveProperty("price");
        expect(plan).toHaveProperty("deliverables");
        expect(plan).toHaveProperty("notes");
        expect(Array.isArray(plan.deliverables)).toBe(true);
      });
    });
  });

  describe("visibleServicePlans", () => {
    it("filters out hidden service plans", () => {
      expect(Array.isArray(visibleServicePlans)).toBe(true);
      visibleServicePlans.forEach((plan) => {
        expect(plan.isHidden).not.toBe(true);
      });
    });
  });

  describe("processSteps", () => {
    it("exports an array of process steps", () => {
      expect(Array.isArray(processSteps)).toBe(true);
      expect(processSteps.length).toBeGreaterThan(0);
    });

    it("each step has required fields", () => {
      processSteps.forEach((step) => {
        expect(step).toHaveProperty("title");
        expect(step).toHaveProperty("description");
        expect(step).toHaveProperty("duration");
        expect(typeof step.title).toBe("string");
        expect(typeof step.description).toBe("string");
        expect(typeof step.duration).toBe("string");
      });
    });
  });

  describe("faqs", () => {
    it("exports an array of FAQ items", () => {
      expect(Array.isArray(faqs)).toBe(true);
      expect(faqs.length).toBeGreaterThan(0);
    });

    it("each FAQ has question and answer", () => {
      faqs.forEach((faq) => {
        expect(faq).toHaveProperty("question");
        expect(faq).toHaveProperty("answer");
        expect(typeof faq.question).toBe("string");
        expect(typeof faq.answer).toBe("string");
        expect(faq.question.length).toBeGreaterThan(0);
        expect(faq.answer.length).toBeGreaterThan(0);
      });
    });
  });
});
