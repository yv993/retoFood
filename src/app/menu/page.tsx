import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import MenuExplorer from "@/components/sections/MenuExplorer";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "The full BurgerHouse menu — signature burgers, sides, craft drinks and dessert. Filter by category or dietary preference. Prices in Armenian Dram.",
  alternates: { canonical: "/menu" },
};

export default function MenuPage() {
  return (
    <>
      <PageHeader
        eyebrow="Eat & Drink"
        title="The full menu"
        subtitle="Smashed, flame-grilled and built to order. Filter by course or dietary preference."
      />
      <section className="bg-ink pb-28 sm:pb-32">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <MenuExplorer />
        </div>
      </section>
    </>
  );
}
