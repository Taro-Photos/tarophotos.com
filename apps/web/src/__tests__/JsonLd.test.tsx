import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { JsonLd } from "@/components/atoms/JsonLd";

describe("JsonLd", () => {
  it("renders script with serialized data", () => {
    const { container } = render(<JsonLd data={{ name: "Taro" }} id="person-jsonld" />);

    const script = container.querySelector("script#person-jsonld");
    expect(script).not.toBeNull();
    expect(script).toHaveAttribute("type", "application/ld+json");
    expect(script?.innerHTML).toBe(JSON.stringify({ name: "Taro" }));
  });

  it("returns null when data is undefined", () => {
    const { container } = render(<JsonLd data={undefined} />);
    expect(container.firstChild).toBeNull();
  });
});
