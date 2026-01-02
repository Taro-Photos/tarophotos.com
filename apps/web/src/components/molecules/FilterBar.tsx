"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { paletteFilters, focusFilters } from "@/app/_content/works";
import { pushAnalyticsEvent } from "@/app/_lib/analytics";

type FilterBarProps = {
  years: number[];
  selectedYear?: string;
  selectedPalette?: string;
  selectedFocus?: string;
};

function FilterForm({ years, selectedYear, selectedPalette, selectedFocus }: FilterBarProps) {
  const [yearValue, setYearValue] = useState(selectedYear ?? "");
  const [paletteValue, setPaletteValue] = useState(selectedPalette ?? "");
  const [focusValue, setFocusValue] = useState(selectedFocus ?? "");

  useEffect(() => {
    setYearValue(selectedYear ?? ""); // eslint-disable-line react-hooks/set-state-in-effect
  }, [selectedYear]);

  useEffect(() => {
    setPaletteValue(selectedPalette ?? ""); // eslint-disable-line react-hooks/set-state-in-effect
  }, [selectedPalette]);

  useEffect(() => {
    setFocusValue(selectedFocus ?? ""); // eslint-disable-line react-hooks/set-state-in-effect
  }, [selectedFocus]);

  const trackFacetChange = (facet: string, value: string) => {
    pushAnalyticsEvent({ name: "filter_change", params: { facet, value: value || "all" } });
  };

  const handleYearChange = (value: string) => {
    setYearValue(value);
    trackFacetChange("year", value);
  };

  const handlePaletteChange = (value: string) => {
    setPaletteValue(value);
    trackFacetChange("palette", value);
  };

  const handleFocusChange = (value: string) => {
    setFocusValue(value);
    trackFacetChange("focus", value);
  };

  return (
    <form
      className="page-container flex flex-col gap-6 border-b border-[var(--color-border)] pb-8 sm:flex-row sm:flex-wrap sm:items-end sm:gap-4"
      method="get"
    >
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[160px]">
        <label htmlFor="year" className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
          Year
        </label>
        <select
          id="year"
          name="year"
          value={yearValue}
          className="rounded-[14px] border border-[var(--surface-card-border)] bg-[var(--form-field-background)] px-4 py-3 text-sm"
          onChange={(event) => handleYearChange(event.target.value)}
        >
          <option value="">All</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[200px]">
        <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
          Palette
        </span>
        <div className="flex flex-wrap gap-2">
          {paletteFilters.map((paletteOption) => {
            const isActive = paletteOption.value === paletteValue;
            return (
              <label
                key={paletteOption.value}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.25em] transition-all duration-200 ease-out ${
                  isActive
                    ? "border-transparent bg-gradient-accent text-[var(--color-on-accent)] shadow-[0_14px_30px_-20px_rgba(11,110,122,0.55)]"
                    : "border border-[var(--surface-card-border)] bg-[var(--surface-card)] text-[var(--color-muted)] hover:border-transparent hover:bg-gradient-accent-soft hover:text-[var(--color-accent)] hover:shadow-[0_14px_32px_-24px_rgba(11,110,122,0.45)]"
                } peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--color-accent)]`}
              >
                <input
                  type="radio"
                  name="palette"
                  value={paletteOption.value}
                  checked={isActive}
                  className="sr-only peer"
                  onChange={() => handlePaletteChange(paletteOption.value)}
                />
                {paletteOption.label}
              </label>
            );
          })}
          <label
            className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.25em] transition-all duration-200 ease-out ${
              paletteValue.length === 0
                ? "border-transparent bg-gradient-accent text-[var(--color-on-accent)] shadow-[0_14px_30px_-20px_rgba(11,110,122,0.55)]"
                : "border border-[var(--surface-card-border)] bg-[var(--surface-card)] text-[var(--color-muted)] hover:border-transparent hover:bg-gradient-accent-soft hover:text-[var(--color-accent)] hover:shadow-[0_14px_32px_-24px_rgba(11,110,122,0.45)]"
            } peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--color-accent)]`}
          >
            <input
              type="radio"
              name="palette"
              value=""
              checked={paletteValue.length === 0}
              className="sr-only peer"
              onChange={() => handlePaletteChange("")}
            />
            All
          </label>
        </div>
      </div>

      <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[220px]">
        <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
          Focus
        </span>
        <div className="flex flex-wrap gap-2">
          {focusFilters.map((focusOption) => {
            const isActive = focusOption.value === focusValue;
            return (
              <label
                key={focusOption.value}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.25em] transition-all duration-200 ease-out ${
                  isActive
                    ? "border-transparent bg-gradient-accent text-[var(--color-on-accent)] shadow-[0_14px_30px_-20px_rgba(11,110,122,0.55)]"
                    : "border border-[var(--surface-card-border)] bg-[var(--surface-card)] text-[var(--color-muted)] hover:border-transparent hover:bg-gradient-accent-soft hover:text-[var(--color-accent)] hover:shadow-[0_14px_32px_-24px_rgba(11,110,122,0.45)]"
                } peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--color-accent)]`}
              >
                <input
                  type="radio"
                  name="focus"
                  value={focusOption.value}
                  checked={isActive}
                  className="sr-only peer"
                  onChange={() => handleFocusChange(focusOption.value)}
                />
                {focusOption.label}
              </label>
            );
          })}
          <label
            className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.25em] transition-all duration-200 ease-out ${
              focusValue.length === 0
                ? "border-transparent bg-gradient-accent text-[var(--color-on-accent)] shadow-[0_14px_30px_-20px_rgba(11,110,122,0.55)]"
                : "border border-[var(--surface-card-border)] bg-[var(--surface-card)] text-[var(--color-muted)] hover:border-transparent hover:bg-gradient-accent-soft hover:text-[var(--color-accent)] hover:shadow-[0_14px_32px_-24px_rgba(11,110,122,0.45)]"
            } peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--color-accent)]`}
          >
            <input
              type="radio"
              name="focus"
              value=""
              checked={focusValue.length === 0}
              className="sr-only peer"
              onChange={() => handleFocusChange("")}
            />
            All
          </label>
        </div>
      </div>

      <div className="flex w-full gap-3 sm:ml-auto sm:w-auto">
        <button
          type="submit"
          className="w-full rounded-full bg-gradient-accent px-6 py-3 text-xs uppercase tracking-[0.28em] text-[var(--color-on-accent)] shadow-[0_18px_36px_-20px_rgba(7,75,100,0.55)] transition-transform duration-200 ease-out hover:-translate-y-[2px] hover:shadow-[0_20px_44px_-20px_rgba(7,75,100,0.55)] sm:w-auto"
        >
          Update
        </button>
        <Link
          href="/works"
          className="inline-flex w-full items-center justify-center rounded-full border border-transparent px-6 py-3 text-xs uppercase tracking-[0.28em] text-[var(--color-foreground)] transition-transform duration-200 ease-out [background:linear-gradient(var(--color-background),var(--color-background))_padding-box,linear-gradient(135deg,rgba(31,154,245,0.55),rgba(10,110,122,0.6))_border-box] hover:-translate-y-[2px] hover:[background:linear-gradient(var(--color-background),var(--color-background))_padding-box,linear-gradient(135deg,rgba(31,154,245,0.75),rgba(10,110,122,0.75))_border-box] sm:w-auto"
        >
          Reset
        </Link>
      </div>
    </form>
  );
}

export function FilterBar(props: FilterBarProps) {
  return (
    <Suspense fallback={<div className="page-container py-12 text-sm text-[var(--color-muted)]">Loading filters…</div>}>
      <FilterForm {...props} />
    </Suspense>
  );
}
