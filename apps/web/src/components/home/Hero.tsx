import Image from "next/image";
import { HERO_IMAGE } from "./featured-series";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className="ds-wrap">
        <div className={styles.head}>
          <h1 className={styles.title}>
            Taro Shirai
            <span className={styles.line2}>landscape, at the threshold</span>
          </h1>
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
                <span className={styles.jaInline} lang="ja"> ／ 軒の閾</span>
              </span>
            </div>
          </div>

          <figure className={styles.figure}>
            <Image
              src={HERO_IMAGE}
              alt="First light on old roof tiles at Takaori before dawn"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 820px"
            />
            <figcaption className={styles.figcaption}>
              <div className={styles.cap}>06:52 — 富士川町 髙下, eaves before the sun</div>
              <div className={styles.capJa} lang="ja">
                夜明け前、瓦に最初の温度
              </div>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
