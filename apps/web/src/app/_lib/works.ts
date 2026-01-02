import type { WorkSeries } from "@/app/_content/works";

type WorksParamValue = string | string[] | undefined;

export type WorksSearchParams = Record<string, WorksParamValue> | undefined;

export function normalizeParam(value?: WorksParamValue) {
  if (!value) {
    return "";
  }

  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value;
}

type QueryOverrides = Partial<Record<string, string>>;

export function buildQuery(params: WorksSearchParams, overrides: QueryOverrides) {
  const query = new URLSearchParams();

  const finalEntries = Object.entries({ ...(params ?? {}), ...overrides });

  for (const [key, value] of finalEntries) {
    const normalizedValue = Array.isArray(value) ? value[0] ?? "" : value ?? "";
    const omitDefaultPage = key === "page" && (normalizedValue === "" || normalizedValue === "1");

    if (normalizedValue.length > 0 && !omitDefaultPage) {
      query.set(key, normalizedValue);
    }
  }

  const queryString = query.toString();
  return queryString.length ? `?${queryString}` : "";
}

export type WorksFilters = {
  year?: string;
  palette?: string;
  focus?: string;
};

export function filterSeries(series: WorkSeries[], filters: WorksFilters) {
  const { year, palette, focus } = filters;

  return series
    .filter((item) => {
      const matchesYear = year ? item.year.toString() === year : true;
      const matchesPalette = palette ? item.palette === palette : true;
      const matchesFocus = focus ? item.focus === focus : true;

      return matchesYear && matchesPalette && matchesFocus;
    })
    .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
}

type PaginateResult = {
  items: WorkSeries[];
  currentPage: number;
  totalPages: number;
};

export function paginateSeries(series: WorkSeries[], pageSize: number, pageParam: string): PaginateResult {
  const totalPages = Math.max(1, Math.ceil(series.length / pageSize));
  const parsedPage = Number.parseInt(pageParam || "1", 10);
  const targetPage = Number.isFinite(parsedPage) ? parsedPage : 1;
  const currentPage = Math.min(totalPages, Math.max(1, targetPage));

  const startIndex = (currentPage - 1) * pageSize;
  const items = series.slice(startIndex, startIndex + pageSize);

  return { items, currentPage, totalPages };
}
