import { CartButton } from "@/components/CartButton";
import { CartDrawer } from "@/components/CartDrawer";
import { Hero } from "@/components/Hero";
import { InfoSection } from "@/components/InfoSection";
import { MenuSection } from "@/components/MenuSection";

export default function Home() {
  return (
    <>
      <Hero />
      <MenuSection />
      <InfoSection />
      <CartButton />
      <CartDrawer />
    </>
  );
}
