import { NextRequest } from "next/server";

// フォームスパム対策（無料・外部サービス不要の3層）:
// 1. Honeypot — 画面外の "website" フィールド。人間には見えず、bot は埋める。
// 2. 時間ゲート — フォーム表示から送信までの経過時間。bot は数百 ms で送る。
// 3. レート制限 — IP ごとのスライディングウィンドウ（インメモリ）。
//    Amplify SSR (Lambda) ではインスタンス単位のベストエフォートだが、
//    単一インスタンスからの連投・SES コスト暴走は防げる。
//
// honeypot / 時間ゲートに引っかかった場合は 200 を返して静かに破棄する
// （bot にフィルタの存在を教えないため）。レート超過のみ 429。

export const HONEYPOT_FIELD = "website";

const MIN_ELAPSED_MS = 3_000;

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1_000;
const RATE_LIMIT_MAX_REQUESTS = 5;

const submissionLog = new Map<string, number[]>();

function getClientIp(request: NextRequest): string
{
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded)
  {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string): boolean
{
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const timestamps = (submissionLog.get(ip) ?? []).filter((t) => t > cutoff);

  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS)
  {
    submissionLog.set(ip, timestamps);
    return true;
  }

  timestamps.push(now);
  submissionLog.set(ip, timestamps);

  // 無制限に成長しないよう、期限切れエントリを機会的に掃除する
  if (submissionLog.size > 1_000)
  {
    for (const [key, values] of submissionLog)
    {
      if (values.every((t) => t <= cutoff)) submissionLog.delete(key);
    }
  }

  return false;
}

export type SpamVerdict =
  | { ok: true }
  | { ok: false; reason: "honeypot" | "too_fast"; silent: true }
  | { ok: false; reason: "rate_limited"; silent: false };

// body はパース済み JSON（fields の外側）。honeypot と elapsedMs は
// トップレベルで送られてくる（fields に混ぜると通知メールに載ってしまうため）。
export function checkSpam(request: NextRequest, body: Record<string, unknown>): SpamVerdict
{
  if (isRateLimited(getClientIp(request)))
  {
    return { ok: false, reason: "rate_limited", silent: false };
  }

  const honeypot = body[HONEYPOT_FIELD];
  if (typeof honeypot === "string" && honeypot.trim() !== "")
  {
    return { ok: false, reason: "honeypot", silent: true };
  }

  // 正規クライアントは必ず elapsedMs を送る。欠落は API 直叩き＝bot 扱い。
  const elapsedMs = body.elapsedMs;
  if (typeof elapsedMs !== "number" || elapsedMs < MIN_ELAPSED_MS)
  {
    return { ok: false, reason: "too_fast", silent: true };
  }

  return { ok: true };
}
