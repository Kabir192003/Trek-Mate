import { img } from './img';
import type { Category, Collection, Product, Review, Address, PaymentMethod, Order } from './types';

export const CATEGORIES: Category[] = [
  { id: 'tents', name: 'Tents', blurb: 'Freestanding & trekking-pole shelters', img: 'photo-1526491109672-74740652b963' },
  { id: 'boots', name: 'Hiking Boots', blurb: 'Leather, mesh & mountaineering', img: 'photo-1648027286072-fb339b0d0c06' },
  { id: 'backpacks', name: 'Backpacks', blurb: 'Daypacks to multi-week carries', img: 'photo-1501555088652-021faa106b9b' },
  { id: 'sleep', name: 'Sleeping Bags', blurb: 'Down & synthetic, −20°F to 40°F', img: 'photo-1558477280-1bfed08ea5db' },
  { id: 'stoves', name: 'Stoves & Cook', blurb: 'Canister, liquid-fuel & cookware', img: 'photo-1522041350204-22285237eeca' },
  { id: 'bottles', name: 'Water Bottles', blurb: 'Insulated, filtered & collapsible', img: 'photo-1602143407151-7111542de6e8' },
  { id: 'winter', name: 'Winter Apparel', blurb: 'Down, shells & basecamp layers', img: 'photo-1572349618468-4e4208f41af2' },
  { id: 'optics', name: 'Glasses & Optics', blurb: 'Sunglasses, goggles & binoculars', img: 'photo-1699266784348-68f657f770c3' },
];

export const COLLECTIONS: Collection[] = [
  {
    id: 'winter-26',
    name: "Winter Capsule '26",
    subtitle: '38 essentials for cold-weather trekking',
    img: 'photo-1483921020237-2ff51e8e4b22',
    tag: 'Seasonal',
    categoryFilter: 'winter',
  },
  {
    id: 'thru-hike',
    name: 'Thru-Hike Kit',
    subtitle: 'Lightweight gear for multi-day routes',
    img: 'photo-1551632811-561732d1e306',
    tag: 'Curated',
  },
  {
    id: 'family',
    name: 'Family Basecamp',
    subtitle: 'Kid-tested, parent-approved',
    img: 'photo-1674230316788-d9c8b92f0d63',
    tag: 'New',
  },
];

