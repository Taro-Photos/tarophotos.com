import { Hero } from "@/components/home/Hero";
import { SeriesIndex } from "@/components/home/SeriesIndex";

// ホームは軽い入口（ハブ）。About / Contact は独立ページ（/about・/contact）、
// 作品・随筆・コンセプトはナビから各ページへ。
export default function Home() {
  return (
    <>
      <Hero />
      <SeriesIndex />
    </>
  );
}
