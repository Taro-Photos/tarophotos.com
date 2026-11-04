import { describe, expect, it } from "vitest";
import { wwwRedirectTarget } from "../proxy";

describe("wwwRedirectTarget", () => {
  it("www を apex へ、パスとクエリを保って寄せる", () => {
    expect(wwwRedirectTarget("www.tarophotos.com", "tarophotos-xyz.a.run.app", "/works/first-light-voyage", "?a=1")).toBe(
      "https://tarophotos.com/works/first-light-voyage?a=1",
    );
  });
  it("x-forwarded-host が無ければ host を見る・大文字とポートを無視する", () => {
    expect(wwwRedirectTarget(null, "WWW.tarophotos.com:443", "/", "")).toBe("https://tarophotos.com/");
  });
  it("複数の x-forwarded-host は先頭を使う", () => {
    expect(wwwRedirectTarget("www.tarophotos.com, proxy.internal", null, "/about", "")).toBe("https://tarophotos.com/about");
  });
  it("apex・Cloud Run の直 URL・localhost は寄せない", () => {
    expect(wwwRedirectTarget("tarophotos.com", null, "/", "")).toBeNull();
    expect(wwwRedirectTarget(null, "tarophotos-xyz.a.run.app", "/", "")).toBeNull();
    expect(wwwRedirectTarget(null, "localhost:3000", "/", "")).toBeNull();
    expect(wwwRedirectTarget(null, null, "/", "")).toBeNull();
  });
});
