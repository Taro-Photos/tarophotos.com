// design-sync shim: next/image → a plain <img>. The design agent builds apps
// with real <img>; Next's optimizer isn't available in the render environment.
// Handles string src, static-import objects, and `fill` layout.
import * as React from "react";

type StaticImg = { src: string; height?: number; width?: number; blurDataURL?: string };

type Props = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string | StaticImg;
  alt?: string;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  loader?: unknown;
  placeholder?: string;
  blurDataURL?: string;
  unoptimized?: boolean;
  sizes?: string;
};

export default function Image({
  src,
  alt = "",
  fill,
  priority,
  quality,
  loader,
  placeholder,
  blurDataURL,
  unoptimized,
  sizes,
  style,
  ...rest
}: Props) {
  const raw = typeof src === "string" ? src : src?.src;
  // The site's real photos live at runtime `/…` paths the design environment
  // doesn't serve — a broken <img> shows the browser glyph + alt text. Swap any
  // src that isn't a self-contained data:/http URL for a paper-toned block that
  // actually loads, so every image cell reads as a clean, intentional frame.
  // (The design agent supplies real data:/https images, which pass through.)
  const PLACEHOLDER =
    "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='4'%20height='3'%3E%3Crect%20width='4'%20height='3'%20fill='%23ece5da'/%3E%3C/svg%3E";
  const url = raw && /^(data:|https?:)/.test(raw) ? raw : PLACEHOLDER;
  const frame: React.CSSProperties = {
    backgroundColor: "var(--color-paper-deep, #f1ece4)",
    color: "transparent",
  };
  const fillStyle: React.CSSProperties = fill
    ? {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        ...frame,
        ...(style as React.CSSProperties),
      }
    : { ...frame, ...(style as React.CSSProperties) };
  return <img src={url} alt={alt} sizes={sizes} style={fillStyle} {...rest} />;
}
