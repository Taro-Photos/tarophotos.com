// design-sync shim: next/link → a plain <a>. Client-side routing isn't
// available in the render environment; hrefs render as ordinary links.
import * as React from "react";

type Props = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string | { pathname?: string; href?: string };
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  passHref?: boolean;
  legacyBehavior?: boolean;
  locale?: string | false;
};

export default function Link({
  href,
  prefetch,
  replace,
  scroll,
  shallow,
  passHref,
  legacyBehavior,
  locale,
  children,
  ...rest
}: Props) {
  const h = typeof href === "string" ? href : href?.pathname ?? href?.href ?? "#";
  return (
    <a href={h} {...rest}>
      {children}
    </a>
  );
}
