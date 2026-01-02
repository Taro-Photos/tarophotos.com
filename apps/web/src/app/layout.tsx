import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Taro Photos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
