import Link from "next/link";
import {
  legalPage,
  privacyPolicySections,
  tokushoFields,
  tokushoNotes,
} from "@/app/_content/legal";
import styles from "./LegalPage.module.css";

function formatUpdatedAt(dateString: string) {
  const date = new Date(`${dateString}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return dateString;
  return `${date.getUTCFullYear()}.${String(date.getUTCMonth() + 1).padStart(2, "0")}.${String(
    date.getUTCDate(),
  ).padStart(2, "0")}`;
}

export function LegalPage() {
  return (
    <section className={styles.legal}>
      <div className="ds-wrap">
        <div className={styles.head}>
          <span className={styles.eyebrow}>Legal</span>
          <span className={styles.updated}>
            Updated {formatUpdatedAt(legalPage.updatedAt)}
          </span>
        </div>

        {/* Privacy */}
        <div className={styles.block} id="privacy">
          <h1 className={styles.blockTitle}>
            Privacy <span className={styles.ja} lang="ja">プライバシーポリシー</span>
          </h1>
          {privacyPolicySections.map((s) => (
            <div className={styles.section} key={s.id} id={s.id}>
              <h2 className={styles.sectionHeading} lang="ja">
                {s.heading}
              </h2>
              <div className={styles.sectionBody} lang="ja">
                {s.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {s.contact ? (
                  <div className={styles.contactLinks}>
                    <Link className={styles.contactLink} href={s.contact.formHref}>
                      {s.contact.formLabel} →
                    </Link>
                    <a
                      className={styles.contactLink}
                      href={`mailto:${s.contact.email}`}
                    >
                      {s.contact.email}
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        {/* 特商法 */}
        <div className={styles.block} id="tokusho">
          <h1 className={styles.blockTitle}>
            Commerce <span className={styles.ja} lang="ja">特定商取引法に基づく表記</span>
          </h1>
          <div className={styles.fields} lang="ja">
            {tokushoFields.map((f) => (
              <div className={styles.field} key={f.label}>
                <div className={styles.fieldLabel}>{f.label}</div>
                <div className={styles.fieldValue}>{f.value}</div>
              </div>
            ))}
          </div>
          <div className={styles.notes} lang="ja">
            {tokushoNotes.map((n, i) => (
              <p key={i}>{n}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
