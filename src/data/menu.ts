export type CategoryId = "shawarma" | "hotdogs" | "burgers" | "snacks" | "drinks";

export type Variant = { id: string; label: string; price: number };

export type MenuItem = {
  id: string;
  category: CategoryId;
  name: string;
  description?: string;
  price?: number;
  variants?: Variant[];
};

export type Addon = {
  id: string;
  label: string;
  price: number;
  categories: CategoryId[];
};

export type DeliveryZone = "stryi" | "near" | "far";

export const CATEGORIES: { id: CategoryId; title: string }[] = [
  { id: "shawarma", title: "Шаурма" },
  { id: "hotdogs", title: "Хот-доги" },
  { id: "burgers", title: "Бургери" },
  { id: "snacks", title: "Снеки" },
  { id: "drinks", title: "Напої" },
];

export const ZONES: Record<DeliveryZone, { label: string }> = {
  stryi: { label: "Стрий" },
  near: { label: "Дуліби, Добряни, Грабівці" },
  far: { label: "Нежухів та дальні села" },
};

const meat = (chicken: number, mix: number, beef: number): Variant[] => [
  { id: "chicken", label: "Курка", price: chicken },
  { id: "mix", label: "Мікс", price: mix },
  { id: "beef", label: "Яловичина", price: beef },
];

const bunOrLavash = (bun: number, lavash: number): Variant[] => [
  { id: "bun", label: "Булка", price: bun },
  { id: "lavash", label: "Лаваш", price: lavash },
];

