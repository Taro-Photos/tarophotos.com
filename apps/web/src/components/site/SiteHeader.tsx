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
            <Link href="/#series">Series</Link>
            <Link href="/journal">Journal</Link>
            <Link href="/concept">Concept</Link>
            <Link href="/#about">About</Link>
            <Link href="/#contact">Contact</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
