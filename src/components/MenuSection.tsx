import { CATEGORIES, MENU } from "@/data/menu";
import { CategoryIcon } from "./CategoryIcon";
import { CategoryNav } from "./CategoryNav";
import { ItemCard } from "./ItemCard";
import { Reveal } from "./Reveal";
import { SectionTitle } from "./SectionTitle";

export function MenuSection() {
  return (
    <section id="menu" tabIndex={-1} className="relative bg-bg outline-none">
      <div className="sticky top-0 z-20 border-b border-line bg-bg-deep/90 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.9)] backdrop-blur-md">
        <CategoryNav />
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-6 pt-14 sm:pt-20">
        <Reveal>
          <SectionTitle kicker="Наше меню">Меню</SectionTitle>
        </Reveal>

        {CATEGORIES.map((c) => (
          <div key={c.id} id={`cat-${c.id}`} className="mt-14 scroll-mt-20 sm:mt-20">
            <Reveal>
              <div className="mb-6 flex items-center gap-4">
                <CategoryIcon id={c.id} />
                <h3 className="text-3xl text-gold">{c.title}</h3>
                <span className="h-px flex-1 bg-gradient-to-r from-gold/50 to-transparent" aria-hidden="true" />
              </div>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {MENU.filter((i) => i.category === c.id).map((item, index) => (
                <Reveal key={item.id} delay={Math.min(index, 5) * 70} className="flex">
                  <ItemCard item={item} />
                </Reveal>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
