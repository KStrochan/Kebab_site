import { CartButton } from "@/components/CartButton";
import { CartDrawer } from "@/components/CartDrawer";
import { Hero } from "@/components/Hero";
import { InfoSection } from "@/components/InfoSection";
import { Marquee } from "@/components/Marquee";
import { MenuSection } from "@/components/MenuSection";

export default function Home() {
  return (
    <>
      <div className="scroll-progress" aria-hidden="true" />
      <Hero />
      <Marquee />
      <MenuSection />
      <InfoSection />
      <CartButton />
      <CartDrawer />
    </>
  );
}
