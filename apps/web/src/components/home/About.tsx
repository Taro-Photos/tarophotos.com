import Image from "next/image";
import styles from "./About.module.css";

export function About() {
  return (
    <section className={styles.about} id="about">
      <hr className={styles.rule} />
      <div className="ds-wrap">
        <div className={styles.inner}>
          <div className={styles.grid}>
            <figure className={styles.portrait}>
              <Image
                src="/profile/profile.jpg"
                alt="Taro Shirai on a ridge with a telephoto lens"
                fill
                sizes="(max-width: 900px) 360px, 420px"
              />
            </figure>

            <div className={styles.text}>
              <span className={styles.eyebrow}>About</span>
              <p className={styles.lede}>
                I photograph what is <em>overlooked</em>, and wait for it to look
                back. <span className={styles.ja} lang="ja">見過ごされたものを、迎えにいく。</span>
              </p>
              <p className={styles.body}>
                Based in Tokyo, I work mostly at the threshold — dawn, afterglow,
                the band where one thing becomes another. The encounter happens
                there. <span className={styles.ja} lang="ja">出会いは、いつも閾（しきい）で起きる。</span>
              </p>
              <p className={styles.body}>
                What I want to show is not the surface but the <em>background</em>{" "}
                behind it — the world, the story, and the empty space that belongs
                to whoever is looking.{" "}
                <span className={styles.ja} lang="ja">
                  綺麗さではなく、その奥にある背景と、観る人それぞれの想いが宿る余白を。
                </span>
              </p>

              <div className={styles.credo}>
                <div>
                  <div className={styles.k}>Verb</div>
                  <div className={styles.v}>
                    Encounter <span className={styles.ja} lang="ja">／ 出会う</span>
                  </div>
                </div>
                <div>
                  <div className={styles.k}>Practice</div>
                  <div className={styles.v}>
                    Wait <span className={styles.ja} lang="ja">／ 待つ</span>
                  </div>
                </div>
                <div>
                  <div className={styles.k}>Offer</div>
                  <div className={styles.v}>
                    Space <span className={styles.ja} lang="ja">／ 余白</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
