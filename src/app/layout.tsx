import type { Metadata } from "next";
import "@rankingcoach/vanguard/style.css";
import "../../direct-channel.css";

export const metadata: Metadata = {
  title: "rankingCoach",
  description: "rankingCoach - Your digital marketing solution",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
