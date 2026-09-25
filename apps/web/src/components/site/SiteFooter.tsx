import Link from "next/link";
import { footerLegalLinks, siteOperator } from "@/app/_content/site";
import { instagramPrimaryAccount } from "@/app/_content/socials";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
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
                <a href={instagramPrimaryAccount.href} target="_blank" rel="noreferrer">
                  Instagram
                </a>
                <Link href="/works">Index</Link>
              </div>
            </div>
            <div className={styles.contact}>
              <div className={styles.label}>Get in touch</div>
              <Link className={styles.contactCta} href="/contact">
                Contact
                <span className={styles.contactCtaJa} lang="ja">
                  お問い合わせ
                </span>
                <span className={styles.contactArrow} aria-hidden>
                  →
                </span>
              </Link>
            </div>
          </div>
          <hr className="ds-hair" />
          <div className={styles.base}>
            <span>
              © 2026 Taro Shirai · Operated by{" "}
              <a href={siteOperator.url} target="_blank" rel="noreferrer">
                {siteOperator.nameEn}
              </a>
              {footerLegalLinks.map((link) => (
                <span key={link.href}>
                  {" · "}
                  <Link href={link.href} lang="ja">
                    {link.label}
                  </Link>
                </span>
              ))}
            </span>
            <span>Tokyo, Japan · 35.68° N, 139.76° E</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
