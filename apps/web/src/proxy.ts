import { NextResponse, type NextRequest } from "next/server";

// www.tarophotos.com を apex（https://tarophotos.com）へ 301 で寄せる。
// 2026-11-04 まで www は 200 で同じ中身を返し、同じページが 2 つの URL に分かれていた。
// Firebase Hosting の rewrite 経由で Cloud Run に届くので、元のホストは x-forwarded-host に入る。
const WWW_HOST = "www.tarophotos.com";
const APEX_ORIGIN = "https://tarophotos.com";

export function wwwRedirectTarget(
  forwardedHost: string | null,
  host: string | null,
  pathname: string,
  search: string,
): string | null {
  const raw = (forwardedHost ?? host ?? "").split(",")[0].trim().toLowerCase();
  const hostname = raw.replace(/:\d+$/, "");
  if (hostname !== WWW_HOST) return null;
  return `${APEX_ORIGIN}${pathname}${search}`;
}

export function proxy(request: NextRequest) {
  const target = wwwRedirectTarget(
    request.headers.get("x-forwarded-host"),
    request.headers.get("host"),
    request.nextUrl.pathname,
    request.nextUrl.search,
  );
  if (target) return NextResponse.redirect(target, 301);
  return NextResponse.next();
}
