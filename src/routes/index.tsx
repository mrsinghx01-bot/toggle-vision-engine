import { createFileRoute } from "@tanstack/react-router";

import { Cursor } from "@/components/Cursor";
import { EasterEgg } from "@/components/EasterEgg";
import { Footer } from "@/components/Footer";
import { Loader } from "@/components/Loader";
import { Nav } from "@/components/Nav";
import { TechBackground } from "@/components/TechBackground";
import { Beyond } from "@/sections/Beyond";
import { FinalCta } from "@/sections/FinalCta";
import { Future } from "@/sections/Future";
import { Hero } from "@/sections/Hero";
import { Name } from "@/sections/Name";
import { PcbViewer } from "@/sections/PcbViewer";
import { Problem } from "@/sections/Problem";
import { Roadmap } from "@/sections/Roadmap";
import { Team } from "@/sections/Team";
import { Technology } from "@/sections/Technology";
import { Transform } from "@/sections/Transform";
import { Vision } from "@/sections/Vision";
import { Why } from "@/sections/Why";
import { Workflow } from "@/sections/Workflow";
import { site } from "@/lib/site";

const TITLE = "Toggle — AI-Powered Hardware Design";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: site.description },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: site.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: site.description },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Toggle",
          description: site.description,
          url: "/",
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative">
      <Loader />
      <TechBackground />
      <Cursor />
      <EasterEgg />
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Vision />
        <Workflow />
        <Transform />
        <PcbViewer />
        <Why />
        <Name />
        <Technology />
        <Beyond />
        <Future />
        <Roadmap />
        <Team />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
