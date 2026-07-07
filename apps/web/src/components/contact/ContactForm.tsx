"use client";

import { useRef, useState } from "react";
import { contactFields, privacyNotice } from "@/app/_content/booking";
import styles from "./ContactForm.module.css";

type Status = "idle" | "submitting" | "success" | "error";

const AGREE_VALUE = "同意する";

// スパム対策（api/_lib/spam-guard.ts と対）: 画面外 honeypot のフィールド名と、
// マウント→送信の経過時間。fields には混ぜずトップレベルで送る（通知メール除外）。
const HONEYPOT_FIELD = "website";

export function ContactForm({ fallbackEmail }: { fallbackEmail: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const mountedAtRef = useRef<number>(Date.now());

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const data = new FormData(form);

    const fields: Record<string, string> = {};
    for (const field of contactFields) {
      if (field.type === "checkbox") {
        fields[field.key] = data.get(field.key) ? AGREE_VALUE : "";
      } else {
        fields[field.key] = String(data.get(field.key) ?? "").trim();
      }
    }

    setStatus("submitting");
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fields,
          [HONEYPOT_FIELD]: String(data.get(HONEYPOT_FIELD) ?? ""),
          elapsedMs: Date.now() - mountedAtRef.current,
        }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { message?: string } | null;
        throw new Error(body?.message ?? "送信に失敗しました。");
      }

      form.reset();
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "送信に失敗しました。");
    }
  }

  if (status === "success") {
    return (
      <div className={styles.done} role="status">
        <p className={styles.doneTitle}>Thank you.</p>
        <p className={styles.doneJa} lang="ja">
          お問い合わせを受け付けました。2日以内にご返信します。
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate={false}>
      {/* Honeypot: 画面外に置く。人間には見えず bot だけが埋める */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}
      >
        <label>
          Website
          <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {contactFields.map((field) => {
        if (field.type === "select") {
          return (
            <label key={field.key} className={styles.row}>
              <span className={styles.label} lang="ja">{field.label}</span>
              <select className={styles.select} name={field.key} required={field.required} defaultValue="">
                <option value="" disabled>
                  選択してください
                </option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </label>
          );
        }

        if (field.type === "textarea") {
          return (
            <label key={field.key} className={styles.row}>
              <span className={styles.label} lang="ja">{field.label}</span>
              <textarea className={styles.textarea} name={field.key} required={field.required} rows={4} />
            </label>
          );
        }

        if (field.type === "checkbox") {
          return (
            <label key={field.key} className={styles.check}>
              <input type="checkbox" name={field.key} value={AGREE_VALUE} required={field.required} />
              <span className={styles.checkLabel} lang="ja">
                {field.label}
                <span className={styles.notice}>{privacyNotice}</span>
              </span>
            </label>
          );
        }

        return (
          <label key={field.key} className={styles.row}>
            <span className={styles.label} lang="ja">
              {field.label}
              {!field.required ? <span className={styles.optional}> (任意)</span> : null}
            </span>
            <input
              className={styles.input}
              type={field.type === "email" ? "email" : "text"}
              name={field.key}
              required={field.required}
              autoComplete={field.key === "email" ? "email" : field.key === "name" ? "name" : "off"}
            />
          </label>
        );
      })}

      <div className={styles.actions}>
        <button className={styles.submit} type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Send a note"}
        </button>
        <a className={styles.mailto} href={`mailto:${fallbackEmail}`}>
          or email directly
        </a>
      </div>

      {status === "error" ? (
        <p className={styles.error} role="alert">
          {error} もしくは{" "}
          <a href={`mailto:${fallbackEmail}`}>{fallbackEmail}</a> へ直接お送りください。
        </p>
      ) : null}
    </form>
  );
}
