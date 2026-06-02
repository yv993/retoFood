import { Reveal } from "@/components/motion/primitives";

/** Inner-page header with top padding to clear the fixed navbar. */
export default function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink pb-12 pt-32 sm:pb-16 sm:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[40vh] w-[60vh] -translate-x-1/2"
      >
        <div className="aurora h-full w-full opacity-60" />
      </div>
      <div className="relative mx-auto max-w-content px-4 text-center sm:px-6">
        <Reveal>
          <p className="eyebrow text-gold">{eyebrow}</p>
          <h1 className="mt-3 font-display text-5xl font-bold tracking-tightish text-cream sm:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto mt-5 max-w-2xl text-lg text-sand">{subtitle}</p>
          )}
          <div className="gold-rule mx-auto mt-6 h-px w-24" />
        </Reveal>
      </div>
    </section>
  );
}
