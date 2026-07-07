import { describe, expect, it } from "vitest";
import type { NextRequest } from "next/server";

import { checkSpam, HONEYPOT_FIELD } from "@/app/api/_lib/spam-guard";

// checkSpam は request から headers.get しか使わないので最小スタブで足りる。
// レート制限はモジュールスコープの Map に蓄積されるため、テストごとに
// 異なる IP を使って独立させる。
function fakeRequest(ip: string): NextRequest {
  return {
    headers: new Headers({ "x-forwarded-for": ip }),
  } as unknown as NextRequest;
}

const validBody = { fields: {}, [HONEYPOT_FIELD]: "", elapsedMs: 10_000 };

describe("checkSpam", () => {
  it("正常な送信を通す", () => {
    expect(checkSpam(fakeRequest("10.0.0.1"), validBody)).toEqual({ ok: true });
  });

  it("honeypot が埋まっていたら silent 破棄", () => {
    const verdict = checkSpam(fakeRequest("10.0.0.2"), {
      ...validBody,
      [HONEYPOT_FIELD]: "https://spam.example",
    });
    expect(verdict).toEqual({ ok: false, reason: "honeypot", silent: true });
  });

  it("送信が速すぎたら silent 破棄", () => {
    const verdict = checkSpam(fakeRequest("10.0.0.3"), { ...validBody, elapsedMs: 500 });
    expect(verdict).toEqual({ ok: false, reason: "too_fast", silent: true });
  });

  it("elapsedMs 欠落（API 直叩き）も silent 破棄", () => {
    const verdict = checkSpam(fakeRequest("10.0.0.4"), { fields: {} });
    expect(verdict).toEqual({ ok: false, reason: "too_fast", silent: true });
  });

  it("同一 IP の連投は 429 相当で拒否", () => {
    const ip = "10.0.0.5";
    for (let i = 0; i < 5; i += 1) {
      expect(checkSpam(fakeRequest(ip), validBody).ok).toBe(true);
    }
    const verdict = checkSpam(fakeRequest(ip), validBody);
    expect(verdict).toEqual({ ok: false, reason: "rate_limited", silent: false });
  });

  it("別 IP はレート制限に巻き込まれない", () => {
    expect(checkSpam(fakeRequest("10.0.0.6"), validBody)).toEqual({ ok: true });
  });
});
