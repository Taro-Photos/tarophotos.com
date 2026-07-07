import Image from "next/image";
import { HERO_IMAGE } from "./featured-series";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className="ds-wrap">
        <div className={styles.head}>
          <div className={styles.headMain}>
            <h1 className={styles.title}>
              Taro Shirai
              <span className={styles.line2}>Time passes. One frame stays.</span>
            </h1>
            <p className={styles.tagJa} lang="ja">時と瞬間の、境目を。</p>
          </div>
          <div className={styles.ja}>
            <span lang="ja">風景写真家</span>
            <small lang="en">Tokyo / since 2016</small>
          </div>
        </div>

        <div className={styles.frame}>
          <div className={styles.aside}>
            <p>
              I go out to <em>meet</em> the overlooked —{" "}
              <span className={styles.jaInline} lang="ja">迎えにいって、待つ。</span>
            </p>
            <div className={styles.meta}>
              <span className={styles.metaLabel}>Latest</span>
              <span className={styles.metaVal}>
                First Light
                <span className={styles.jaInline} lang="ja"> ／ 初日の出</span>
              </span>
            </div>
          </div>

          <figure className={styles.figure}>
            <Image
              src={HERO_IMAGE}
              alt="Diamond Fuji — first light cresting the summit over Hiizuru-no-Sato"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 820px"
            />
            <figcaption className={styles.figcaption}>
              <div className={styles.cap}>07:24 — 日出づる里, first light on the summit</div>
              <div className={styles.capJa} lang="ja">
                山頂に太陽が重なる、一年最初の光。
              </div>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
