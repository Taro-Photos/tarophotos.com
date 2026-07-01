import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const alt = "Taro Shirai — Landscape Photography, Tokyo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#F7F4EF";
const INK = "#1A1A1A";
const WARM = "#6B6157";
const HAIR = "#E2DCD2";

const fontLight = readFileSync(join(process.cwd(), "src/app/_og/CormorantGaramond-Light.woff"));
const fontMedium = readFileSync(join(process.cwd(), "src/app/_og/CormorantGaramond-Medium.woff"));

// Serif "T" monogram (ink, no background) — mirrors src/app/icon.svg.
const T_MARK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><g fill='${INK}'>` +
      `<rect x='15' y='17' width='34' height='4.6'/>` +
      `<rect x='15' y='17' width='3.2' height='8'/>` +
      `<rect x='45.8' y='17' width='3.2' height='8'/>` +
      `<rect x='29.5' y='17' width='5' height='27.5'/>` +
      `<rect x='23.5' y='44.5' width='17' height='4.4'/>` +
      `</g></svg>`,
  );

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          padding: "88px 100px",
          fontFamily: "Cormorant",
        }}
      >
        <img src={T_MARK} width={82} height={82} alt="" />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 138,
              fontWeight: 300,
              color: INK,
              lineHeight: 1,
              letterSpacing: "-0.01em",
            }}
          >
            Taro Shirai
          </div>
          <div
            style={{
              marginTop: 30,
              fontSize: 30,
              fontWeight: 500,
              color: WARM,
              letterSpacing: "0.34em",
              textTransform: "uppercase",
            }}
          >
            Landscape Photography · Tokyo
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: `1px solid ${HAIR}`,
            paddingTop: 26,
            fontSize: 26,
            fontWeight: 500,
            color: WARM,
            letterSpacing: "0.12em",
          }}
        >
          <span>tarophotos.com</span>
          <span style={{ fontWeight: 300, letterSpacing: "0.04em" }}>
            landscape, at the threshold
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cormorant", data: fontLight, weight: 300, style: "normal" },
        { name: "Cormorant", data: fontMedium, weight: 500, style: "normal" },
      ],
    },
  );
}
