import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";
import styles from "./SiteFooter.module.css";

const CONTACT_EMAIL = "hello@tarophotos.com";

export function SiteFooter() {
  return (
    <footer className={styles.footer} id="contact">
      <hr className={styles.rule} />
      <div className="ds-wrap">
        <div className={styles.inner}>
          <div className={styles.top}>
            <div className={styles.intro}>
              <div className={styles.mark}>
                Taro Shirai
                <span className={styles.markJa} lang="ja">
                  白井 悠太郎 ・ 風景写真家
                </span>
              </div>
              <p className={styles.lede}>
                Prints, commissions, and editorial — get in touch.
                <span className={styles.ledeJa} lang="ja">
                  作品・撮影・寄稿のご相談はこちらから。
                </span>
              </p>
              <div className={styles.social}>
                <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
                  Instagram
                </a>
                <Link href="/works">Index</Link>
              </div>
            </div>
            <div className={styles.contact}>
              <div className={styles.label}>Get in touch</div>
              <ContactForm fallbackEmail={CONTACT_EMAIL} />
            </div>
          </div>
          <hr className="ds-hair" />
          <div className={styles.base}>
            <span>© 2026 Taro Shirai · tarophotos.com</span>
            <span>Tokyo, Japan · 35.68° N, 139.76° E</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
