import { describe, expect, it } from "vitest";

import type { WorkSeries } from "@/app/_content/works";
import { buildQuery, filterSeries, normalizeParam, paginateSeries } from "@/app/_lib/works";

const sampleSeries: WorkSeries[] = [
  { slug: "a", title: "Alpha", year: 2025, location: "Tokyo", category: "Personal", palette: "color", focus: "urban", synopsis: "", cover: { src: "/a.jpg", alt: "a", width: 1, height: 1 } },
  { slug: "b", title: "Beta", year: 2024, location: "Osaka", category: "Commercial", palette: "monochrome", focus: "nature", synopsis: "", cover: { src: "/b.jpg", alt: "b", width: 1, height: 1 } },
  { slug: "c", title: "Gamma", year: 2024, location: "Kyoto", category: "Personal", palette: "color", focus: "people", synopsis: "", cover: { src: "/c.jpg", alt: "c", width: 1, height: 1 } },
];

describe("works helpers", () =>
{
  it("normalizes primitive and array values", () =>
  {
    expect(normalizeParam(undefined)).toBe("");
    expect(normalizeParam("2025")).toBe("2025");
    expect(normalizeParam(["2024", "2023"])).toBe("2024");
  });

  it("builds canonical query strings and omits default page", () =>
  {
    const params = { year: "2025", page: "1", palette: "color" };
    expect(buildQuery(params, {})).toBe("?year=2025&palette=color");

    const query = buildQuery(params, { page: "2" });
    const searchParams = new URLSearchParams(query.slice(1));
    expect(searchParams.get("year")).toBe("2025");
    expect(searchParams.get("palette")).toBe("color");
    expect(searchParams.get("page")).toBe("2");

    expect(buildQuery(params, { palette: "" })).toBe("?year=2025");
  });

  it("filters and sorts series by year then title", () =>
  {
    const filtered = filterSeries(sampleSeries, { palette: "color" });
    expect(filtered.map((item) => item.slug)).toEqual(["a", "c"]);

    const focusFiltered = filterSeries(sampleSeries, { focus: "nature" });
    expect(focusFiltered).toHaveLength(1);
    expect(focusFiltered[0]?.slug).toBe("b");
  });

  it("paginates results with clamped bounds", () =>
  {
    const pageSize = 2;
    const { items: firstPage, totalPages, currentPage } = paginateSeries(sampleSeries, pageSize, "1");
    expect(totalPages).toBe(2);
    expect(currentPage).toBe(1);
    expect(firstPage).toHaveLength(2);

    const { items: secondPage, currentPage: clampedPage } = paginateSeries(sampleSeries, pageSize, "3");
    expect(clampedPage).toBe(2);
    expect(secondPage.map((item) => item.slug)).toEqual(["c"]);
  });
});
