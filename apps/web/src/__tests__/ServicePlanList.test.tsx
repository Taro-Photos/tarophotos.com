import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ServicePlanList } from "@/components/organisms/ServicePlanList";

const plans = [
  {
    slug: "standard",
    title: "スタンダード",
    summary: "4時間・100枚納品",
    price: "¥120,000〜",
    deliverables: ["撮影〜納品", "オンラインギャラリー"],
    notes: "交通費別途",
  },
  {
    slug: "premium",
    title: "プレミアム",
    summary: "終日帯同",
    price: "¥240,000〜",
    deliverables: ["終日帯同", "動画ダイジェスト"],
    notes: "事前ロケハン込み",
  },
];

describe("ServicePlanList", () => {
  it("lists plans with pricing badge and deliverables", () => {
    render(<ServicePlanList plans={plans} />);

    const articles = screen.getAllByRole("article");
    expect(articles).toHaveLength(plans.length);

    const first = within(articles[0]);
    expect(first.getByRole("heading", { level: 3, name: "スタンダード" })).toBeInTheDocument();
    expect(first.getByText("¥120,000〜")).toHaveClass("bg-[var(--color-accent)]");
    plans[0].deliverables.forEach((item) => {
      expect(first.getByText(item)).toBeInTheDocument();
    });

    const second = within(articles[1]);
    expect(second.getByText("事前ロケハン込み")).toBeInTheDocument();
  });

  it("does not render plans marked as hidden", () => {
    render(
      <ServicePlanList
        plans={[
          ...plans,
          {
            slug: "archived",
            title: "非表示プラン",
            summary: "表示されないことを確認",
            price: "¥0",
            deliverables: ["テスト用"],
            notes: "テスト用",
            isHidden: true,
          },
        ]}
      />
    );

    const articles = screen.getAllByRole("article");
    expect(articles).toHaveLength(plans.length);
    expect(screen.queryByText("非表示プラン")).not.toBeInTheDocument();
  });
});
