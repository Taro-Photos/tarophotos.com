import Link from "next/link";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className="ds-wrap">
        <div className={styles.inner}>
          <Link className={styles.mark} href="/" aria-label="Taro Shirai — home">
            <span lang="en">TARO SHIRAI</span>
            <span className={styles.sub} lang="ja">
              白井 悠太郎
            </span>
          </Link>
          <nav className={styles.nav} aria-label="Primary">
            <a href="#series">Series</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </div>
    </header>
  );
}
