import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { Reveal } from "@/components/motion/primitives";
import GalleryGrid from "@/components/ui/GalleryGrid";
import InstagramGrid from "@/components/sections/InstagramGrid";
import { GALLERY } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Straight off the grill — a gallery of BurgerHouse's signature burgers, sides and the open kitchen in Yerevan.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Feed"
        title="Straight off the grill"
        subtitle="Tap any photo to view it full-size. Then come taste the real thing."
      />
      <section className="bg-ink pb-28 sm:pb-32">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <Reveal>
            <GalleryGrid images={GALLERY} variant="full" />
          </Reveal>
        </div>
      </section>

      <InstagramGrid />
    </>
  );
}
