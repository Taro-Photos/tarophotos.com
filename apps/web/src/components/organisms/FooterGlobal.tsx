import Link from "next/link";
import { TrackedLink } from "@/components/atoms/TrackedLink";

export type FooterGlobalProps = {
  social: Array<{ label: string; href: string }>;
  legal: Array<{ label: string; href: string }>;
};

export function FooterGlobal({ social, legal }: FooterGlobalProps) {
  return (
    <footer className="page-container border-t border-[var(--color-border)] py-12 text-sm text-[var(--color-muted)] xl:py-16 2xl:text-base">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between 2xl:gap-16">
        <div className="flex flex-col gap-3 max-w-[56ch] 2xl:gap-4">
          <p className="text-xs uppercase tracking-[0.36em]">TARO PHOTOS</p>
          <p>
            静謐 / 余白 / 緊張と解放をテーマに、都市と自然の交差点で瞬間を伸張させるフォトグラフィーを制作しています。
          </p>
          <span className="text-xs 2xl:text-sm">© {new Date().getFullYear()} Taro Photos</span>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 xl:gap-10 2xl:gap-14">
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-[0.3em]">Follow</span>
            <ul className="space-y-2">
              {social.map((item) => (
                <li key={item.href}>
                  <TrackedLink
                    href={item.href}
                    className="transition-colors hover:text-[var(--color-accent)]"
                  >
                    {item.label}
                  </TrackedLink>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-[0.3em]">Legal</span>
            <ul className="space-y-2">
              {legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-[var(--color-accent)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