export const PRODUCTS: Product[] = [
  // ── Tents ─────────────────────────────────────────────
  {
    id: 'p1', name: 'Ridgeline 2P Tent', brand: 'Sierra & Pine', cat: 'tents',
    price: 389, old: 449, rating: 4.8, reviews: 312,
    img: 'photo-1504280390367-361c6d9f38f4',
    gallery: ['photo-1504280390367-361c6d9f38f4', 'photo-1602079108581-4c5071154299', 'photo-1526491109672-74740652b963'],
    colors: [{ name: 'Moss', hex: '#2D3F2E' }, { name: 'Sand', hex: '#C9B08A' }, { name: 'Slate', hex: '#3F4A4F' }],
    sizes: ['2P', '3P', '4P'],
    blurb: 'Three-season freestanding shelter. 1.4kg packed. Aluminum poles, ripstop nylon, taped seams.',
    specs: [['Weight', '1.4 kg'], ['Capacity', '2 person'], ['Season', '3-season'], ['Floor', '20D ripstop']],
    tag: 'Bestseller', weightGrams: 1400,
  },
  {
    id: 'p9', name: 'Basecamp 4P Cabin Tent', brand: 'North & Ash', cat: 'tents',
    price: 549, rating: 4.6, reviews: 176,
    img: 'photo-1571687949921-1306bfb24b72',
    gallery: ['photo-1571687949921-1306bfb24b72', 'photo-1550957886-ac45931e5779'],
    colors: [{ name: 'Forest', hex: '#1F3528' }, { name: 'Clay', hex: '#B0764B' }],
    sizes: ['4P', '6P'],
    blurb: 'Near-vertical walls for standing headroom. Built for car camping and long basecamp stays.',
    specs: [['Weight', '6.8 kg'], ['Capacity', '4 person'], ['Season', '3-season'], ['Peak height', '198 cm']],
    weightGrams: 6800,
  },
  {
    id: 'p10', name: 'Featherpeak 1P Solo Tent', brand: 'Wayfarer Supply', cat: 'tents',
    price: 289, rating: 4.7, reviews: 98,
    img: 'photo-1624923686627-514dd5e57bae',
    gallery: ['photo-1624923686627-514dd5e57bae', 'photo-1508873696983-2dfd5898f08b'],
    colors: [{ name: 'Slate', hex: '#3F4A4F' }],
    sizes: ['1P'],
    blurb: 'Ultralight trekking-pole shelter for solo thru-hikers. Pitches with your trekking poles — no dedicated poles to carry.',
    specs: [['Weight', '890 g'], ['Capacity', '1 person'], ['Season', '3-season'], ['Poles', 'Trekking pole pitch']],
    tag: 'New', weightGrams: 890,
  },

  // ── Hiking Boots ──────────────────────────────────────
  {
    id: 'p2', name: 'Granite Trail Boot', brand: 'Cairn Co.', cat: 'boots',
    price: 245, rating: 4.7, reviews: 1024,
    img: 'photo-1631287381310-925554130169',
    gallery: ['photo-1631287381310-925554130169', 'photo-1530792271526-7ddf516473b3'],
    colors: [{ name: 'Walnut', hex: '#6B4226' }, { name: 'Olive', hex: '#4A5240' }, { name: 'Char', hex: '#2A2A2A' }],
    sizes: ['8', '9', '10', '11', '12'],
    blurb: 'Full-grain leather. Vibram Megagrip outsole. Gore-Tex membrane for wet alpine traverses.',
    specs: [['Upper', 'Full-grain leather'], ['Sole', 'Vibram Megagrip'], ['Lining', 'Gore-Tex'], ['Weight', '1.18 kg / pair']],
    tag: 'Bestseller', weightGrams: 1180,
  },
  {
    id: 'p11', name: 'Talus Mid Hiker', brand: 'Basin & Range', cat: 'boots',
    price: 178, rating: 4.5, reviews: 540,
    img: 'photo-1575987116913-e96e7d490b8a',
    gallery: ['photo-1575987116913-e96e7d490b8a', 'photo-1600100315778-850119b19220'],
    colors: [{ name: 'Stone', hex: '#8A8477' }, { name: 'Char', hex: '#2A2A2A' }],
    sizes: ['7', '8', '9', '10', '11'],
    blurb: 'Breathable mesh-and-suede mid hiker for day hikes and light backpacking. Fast to break in.',
    specs: [['Upper', 'Suede + mesh'], ['Sole', 'EVA midsole'], ['Weight', '890 g / pair']],
    weightGrams: 890,
  },
  {
    id: 'p12', name: 'Cirque Mountaineering Boot', brand: 'North & Ash', cat: 'boots',
    price: 379, rating: 4.9, reviews: 143,
    img: 'photo-1606036525923-525fa3b35465',
    gallery: ['photo-1606036525923-525fa3b35465', 'photo-1600100315760-ac46b65f6fdd'],
    colors: [{ name: 'Char', hex: '#2A2A2A' }, { name: 'Rust', hex: '#A85A2E' }],
    sizes: ['8', '9', '10', '11', '12', '13'],
    blurb: 'Crampon-compatible stiff-shank boot for glacier travel and technical alpine routes.',
    specs: [['Shank', 'Full nylon'], ['Crampon', 'Semi-automatic compatible'], ['Insulation', '200g PrimaLoft']],
    tag: "Editor's Pick", weightGrams: 1650,
  },

  // ── Backpacks ─────────────────────────────────────────
  {
    id: 'p3', name: 'Summit 65L Pack', brand: 'North & Ash', cat: 'backpacks',
    price: 329, rating: 4.9, reviews: 487,
    img: 'photo-1622260614927-208cfe3f5cfd',
    gallery: ['photo-1622260614927-208cfe3f5cfd', 'photo-1501555088652-021faa106b9b'],
    colors: [{ name: 'Forest', hex: '#1F3528' }, { name: 'Rust', hex: '#A85A2E' }],
    sizes: ['S/M', 'M/L'],
    blurb: 'Anatomical suspension, removable lid, hipbelt pockets. Built for week-long carries.',
    specs: [['Volume', '65 L'], ['Weight', '1.9 kg'], ['Material', '420D Robic nylon'], ['Frame', 'Aluminum stay']],
    tag: "Editor's Pick", weightGrams: 1900,
  },
  {
    id: 'p13', name: 'Switchback 28L Daypack', brand: 'Trek Mate', cat: 'backpacks',
    price: 129, rating: 4.6, reviews: 812,
    img: 'photo-1602845860431-35374f24f48d',
    gallery: ['photo-1602845860431-35374f24f48d', 'photo-1600599067176-1f47e3b6fe47'],
    colors: [{ name: 'Moss', hex: '#2D3F2E' }, { name: 'Sand', hex: '#D4B896' }, { name: 'Char', hex: '#2A2A2A' }],
    sizes: ['One size'],
    blurb: 'Everyday hiking pack with hydration sleeve, hip fins, and a rain cover tucked in the base pocket.',
    specs: [['Volume', '28 L'], ['Weight', '980 g'], ['Hydration', '3L reservoir compatible']],
    tag: 'Bestseller', weightGrams: 980,
  },
  {
    id: 'p14', name: 'Vantage 45L Travel Pack', brand: 'Wayfarer Supply', cat: 'backpacks',
    price: 249, rating: 4.7, reviews: 265,
    img: 'photo-1509762774605-f07235a08f1f',
    gallery: ['photo-1509762774605-f07235a08f1f', 'photo-1592388748465-8c4dca8dd703'],
    colors: [{ name: 'Slate', hex: '#3F4A4F' }, { name: 'Sand', hex: '#C9B08A' }],
    sizes: ['S/M', 'M/L'],
    blurb: 'Panel-loading travel pack that opens flat like a suitcase. Carry-on sized, hideaway harness.',
    specs: [['Volume', '45 L'], ['Weight', '1.6 kg'], ['Access', 'Full panel-load']],
    weightGrams: 1600,
  },

  // ── Sleeping Bags ─────────────────────────────────────
  {
    id: 'p4', name: 'Down Hollow 0°F Bag', brand: 'Sierra & Pine', cat: 'sleep',
    price: 449, rating: 4.6, reviews: 198,
    img: 'photo-1558477280-1bfed08ea5db',
    gallery: ['photo-1558477280-1bfed08ea5db', 'photo-1486999619268-6aa409dbecd1'],
    colors: [{ name: 'Ember', hex: '#C95F2E' }, { name: 'Slate', hex: '#3F4A4F' }],
    sizes: ['Reg', 'Long'],
    blurb: '850-fill responsible down. Mummy cut with draft tube and hood cinch.',
    specs: [['Temp', '0°F / −18°C'], ['Fill', '850 RDS down'], ['Weight', '1.32 kg']],
    weightGrams: 1320,
  },
  {
    id: 'p15', name: 'Meadow 20°F Synthetic Bag', brand: 'Trek Mate', cat: 'sleep',
    price: 189, rating: 4.4, reviews: 356,
    img: 'photo-1594978081989-0bdab99e1c1e',
    gallery: ['photo-1594978081989-0bdab99e1c1e', 'photo-1502943615053-d8bd8c74eb1b'],
    colors: [{ name: 'Moss', hex: '#2D3F2E' }, { name: 'Rust', hex: '#A85A2E' }],
    sizes: ['Reg', 'Long'],
    blurb: 'Budget-friendly 3-season bag. Synthetic fill keeps insulating even if it gets damp.',
    specs: [['Temp', '20°F / −6°C'], ['Fill', 'Synthetic ClimaShield'], ['Weight', '1.6 kg']],
    weightGrams: 1600,
  },
  {
    id: 'p16', name: 'Polar Hollow −20°F Expedition Bag', brand: 'North & Ash', cat: 'sleep',
    price: 599, old: 680, rating: 4.9, reviews: 87,
    img: 'photo-1518388389348-b60e09ab7627',
    gallery: ['photo-1518388389348-b60e09ab7627', 'photo-1516802303781-d0196b13d8db'],
    colors: [{ name: 'Char', hex: '#2A2A2A' }],
    sizes: ['Reg', 'Long'],
    blurb: 'Expedition-rated for basecamp mountaineering and deep winter. Full-length draft collar.',
    specs: [['Temp', '−20°F / −29°C'], ['Fill', '900 RDS down'], ['Weight', '1.95 kg']],
    tag: 'Limited', weightGrams: 1950,
  },

  // ── Stoves & Cook ─────────────────────────────────────
  {
    id: 'p5', name: 'Featherlite Stove', brand: 'Cairn Co.', cat: 'stoves',
    price: 78, rating: 4.8, reviews: 656,
    img: 'photo-1522041350204-22285237eeca',
    gallery: ['photo-1522041350204-22285237eeca', 'photo-1632088563376-d714bff9c2a1'],
    colors: [{ name: 'Titanium', hex: '#A8A8A8' }],
    sizes: ['Standard'],
    blurb: 'Titanium canister stove, 73g, boils 1L in 3:30. Piezo ignition.',
    specs: [['Weight', '73 g'], ['Output', '3000 W'], ['Fuel', 'Iso-butane']],
    weightGrams: 73,
  },
  {
    id: 'p17', name: 'Basecamp 2-Burner Stove', brand: 'North & Ash', cat: 'stoves',
    price: 139, rating: 4.5, reviews: 214,
    img: 'photo-1546890948-82b45c9712c2',
    gallery: ['photo-1546890948-82b45c9712c2', 'photo-1444228425018-ff8535a55c93'],
    colors: [{ name: 'Steel', hex: '#7A8288' }],
    sizes: ['Standard'],
    blurb: 'Twin-burner propane stove for car camping and group basecamps. Wind-resistant panels.',
    specs: [['Weight', '4.1 kg'], ['Output', '2 × 7500 BTU'], ['Fuel', 'Propane']],
    weightGrams: 4100,
  },
  {
    id: 'p18', name: 'Alpine Cook Set — 3pc', brand: 'Cairn Co.', cat: 'stoves',
    price: 62, rating: 4.6, reviews: 389,
    img: 'photo-1444012104069-996724bf4a0a',
    gallery: ['photo-1444012104069-996724bf4a0a', 'photo-1619035226152-81e29823b8d9'],
    colors: [{ name: 'Titanium', hex: '#A8A8A8' }],
    sizes: ['1L', '1.5L'],
    blurb: 'Nesting pot, lid-strainer, and folding handle. Anodized aluminum for even heat.',
    specs: [['Weight', '310 g'], ['Material', 'Hard-anodized aluminum'], ['Includes', 'Pot, lid, handle']],
    tag: 'New', weightGrams: 310,
  },

  // ── Water Bottles ─────────────────────────────────────
  {
    id: 'p6', name: 'Glacier 32oz Bottle', brand: 'Trek Mate', cat: 'bottles',
    price: 42, rating: 4.5, reviews: 1830,
    img: 'photo-1602143407151-7111542de6e8',
    gallery: ['photo-1602143407151-7111542de6e8', 'photo-1600956054489-a23507c64a36'],
    colors: [{ name: 'Moss', hex: '#2D3F2E' }, { name: 'Sand', hex: '#D4B896' }, { name: 'Coal', hex: '#1A1A1A' }, { name: 'Ember', hex: '#C95F2E' }],
    sizes: ['18oz', '32oz', '40oz'],
    blurb: 'Double-wall vacuum insulated. 24h cold / 12h hot. Powder-coated.',
    specs: [['Volume', '32 oz'], ['Insulation', 'Double-wall vac.'], ['Material', '18/8 steel']],
    tag: 'New', weightGrams: 380,
  },
  {
    id: 'p19', name: 'Trailspring Filter Bottle', brand: 'Wayfarer Supply', cat: 'bottles',
    price: 54, rating: 4.6, reviews: 402,
    img: 'photo-1568395216634-ab1b1e848751',
    gallery: ['photo-1568395216634-ab1b1e848751', 'photo-1605539585404-a846f1193d19'],
    colors: [{ name: 'Clear/Grey', hex: '#B8BEC2' }],
    sizes: ['24oz'],
    blurb: 'Built-in 2-stage filter removes 99.9% of bacteria and protozoa straight from the stream.',
    specs: [['Volume', '24 oz'], ['Filter life', '1000 L'], ['Material', 'Tritan copolyester']],
  },
  {
    id: 'p20', name: 'Packflask Collapsible 1L', brand: 'Trek Mate', cat: 'bottles',
    price: 28, rating: 4.3, reviews: 289,
    img: 'photo-1523362628745-0c100150b504',
    gallery: ['photo-1523362628745-0c100150b504', 'photo-1544003484-3cd181d17917'],
    colors: [{ name: 'Slate', hex: '#3F4A4F' }, { name: 'Ember', hex: '#C95F2E' }],
    sizes: ['600ml', '1L'],
    blurb: 'Rolls to the size of a fist when empty. Food-grade silicone, freezer safe.',
    specs: [['Volume', '1 L'], ['Packed size', "3\" tall"], ['Material', 'Silicone']],
  },

  // ── Winter Apparel ────────────────────────────────────
  {
    id: 'p7', name: 'Tundra Down Parka', brand: 'North & Ash', cat: 'winter',
    price: 525, old: 625, rating: 4.9, reviews: 264,
    img: 'photo-1572349618468-4e4208f41af2',
    gallery: ['photo-1572349618468-4e4208f41af2', 'photo-1581504912285-745af0d408f3'],
    colors: [{ name: 'Char', hex: '#2A2A2A' }, { name: 'Moss', hex: '#2D3F2E' }],
    sizes: ['S', 'M', 'L', 'XL'],
    blurb: '800-fill goose down. Helmet-compatible hood. Built for −30°C basecamp duty.',
    specs: [['Fill', '800 goose down'], ['Shell', '20D Pertex'], ['Rating', '−30°C']],
    tag: 'Bestseller', weightGrams: 720,
  },
  {
    id: 'p8', name: 'Alpine Glove', brand: 'Cairn Co.', cat: 'winter',
    price: 89, rating: 4.4, reviews: 142,
    img: 'photo-1634852836003-c0aa5b67d243',
    gallery: ['photo-1634852836003-c0aa5b67d243', 'photo-1553695776-6a5b8cb9b171'],
    colors: [{ name: 'Char', hex: '#2A2A2A' }, { name: 'Ember', hex: '#C95F2E' }],
    sizes: ['S', 'M', 'L'],
    blurb: 'Goat-leather palm, PrimaLoft insulation, touch-screen index.',
    specs: [['Insulation', 'PrimaLoft Gold'], ['Palm', 'Goat leather']],
  },
  {
    id: 'p21', name: 'Stormline 3L Shell Jacket', brand: 'Basin & Range', cat: 'winter',
    price: 349, rating: 4.7, reviews: 198,
    img: 'photo-1581504912285-745af0d408f3',
    gallery: ['photo-1581504912285-745af0d408f3', 'photo-1572349618468-4e4208f41af2'],
    colors: [{ name: 'Slate', hex: '#3F4A4F' }, { name: 'Rust', hex: '#A85A2E' }],
    sizes: ['S', 'M', 'L', 'XL'],
    blurb: 'Fully seam-taped 3-layer hardshell. Pit zips, storm hood, and a pack-away hem.',
    specs: [['Waterproof rating', '20,000 mm'], ['Breathability', '15,000 g/m²'], ['Weight', '410 g']],
    weightGrams: 410,
  },
  {
    id: 'p22', name: 'Basecamp Fleece Half-Zip', brand: 'Trek Mate', cat: 'winter',
    price: 95, rating: 4.5, reviews: 431,
    img: 'photo-1603959479879-f0f176b8286a',
    gallery: ['photo-1603959479879-f0f176b8286a', 'photo-1581504912285-745af0d408f3'],
    colors: [{ name: 'Moss', hex: '#2D3F2E' }, { name: 'Sand', hex: '#C9B08A' }, { name: 'Char', hex: '#2A2A2A' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    blurb: 'Midweight grid fleece for camp and cold mornings on trail. Brushed inner face.',
    specs: [['Material', '240gsm grid fleece'], ['Weight', '380 g']],
    tag: 'New', weightGrams: 380,
  },

  // ── Glasses & Optics ──────────────────────────────────
  {
    id: 'p23', name: 'Ridgeview Polarized Sunglasses', brand: 'Kestrel Optics', cat: 'optics',
    price: 128, rating: 4.6, reviews: 372,
    img: 'photo-1699266784348-68f657f770c3',
    gallery: ['photo-1699266784348-68f657f770c3', 'photo-1652794120295-6330b3e1d106'],
    colors: [{ name: 'Tortoise', hex: '#6B4226' }, { name: 'Matte Black', hex: '#1A1A1A' }],
    sizes: ['One size'],
    blurb: 'Category 3 polarized lenses cut glare off snow and water. Impact-resistant frame.',
    specs: [['Lens', 'Polarized, Cat. 3'], ['Frame', 'TR90 nylon'], ['Weight', '26 g']],
    tag: 'Bestseller', weightGrams: 26,
  },
  {
    id: 'p24', name: 'Whiteout Ski Goggles', brand: 'Kestrel Optics', cat: 'optics',
    price: 189, rating: 4.7, reviews: 156,
    img: 'photo-1614270263016-ce6e3f460154',
    gallery: ['photo-1614270263016-ce6e3f460154', 'photo-1606821226898-60ed355f9654'],
    colors: [{ name: 'Char/Amber', hex: '#2A2A2A' }],
    sizes: ['One size'],
    blurb: 'Interchangeable-lens goggles with anti-fog coating and a wide field of view.',
    specs: [['Lens', 'Interchangeable, anti-fog'], ['Fit', 'Helmet compatible']],
  },
  {
    id: 'p25', name: 'Summit 8x32 Binoculars', brand: 'Kestrel Optics', cat: 'optics',
    price: 249, rating: 4.8, reviews: 94,
    img: 'photo-1559780528-19fc03b3a725',
    gallery: ['photo-1559780528-19fc03b3a725', 'photo-1453563391321-df71955e9289'],
    colors: [{ name: 'Olive', hex: '#4A5240' }],
    sizes: ['One size'],
    blurb: 'Compact roof-prism binoculars for wildlife spotting and route scouting. Waterproof, fog-proof.',
    specs: [['Magnification', '8x32'], ['Weight', '420 g'], ['Waterproof', 'IPX7']],
    tag: "Editor's Pick", weightGrams: 420,
  },
];

export const REVIEWS: Record<string, Review[]> = {
  default: [
    { quote: 'Held up through four days of sideways rain on the West Coast Trail.', author: 'Marisol C.', location: 'Vancouver, BC', rating: 5 },
    { quote: 'Lighter than my old setup and honestly more comfortable. Worth the price.', author: 'Devon R.', location: 'Bend, OR', rating: 5 },
    { quote: 'Great for the price. Not the lightest option out there but very durable.', author: 'Priya N.', location: 'Boulder, CO', rating: 4 },
  ],
};

export const ADDRESSES: Address[] = [
  { id: 'home', label: 'Home', name: 'Sam Halvorson', line: '1408 NE Alberta St, Apt 3', city: 'Portland, OR 97211', isDefault: true },
  { id: 'trailhead', label: 'Trailhead pickup', name: 'Sam Halvorson', line: 'General Delivery, Timberline Lodge', city: 'Government Camp, OR 97028' },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'visa4242', kind: 'card', label: 'Visa ending in 4242', sub: 'Expires 03/28' },
  { id: 'paypal', kind: 'paypal', label: 'PayPal', sub: 'sam@trekmate.co' },
];

export const ORDERS: Order[] = [
  { id: 'TM-482913', date: 'Sep 2, 2026', itemCount: 2, status: 'In transit', total: 428.5 },
  { id: 'TM-471028', date: 'Jul 14, 2026', itemCount: 1, status: 'Delivered', total: 245 },
  { id: 'TM-459887', date: 'May 3, 2026', itemCount: 3, status: 'Delivered', total: 612.3 },
];

export function productImg(id: string, w = 600, h?: number) {
  return img(id, w, h);
}

export function categoryCount(catId: string): number {
  return PRODUCTS.filter((p) => p.cat === catId).length;
}

export function productsByCategory(catId: string): Product[] {
  return PRODUCTS.filter((p) => p.cat === catId);
}
