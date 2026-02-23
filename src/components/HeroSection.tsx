"use client";

import { Button, ButtonTypes, ButtonSizes } from "@rankingcoach/vanguard";

export default function HeroSection() {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        gap: "24px",
      }}
    >
      <h1 style={{ fontSize: "3rem", fontWeight: 700, margin: 0 }}>
        Welcome to rankingCoach
      </h1>
      <p style={{ fontSize: "1.25rem", color: "#555", maxWidth: "600px" }}>
        The all-in-one digital marketing solution for your business.
      </p>
      <Button
        type={ButtonTypes.primary}
        size={ButtonSizes.large}
        onClick={() => {
          /* TODO */
        }}
      >
        Get Started
      </Button>
    </section>
  );
}
