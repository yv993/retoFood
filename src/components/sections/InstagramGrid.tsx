import SafeImage from "@/components/ui/SafeImage";
import { GALLERY, SITE, unsplash, BLUR } from "@/lib/site";
import { Reveal } from "@/components/motion/primitives";
import { Instagram } from "@/components/ui/icons";

/** Instagram-style grid pulling from GALLERY, with hover zoom + Follow link. */
export default function InstagramGrid() {
  const shots = GALLERY.slice(0, 8);

  return (
    <section className="relative bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <Reveal className="mb-12 flex flex-col items-center gap-4 text-center">
          <p className="eyebrow text-gold">@burgerhouse.am</p>
          <h2 className="font-display text-4xl font-bold tracking-tightish text-cream sm:text-5xl">
            From our kitchen to your feed
          </h2>
          <a
            href={SITE.contact.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all duration-200"
          >
            <Instagram width={18} height={18} /> Follow us
          </a>
        </Reveal>

        <Reveal>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {shots.map((img) => (
              <a
                key={img.id}
                href={SITE.contact.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="zoom group relative aspect-square overflow-hidden rounded-2xl border border-line"
                aria-label="View on Instagram"
              >
                <SafeImage
                  src={unsplash(img.id, 700)}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  placeholder="blur"
                  blurDataURL={BLUR}
                  className="object-cover"
                />
                <span className="absolute inset-0 grid place-items-center bg-ink/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Instagram width={26} height={26} className="text-cream" />
                </span>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
