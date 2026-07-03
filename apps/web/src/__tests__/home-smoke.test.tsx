import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SeriesIndex } from "@/components/home/SeriesIndex";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

// synth 刷新のスモークテスト。刷新で旧33テストが消えた（旧コンポーネントごと削除）ため、
// 新 synth コンポーネントの最小レンダリング契約をここで担保する（Test ゲートを実物に戻す）。
describe("home renewal smoke", () => {
  it("SeriesIndex renders the section heading and the pause vertical copy", () => {
    const { container } = render(<SeriesIndex />);
    // 英語見出し（アクセシブル名は「Selected Series 作品」）
    expect(
      screen.getByRole("heading", { name: /Selected Series/ }),
    ).toBeInTheDocument();
    // Pause 縦組みコピー。全角スペース(U+3000)の JSX エスケープ修正が壊れていない証跡も兼ねる。
    expect(container.textContent).toContain("余白に、想いが宿る");
    expect(screen.getByText(/観る人のための場所/)).toBeInTheDocument();
  });

  it.each([
    ["SiteHeader", SiteHeader],
    ["SiteFooter", SiteFooter],
  ])("%s renders without throwing", (_name, Component) => {
    const { container } = render(<Component />);
    expect(container.firstChild).not.toBeNull();
  });
});
