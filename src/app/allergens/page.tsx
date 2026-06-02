import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { MENU } from "@/lib/site";

export const metadata: Metadata = {
  title: "Allergens & Nutrition",
  description:
    "Allergen and calorie information for every BurgerHouse dish. Always tell our team about allergies before ordering.",
  alternates: { canonical: "/allergens" },
};

export default function AllergensPage() {
  return (
    <>
      <PageHeader
        eyebrow="Eat informed"
        title="Allergens & Nutrition"
        subtitle="Calorie counts are approximate. Please tell our team about any allergy before ordering."
      />
      <section className="bg-ink pb-28 sm:pb-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-8 rounded-2xl border border-gold/30 bg-gold/5 p-4 text-sm text-sand">
            Our kitchen handles gluten, dairy, egg, soy, nuts, mustard and sesame. We take care,
            but we can&rsquo;t guarantee zero cross-contact. All beef is halal-certified Angus.
          </div>

          <div className="space-y-10">
            {MENU.map((cat) => (
              <div key={cat.id}>
                <h2 className="mb-3 flex items-center gap-3 font-display text-2xl text-cream">
                  <span className="text-gold">{cat.index}</span> {cat.title}
                </h2>
                <div className="overflow-hidden rounded-2xl border border-line">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-char text-xs uppercase tracking-widest text-muted">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Item</th>
                        <th className="px-4 py-3 font-semibold">Allergens</th>
                        <th className="px-4 py-3 text-right font-semibold">kcal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {cat.items.map((item) => (
                        <tr key={item.slug} className="text-sand">
                          <td className="px-4 py-3 font-medium text-cream">{item.name}</td>
                          <td className="px-4 py-3 text-muted">
                            {item.allergens && item.allergens.length > 0
                              ? item.allergens.join(", ")
                              : "None major"}
                          </td>
                          <td className="px-4 py-3 text-right text-muted">
                            {item.calories ?? "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
