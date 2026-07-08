import styles from "./ConceptPage.module.css";

/**
 * Concept — サイトの核となる考えを述べる 1 ページ。
 * 「時（流れ続ける悠久の時間）」と「瞬間（切り取られた一枚）」の境目を撮る、という着想。
 * EN 主導・和字は明朝のアクセント（DS のバイリンガル規約）。
 */
export function ConceptPage() {
  return (
    <article className={styles.concept}>
      <div className="ds-wrap">
        <header className={styles.head}>
          <span className={styles.eyebrow}>Concept</span>
          <h1 className={styles.title}>
            Time passes.
            <span className={styles.line2}>One frame stays.</span>
          </h1>
          <p className={styles.tagJa} lang="ja">
            時と瞬間の、境目を。
          </p>
        </header>

        <div className={styles.body}>
          <section className={styles.movement}>
            <p className={styles.lede}>
              A photograph captures a moment. But a moment is cut from something
              larger — time itself, flowing on without pause, the long unbroken
              present we are always inside of.
            </p>
            <p className={styles.ja} lang="ja">
              写真は、一瞬をとらえる。けれどその一瞬は、もっと大きなものから切り取られている
              —— 止まることなく流れ続ける時、私たちがいつもその中にいる、途切れない現在から。
            </p>
          </section>

          <section className={styles.movement}>
            <p className={styles.p}>
              A photograph lifts one frame out of that flow and holds it still,
              with everything it carries. What I look for is the seam between the
              two — the instant the current becomes a moment.
            </p>
            <p className={styles.ja} lang="ja">
              写真は、その流れから一枚をすくい上げ、想いごと静止させる。私がとらえたいのは、
              そのあいだにある境目 —— 流れる時が、ひとつの瞬間へと切り替わる、その継ぎ目そのものだ。
            </p>
          </section>

          <hr className={styles.rule} />

          <section className={styles.movement}>
            <p className={styles.p}>
              Dawn is that seam, made visible: night becoming day, once, and never
              the same way again. I go to where the switch happens, and wait.
            </p>
            <p className={styles.ja} lang="ja">
              夜明けもまた、目に見える境目だ。夜が朝へと変わる、ただ一度きりの、二度と同じではない
              切り替わり。その切り替わる場所へ行って、待つ。
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
