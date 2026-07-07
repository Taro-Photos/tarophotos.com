import { ContactForm } from "@/components/contact/ContactForm";
import { contactChannels } from "@/app/_content/booking";
import { primaryContactEmail } from "@/app/_content/contact";
import styles from "./ContactPage.module.css";

/**
 * Contact — 問い合わせフォームの専用ページ（旧フッター内フォームを移植）。
 * フォーム本体（ContactForm）＋メール / Instagram の代替チャネルを併置。
 */
export function ContactPage() {
  return (
    <section className={styles.contact}>
      <div className="ds-wrap">
        <header className={styles.head}>
          <span className={styles.eyebrow}>Contact</span>
          <h1 className={styles.title}>
            Get in touch
            <span className={styles.titleJa} lang="ja">
              お問い合わせ
            </span>
          </h1>
          <p className={styles.lede}>
            Prints, commissions, and editorial.
            <span className={styles.ledeJa} lang="ja">
              作品・撮影・寄稿のご相談は、こちらから。2 日以内にご返信します。
            </span>
          </p>
        </header>

        <div className={styles.grid}>
          <div className={styles.formCol}>
            <ContactForm fallbackEmail={primaryContactEmail} />
          </div>

          <aside className={styles.channels}>
            <div className={styles.channelsLabel}>Other ways</div>
            <ul className={styles.channelList}>
              {contactChannels.map((channel) => (
                <li key={channel.label} className={styles.channel}>
                  <a
                    className={styles.channelLink}
                    href={channel.href}
                    {...(channel.href.startsWith("http")
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                  >
                    {channel.label}
                  </a>
                  <p className={styles.channelDesc} lang="ja">
                    {channel.description}
                  </p>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
