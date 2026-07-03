import Link from "next/link";
import { Eyebrow } from "@/design-system";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className="ds-wrap">
        <div className={styles.inner}>
          <Eyebrow className={styles.eyebrow}>Error 404</Eyebrow>

          <h1 className={styles.title}>
            Off the path
            <span className={styles.line2}>out of frame</span>
          </h1>

          <p className={styles.ja} lang="ja">
            その径は、まだ写されていない。
          </p>

          <p className={styles.lede}>
            The page you were looking for has drifted out of frame. Nothing was lost —
            it simply isn&rsquo;t here.
          </p>

          <hr className="ds-hair" />

          <nav className={styles.links} aria-label="404 navigation">
            <Link className={styles.link} href="/">
              Return home
            </Link>
            <Link className={styles.link} href="/works">
              The work
            </Link>
          </nav>
        </div>
      </div>
    </main>
  );
}
