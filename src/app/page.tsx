import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import ChefSpecialBanner from "@/components/sections/ChefSpecialBanner";
import Signature from "@/components/sections/Signature";
import BurgerBuilder from "@/components/sections/BurgerBuilder";
import MenuTeaser from "@/components/sections/MenuTeaser";
import Story from "@/components/sections/Story";
import WhyBurgerHouse from "@/components/sections/WhyBurgerHouse";
import GallerySection from "@/components/sections/GallerySection";
import Reviews from "@/components/sections/Reviews";
import Visit from "@/components/sections/Visit";
import ScrollSpyNav from "@/components/chrome/ScrollSpyNav";

const SPY = [
  { id: "signature", label: "Signatures" },
  { id: "builder", label: "Build" },
  { id: "menu", label: "Menu" },
  { id: "story", label: "Story" },
  { id: "gallery", label: "Gallery" },
  { id: "reviews", label: "Reviews" },
  { id: "visit", label: "Visit" },
];

export default function Home() {
  return (
    <>
      <ScrollSpyNav sections={SPY} />
      <Hero />
      <Marquee />
      <ChefSpecialBanner />
      <Signature />
      <BurgerBuilder />
      <MenuTeaser />
      <Story />
      <WhyBurgerHouse />
      <GallerySection />
      <Reviews />
      <Visit />
    </>
  );
}
