import { CATEGORIES, MENU } from "@/data/menu";
import { CategoryNav } from "./CategoryNav";
import { ItemCard } from "./ItemCard";
import { Ornament } from "./Ornament";

export function MenuSection() {
  return (
    <section id="menu" tabIndex={-1} className="bg-bg outline-none">
      <div className="sticky top-0 z-20 border-y border-line bg-bg-deep/95 backdrop-blur">
        <CategoryNav />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-12">
        <h2 className="text-center text-3xl text-gold">Меню</h2>
        <Ornament className="mt-4" />
        {CATEGORIES.map((c) => (
          <div key={c.id} id={`cat-${c.id}`} className="mt-10 scroll-mt-20 sm:mt-12">
            <h3 className="mb-4 text-2xl text-gold">{c.title}</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {MENU.filter((i) => i.category === c.id).map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