export const MENU: MenuItem[] = [
  {
    id: "shawarma-classic",
    category: "shawarma",
    name: "Класична",
    description: 'Лаваш "durum", часниковий соус, кетчуп, овочі, м\'ясо на вибір',
    variants: meat(149, 209, 229),
  },
  {
    id: "shawarma-cheese",
    category: "shawarma",
    name: "Сирна",
    description: 'Лаваш "durum", сир, часниковий соус, кетчуп, овочі, м\'ясо на вибір',
    variants: meat(179, 219, 259),
  },
  {
    id: "shawarma-arab",
    category: "shawarma",
    name: "Арабська",
    description:
      "Арабський лаваш, обсмажений на часниковому маслі, східний соус, овочі, м'ясо на вибір",
    variants: meat(179, 219, 259),
  },
  {
    id: "shawarma-arab-cheese",
    category: "shawarma",
    name: "Арабська з сиром",
    description:
      "Арабський лаваш, обсмажений на часниковому маслі, східний соус, овочі, м'ясо на вибір, сир чеддер",
    variants: meat(189, 219, 269),
  },
  {
    id: "shawarma-kebab-bro",
    category: "shawarma",
    name: "Кебаб Бро",
    description:
      'Лаваш "durum", овочі, часниковий соус, кетчуп, подвійна порція м\'яса, картопля фрі, сир чеддер',
    variants: meat(219, 259, 309),
  },
  {
    id: "shawarma-xxxl",
    category: "shawarma",
    name: "XXXL",
    description:
      'Лаваш "durum", овочі, часниковий соус, кетчуп, багато м\'яса та сиру, картопля фрі',
    variants: meat(309, 399, 459),
  },

  {
    id: "hotdog-classic",
    category: "hotdogs",
    name: "Класичний",
    description:
      "Булочка бріош, філейна сосиска, салат коул-слоу, кетчуп, американська гірчиця, трюфельний соус, цибуля кріспі",
    variants: [
      { id: "bun", label: "Булка", price: 99 },
      { id: "lavash", label: "Лаваш", price: 119 },
    ],
  },
  {
    id: "hotdog-bavaria",
    category: "hotdogs",
    name: "Баварія",
    description:
      "Булочка бріош, баварська сосиска, айсберг, трюфельний соус, маринований огірок та цибуля, помідор, американська гірчиця, цибуля кріспі",
    variants: bunOrLavash(124, 144),
  },
  {
    id: "hotdog-cheese",
    category: "hotdogs",
    name: "Сирний",
    description:
      "Булочка бріош, кетчуп, сир чеддер, дюссельдорфська сосиска, айсберг, маринований огірок та цибуля, помідор, сирний соус, цибуля кріспі",
    variants: bunOrLavash(139, 159),
  },
  {
    id: "hotdog-bro",
    category: "hotdogs",
    name: "Хот-Бро",
    description:
      "Підсмажена до скоринки булочка бріош, часниковий соус, кетчуп, айсберг, м'ясо, маринований огірок та цибуля, цибуля кріспі",
    variants: bunOrLavash(139, 199),
  },
  {
    id: "hotdog-lavash",
    category: "hotdogs",
    name: "Хот-дог в лаваші",
    description:
      'Лаваш "durum", соуси, сосиска, пекінська капуста, маринований огірок та цибуля, помідор, цибуля кріспі',
    variants: bunOrLavash(99, 119),
  },
  {
    id: "hotdog-french",
    category: "hotdogs",
    name: "Французький",
    description: "Пшенична булочка, сосиска та соусина на вибір",
    variants: bunOrLavash(79, 89),
  },

  {
    id: "burger-cheese-classic",
    category: "burgers",
    name: "Чізбургер класичний",
    description:
      "Булочка бріош, котлета з яловичини, сир чеддер, кетчуп, біла маринована цибуля та огірок, американська гірчиця",
    price: 129,
  },
  {
    id: "burger-double-cheese",
    category: "burgers",
    name: "Дабл Чіз класичний",
    description:
      "Булочка бріош, дві котлети з яловичини, сир чеддер, кетчуп, біла маринована цибуля та огірок, американська гірчиця",
    price: 179,
  },
  {
    id: "burger-turkey",
    category: "burgers",
    name: "Бургер з індичкою",
    description:
      "Булочка бріош, дві індичі котлети, сир чеддер, суміш італійських салатів, вершково-часниковий соус, помідор, слайси бекону, маринований огірок та цибуля",
    price: 259,
  },
  {
    id: "burger-bro",
    category: "burgers",
    name: "Бургер Бро",
    description:
      "Булочка бріош, котлета з яловичини, трюфельний соус, сир чеддер, моцарела, слайси бекону, маринований огірок та цибуля, помідор, айсберг",
    price: 269,
  },
  {
    id: "burger-cheesy-bro",
    category: "burgers",
    name: "Сирний Бро",
    description:
      "Булочка бріош, котлета з яловичини, трюфельний соус, сирний соус, три види сиру: моцарела, чеддер, дор-блю, айсберг, маринований огірок та цибуля, помідор",
    price: 289,
  },
  {
    id: "burger-mega-bro",
    category: "burgers",
    name: "Мега Бро",
    description:
      'Булочка бріош, мікс салатів, трюфельний соус, соус "BBQ", три котлети з яловичини (600 г), багато сиру чеддер та бекону, маринований огірок та цибуля, помідор, сирний соус, цибуля кріспі',
    price: 459,
  },
  {
    id: "burger-smash",
    category: "burgers",
    name: "Smash Burger",
    description:
      "Булочка бріош, новий пікантний соус з релішом, аж 6 слайсів чеддеру, 3 smash-котлети з яловичини, карамелізована цибуля, мариновані огірочки",
    price: 259,
  },

  {
    id: "snack-wings-cheese",
    category: "snacks",
    name: "Курячі крильця в сирному соусі",
    description: "Новинка: хрусткі крильця під сирним соусом",
    variants: [
      { id: "6", label: "6 шт", price: 189 },
      { id: "9", label: "9 шт", price: 239 },
    ],
  },
  {
    id: "snack-cheese-fries",
    category: "snacks",
    name: "Картопляні діпи під сирним соусом з беконом",
    price: 144,
  },

  { id: "drink-cola-05", category: "drinks", name: "Coca-Cola / Fanta / Sprite 0,5 л", price: 49 },
  { id: "drink-rich-05", category: "drinks", name: "Сік Rich 0,5 л", price: 50 },
  { id: "drink-rich-02", category: "drinks", name: "Сік Rich 0,2 л", price: 30 },
  { id: "drink-capri-02", category: "drinks", name: "Capri-Sun 0,2 л", price: 35 },
  { id: "drink-ayran-02", category: "drinks", name: "Айран 0,2 л", price: 39 },
  { id: "drink-bonaqua-05", category: "drinks", name: "Мінеральна вода Бонаква 0,5 л", price: 30 },
  { id: "drink-can-033", category: "drinks", name: "Schweppes / Coca-Cola (банка 0,33 л)", price: 49 },
];

const FOOD: CategoryId[] = ["shawarma", "hotdogs", "burgers"];

export const ADDONS: Addon[] = [
  { id: "bacon", label: "Бекон", price: 40, categories: FOOD },
  { id: "egg", label: "Яйце", price: 29, categories: FOOD },
  { id: "cheddar", label: "Сир чеддер", price: 40, categories: FOOD },
  { id: "mozzarella", label: "Сир моцарела", price: 40, categories: FOOD },
  { id: "dorblu", label: "Сир дорблю", price: 40, categories: FOOD },
  { id: "patty-100", label: "Котлета 100 г", price: 60, categories: FOOD },
  { id: "patty-200", label: "Котлета 200 г", price: 90, categories: FOOD },
  { id: "meat-chicken", label: "М'ясо 50 г, курка", price: 60, categories: FOOD },
  { id: "meat-veal", label: "М'ясо 50 г, телятина", price: 90, categories: FOOD },
  { id: "sauce", label: "Соус", price: 30, categories: FOOD },
  { id: "menu-plus", label: "Меню+ (картопля фрі, соус, напій)", price: 109, categories: FOOD },
];

export function findItem(id: string): MenuItem | undefined {
  return MENU.find((i) => i.id === id);
}
