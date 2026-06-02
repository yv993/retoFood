import { SITE } from "@/lib/site";
import MapEmbed from "@/components/ui/MapEmbed";
import OpenStatusChip from "@/components/ui/OpenStatusChip";
import { Pin, Clock, Phone } from "@/components/ui/icons";

/** Address / hours / phone card + lazy map. Shared by Home and /reserve. */
export default function VisitInfo({ className }: { className?: string }) {
  return (
    <div className={`space-y-6 ${className ?? ""}`}>
      <div className="rounded-3xl border border-line bg-ink p-7">
        <div className="mb-5">
          <OpenStatusChip />
        </div>
        <ul className="space-y-5 text-sm">
          <li className="flex gap-3">
            <Pin className="mt-0.5 shrink-0 text-gold" width={20} height={20} />
            <span>
              <span className="block font-semibold text-cream">Address</span>
              <span className="text-muted">{SITE.contact.addressLine}</span>
            </span>
          </li>
          <li className="flex gap-3">
            <Clock className="mt-0.5 shrink-0 text-gold" width={20} height={20} />
            <span>
              <span className="block font-semibold text-cream">Hours</span>
              <span className="text-muted">{SITE.contact.hoursDisplay}</span>
            </span>
          </li>
          <li className="flex gap-3">
            <Phone className="mt-0.5 shrink-0 text-gold" width={20} height={20} />
            <span>
              <span className="block font-semibold text-cream">Phone</span>
              <a
                href={`tel:${SITE.contact.phoneHref}`}
                className="text-muted hover:text-gold"
              >
                {SITE.contact.phoneDisplay}
              </a>
            </span>
          </li>
        </ul>
      </div>
      <MapEmbed />
    </div>
  );
}
