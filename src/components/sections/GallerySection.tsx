import { GALLERY, SITE } from "@/lib/site";
import { Reveal } from "@/components/motion/primitives";
import GalleryGrid from "@/components/ui/GalleryGrid";

export default function GallerySection() {
  const preview = GALLERY.slice(0, 6);

  return (
    <section id="gallery" className="relative border-y border-line bg-char py-24 sm:py-32">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <Reveal className="mb-14 flex flex-col items-end justify-between gap-6 sm:flex-row">
          <div>
            <p className="eyebrow text-gold">The Feed</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tightish text-cream sm:text-5xl">
              Straight off the grill
            </h2>
          </div>
          <a
            href={SITE.contact.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="navlink text-sm text-sand hover:text-cream"
          >
            Follow @burgerhouse.am
          </a>
        </Reveal>

        <Reveal>
          <GalleryGrid images={preview} variant="preview" />
        </Reveal>
      </div>
    </section>
  );
}
