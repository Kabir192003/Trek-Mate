import { img } from './img';
import type { Category, Product, Review, Address, PaymentMethod, Order, CategoryId } from './types';

export const CATEGORIES: Category[] = [
  { id: 'tents', name: 'Tents', blurb: 'Freestanding and trekking-pole shelters', img: 'photo-1526491109672-74740652b963' },
  { id: 'sleep', name: 'Sleeping Bags', blurb: 'Down and synthetic, −20°F to 20°F', img: 'photo-1558477280-1bfed08ea5db' },
  { id: 'backpacks', name: 'Backpacks', blurb: 'Daypacks to multi-week carries', img: 'photo-1501555088652-021faa106b9b' },
  { id: 'stoves', name: 'Stoves & Cook', blurb: 'Canister stoves and cookware', img: 'photo-1522041350204-22285237eeca' },
  { id: 'bottles', name: 'Water', blurb: 'Bottles, flasks and filters', img: 'photo-1602143407151-7111542de6e8' },
  { id: 'winter', name: 'Layers', blurb: 'Shells, insulation, fleece, gloves', img: 'photo-1572349618468-4e4208f41af2' },
  { id: 'boots', name: 'Footwear', blurb: 'Leather, mesh and mountaineering', img: 'photo-1648027286072-fb339b0d0c06' },
  { id: 'optics', name: 'Optics', blurb: 'Sunglasses, goggles, binoculars', img: 'photo-1699266784348-68f657f770c3' },
];

export const PRODUCTS: Product[] = [
  // ── Shelter ───────────────────────────────────────────
  {
    id: 'p1', name: 'Ridgeline 2P Tent', brand: 'Sierra & Pine', makerId: 'sierra-pine', cat: 'tents', kind: 'tent',
    price: 389, old: 449, rating: 4.8, reviews: 312,
    img: 'photo-1504280390367-361c6d9f38f4',
    gallery: ['photo-1504280390367-361c6d9f38f4', 'photo-1602079108581-4c5071154299', 'photo-1526491109672-74740652b963'],
    colors: [{ name: 'Moss', hex: '#2D3F2E' }, { name: 'Sand', hex: '#C9B08A' }, { name: 'Slate', hex: '#3F4A4F' }],
    sizes: ['2P'],
    blurb: 'Three-season freestanding shelter with two doors and two vestibules. Aluminium poles, 20D ripstop, taped seams.',
    specs: [['Capacity', '2 person'], ['Season', '3-season'], ['Floor', '20D ripstop nylon'], ['Poles', 'DAC aluminium'], ['Doors', '2']],
    tag: 'Bestseller', listedGrams: 1400, measuredGrams: 1412, packedL: 4.2,
    attrs: { capacity: 2 },
    fieldTest: { days: 23, testers: 4, routes: ['Wonderland Trail, WA', 'Olympic coast, WA'], note: 'Held its pitch in 40 mph gusts on Hurricane Ridge. No pooling on the floor after two nights of steady rain.' },
  },
  {
    id: 'p10', name: 'Featherpeak 1P Solo Tent', brand: 'Wayfarer Supply', makerId: 'wayfarer', cat: 'tents', kind: 'tent',
    price: 289, rating: 4.7, reviews: 98,
    img: 'photo-1624923686627-514dd5e57bae',
    gallery: ['photo-1624923686627-514dd5e57bae', 'photo-1508873696983-2dfd5898f08b'],
    colors: [{ name: 'Slate', hex: '#3F4A4F' }],
    sizes: ['1P'],
    blurb: 'Ultralight single-wall shelter for solo walkers. Pitches with your trekking poles, so there are no dedicated poles to carry.',
    specs: [['Capacity', '1 person'], ['Season', '3-season'], ['Poles', 'Trekking-pole pitch'], ['Fabric', 'Silpoly 20D']],
    tag: 'New', listedGrams: 890, measuredGrams: 912, packedL: 2.6,
    attrs: { capacity: 1 },
    fieldTest: { days: 41, testers: 5, routes: ['PCT Section J, WA', 'Enchantments, WA'], note: 'Under three minutes to pitch once dialled in. Condensation stayed manageable with both vents open.' },
  },
  {
    id: 'p9', name: 'Basecamp 4P Cabin Tent', brand: 'North & Ash', makerId: 'north-ash', cat: 'tents', kind: 'tent',
    price: 549, rating: 4.6, reviews: 176,
    img: 'photo-1571687949921-1306bfb24b72',
    gallery: ['photo-1571687949921-1306bfb24b72', 'photo-1550957886-ac45931e5779'],
    colors: [{ name: 'Forest', hex: '#1F3528' }, { name: 'Clay', hex: '#B0764B' }],
    sizes: ['4P'],
    blurb: 'Near-vertical walls for standing headroom. Built for car camping and long basecamp stays, and honest about its weight.',
    specs: [['Capacity', '4 person'], ['Season', '3-season'], ['Peak height', '198 cm'], ['Floor', '150D polyester']],
    listedGrams: 6800, measuredGrams: 6874, packedL: 18,
    attrs: { capacity: 4 },
    fieldTest: { days: 31, testers: 3, routes: ['Silver Falls, OR (car camp)', 'Joshua Tree, CA'], note: 'Stood tall through a desert wind event. Too heavy to backpack, and the listing says so.' },
  },

  // ── Sleep ─────────────────────────────────────────────
  {
    id: 'p4', name: 'Down Hollow 0°F Bag', brand: 'Sierra & Pine', makerId: 'sierra-pine', cat: 'sleep', kind: 'sleeping-bag',
    price: 449, rating: 4.6, reviews: 198,
    img: 'photo-1558477280-1bfed08ea5db',
    gallery: ['photo-1558477280-1bfed08ea5db', 'photo-1486999619268-6aa409dbecd1'],
    colors: [{ name: 'Ember', hex: '#C95F2E' }, { name: 'Slate', hex: '#3F4A4F' }],
    sizes: ['Reg', 'Long'],
    blurb: '850-fill responsibly sourced down in a mummy cut, with a draft tube and a hood that cinches one-handed.',
    specs: [['Rating', '0°F / −18°C'], ['Fill', '850 RDS down'], ['Shell', '10D nylon'], ['Zip', 'Full length, left']],
    listedGrams: 1320, measuredGrams: 1338, packedL: 9.5,
    attrs: { tempF: 0 },
    fieldTest: { days: 18, testers: 3, routes: ['Mt Hood winter camp, OR', 'Goat Rocks, WA'], note: 'Comfortable to 8°F in a base layer. Loft recovered fully after a damp night.' },
  },
  {
    id: 'p15', name: 'Meadow 20°F Synthetic Bag', brand: 'Trek Mate', makerId: 'trek-mate', cat: 'sleep', kind: 'sleeping-bag',
    price: 189, rating: 4.4, reviews: 356,
    img: 'photo-1594978081989-0bdab99e1c1e',
    gallery: ['photo-1594978081989-0bdab99e1c1e', 'photo-1502943615053-d8bd8c74eb1b'],
    colors: [{ name: 'Moss', hex: '#2D3F2E' }, { name: 'Rust', hex: '#A85A2E' }],
    sizes: ['Reg', 'Long'],
    blurb: 'An honest 3-season bag at a fair price. Synthetic fill keeps insulating even when it gets damp.',
    specs: [['Rating', '20°F / −6°C'], ['Fill', 'ClimaShield synthetic'], ['Shell', '30D polyester']],
    listedGrams: 1600, measuredGrams: 1647, packedL: 13,
    attrs: { tempF: 20 },
    fieldTest: { days: 37, testers: 6, routes: ['Three Sisters, OR', 'Olympic coast, WA'], note: 'Warm and forgiving in coastal damp. Bulky in the pack, which the packed size makes clear.' },
  },
  {
    id: 'p16', name: 'Polar Hollow −20°F Expedition Bag', brand: 'North & Ash', makerId: 'north-ash', cat: 'sleep', kind: 'sleeping-bag',
    price: 599, old: 680, rating: 4.9, reviews: 87,
    img: 'photo-1518388389348-b60e09ab7627',
    gallery: ['photo-1518388389348-b60e09ab7627', 'photo-1516802303781-d0196b13d8db'],
    colors: [{ name: 'Char', hex: '#2A2A2A' }],
    sizes: ['Reg', 'Long'],
    blurb: 'Expedition-rated for basecamp mountaineering and deep winter, with a full-length draft collar.',
    specs: [['Rating', '−20°F / −29°C'], ['Fill', '900 RDS down'], ['Shell', 'Pertex Endurance']],
    tag: 'Limited', listedGrams: 1950, measuredGrams: 1981, packedL: 15,
    attrs: { tempF: -20 },
    fieldTest: { days: 14, testers: 2, routes: ['Denali basecamp, AK'], note: 'Slept warm at −14°F with wind on the tent. Overkill below the treeline.' },
  },

  // ── Carry ─────────────────────────────────────────────
  {
    id: 'p3', name: 'Summit 65L Pack', brand: 'North & Ash', makerId: 'north-ash', cat: 'backpacks', kind: 'pack',
    price: 329, rating: 4.9, reviews: 487,
    img: 'photo-1622260614927-208cfe3f5cfd',
    gallery: ['photo-1622260614927-208cfe3f5cfd', 'photo-1501555088652-021faa106b9b'],
    colors: [{ name: 'Forest', hex: '#1F3528' }, { name: 'Rust', hex: '#A85A2E' }],
    sizes: ['S/M', 'M/L'],
    blurb: 'Anatomical suspension, removable lid and hipbelt pockets. Built for week-long carries with a full food bag.',
    specs: [['Volume', '65 L'], ['Material', '420D Robic nylon'], ['Frame', 'Aluminium stay'], ['Max load', '22 kg']],
    tag: "Editor's Pick", listedGrams: 1900, measuredGrams: 1934,
    attrs: { volumeL: 65 },
    fieldTest: { days: 52, testers: 5, routes: ['John Muir Trail, CA', 'Timberline Trail, OR'], note: 'Carried 19 kg without hot spots. The lid can stay home on shorter trips to save 140 g.' },
  },
  {
    id: 'p14', name: 'Vantage 45L Pack', brand: 'Wayfarer Supply', makerId: 'wayfarer', cat: 'backpacks', kind: 'pack',
    price: 249, rating: 4.7, reviews: 265,
    img: 'photo-1509762774605-f07235a08f1f',
    gallery: ['photo-1509762774605-f07235a08f1f', 'photo-1592388748465-8c4dca8dd703'],
    colors: [{ name: 'Slate', hex: '#3F4A4F' }, { name: 'Sand', hex: '#C9B08A' }],
    sizes: ['S/M', 'M/L'],
    blurb: 'A lighter, simpler frame pack for long weekends. One big compartment, a stretch front pocket and nothing you will cut off later.',
    specs: [['Volume', '45 L'], ['Material', '210D UHMWPE grid'], ['Frame', 'Removable stay'], ['Max load', '14 kg']],
    listedGrams: 1600, measuredGrams: 1622,
    attrs: { volumeL: 45 },
    fieldTest: { days: 29, testers: 4, routes: ['Three Sisters loop, OR', 'Enchantments, WA'], note: 'Best under 12 kg. Above that the hipbelt starts to fold.' },
  },
  {
    id: 'p13', name: 'Switchback 28L Daypack', brand: 'Trek Mate', makerId: 'trek-mate', cat: 'backpacks', kind: 'pack',
    price: 129, rating: 4.6, reviews: 812,
    img: 'photo-1602845860431-35374f24f48d',
    gallery: ['photo-1602845860431-35374f24f48d', 'photo-1600599067176-1f47e3b6fe47'],
    colors: [{ name: 'Moss', hex: '#2D3F2E' }, { name: 'Sand', hex: '#D4B896' }, { name: 'Char', hex: '#2A2A2A' }],
    sizes: ['One size'],
    blurb: 'Everyday hiking pack with a hydration sleeve, hip fins and a rain cover tucked into the base pocket.',
    specs: [['Volume', '28 L'], ['Material', '210D recycled nylon'], ['Hydration', '3 L sleeve']],
    tag: 'Bestseller', listedGrams: 980, measuredGrams: 1006,
    attrs: { volumeL: 28 },
    fieldTest: { days: 64, testers: 7, routes: ['Columbia Gorge, OR', 'Forest Park, OR'], note: 'Day-hike workhorse. Too small for an overnight, so the planner never suggests it for one.' },
  },

  // ── Kitchen ───────────────────────────────────────────
  {
    id: 'p5', name: 'Featherlite Stove', brand: 'Cairn Co.', makerId: 'cairn', cat: 'stoves', kind: 'stove',
    price: 78, rating: 4.8, reviews: 656,
    img: 'photo-1522041350204-22285237eeca',
    gallery: ['photo-1522041350204-22285237eeca', 'photo-1632088563376-d714bff9c2a1'],
    colors: [{ name: 'Titanium', hex: '#A8A8A8' }],
    sizes: ['Standard'],
    blurb: 'Titanium canister stove with piezo ignition. Boils a litre in about three and a half minutes.',
    specs: [['Output', '3,000 W'], ['Fuel', 'Isobutane canister'], ['Boil time', '3:30 / 1 L']],
    listedGrams: 73, measuredGrams: 76, packedL: 0.3,
    attrs: {},
    fieldTest: { days: 47, testers: 5, routes: ['Wonderland Trail, WA', 'Three Sisters, OR'], note: 'Piezo still sparking after 200 lights. Needs a windscreen above treeline.' },
  },
  {
    id: 'p18', name: 'Alpine Cook Set, 3-piece', brand: 'Cairn Co.', makerId: 'cairn', cat: 'stoves', kind: 'cookware',
    price: 62, rating: 4.6, reviews: 389,
    img: 'photo-1444012104069-996724bf4a0a',
    gallery: ['photo-1444012104069-996724bf4a0a', 'photo-1619035226152-81e29823b8d9'],
    colors: [{ name: 'Titanium', hex: '#A8A8A8' }],
    sizes: ['1 L'],
    blurb: 'Nesting pot, lid-strainer and folding handle in hard-anodised aluminium for even heat. A 110 g canister fits inside.',
    specs: [['Capacity', '1 L'], ['Material', 'Hard-anodised aluminium'], ['Includes', 'Pot, lid, handle']],
    tag: 'New', listedGrams: 310, measuredGrams: 318, packedL: 1.4,
    attrs: {},
    fieldTest: { days: 33, testers: 4, routes: ['Goat Rocks, WA'], note: 'Even heat, no scorching on rice. The handle loosens slightly and needs a twist each season.' },
  },
  {
    id: 'p17', name: 'Basecamp 2-Burner Stove', brand: 'North & Ash', makerId: 'north-ash', cat: 'stoves', kind: 'stove',
    price: 139, rating: 4.5, reviews: 214,
    img: 'photo-1546890948-82b45c9712c2',
    gallery: ['photo-1546890948-82b45c9712c2', 'photo-1444228425018-ff8535a55c93'],
    colors: [{ name: 'Steel', hex: '#7A8288' }],
    sizes: ['Standard'],
    blurb: 'Twin-burner propane stove for car camping and group basecamps, with wind-resistant side panels.',
    specs: [['Output', '2 × 7,500 BTU'], ['Fuel', 'Propane'], ['Use', 'Car camping']],
    listedGrams: 4100, measuredGrams: 4155, packedL: 14,
    attrs: {},
    fieldTest: { days: 26, testers: 3, routes: ['Silver Falls, OR (car camp)'], note: 'Simmers properly, which most camp stoves can\'t. Not a backpacking stove.' },
  },

  // ── Water ─────────────────────────────────────────────
  {
    id: 'p6', name: 'Glacier 32oz Bottle', brand: 'Trek Mate', makerId: 'trek-mate', cat: 'bottles', kind: 'bottle',
    price: 42, rating: 4.5, reviews: 1830,
    img: 'photo-1602143407151-7111542de6e8',
    gallery: ['photo-1602143407151-7111542de6e8', 'photo-1600956054489-a23507c64a36'],
    colors: [{ name: 'Moss', hex: '#2D3F2E' }, { name: 'Sand', hex: '#D4B896' }, { name: 'Coal', hex: '#1A1A1A' }],
    sizes: ['32 oz'],
    blurb: 'Double-wall vacuum insulated steel: 24 hours cold, 12 hot. Great for the car and the office, heavy for the trail.',
    specs: [['Volume', '32 oz / 946 ml'], ['Insulation', 'Double-wall vacuum'], ['Material', '18/8 steel']],
    listedGrams: 380, measuredGrams: 392,
    attrs: {},
    fieldTest: { days: 58, testers: 6, routes: ['Columbia Gorge, OR'], note: 'Bombproof. We tell people to leave it home on overnights, and we make it.' },
  },
  {
    id: 'p20', name: 'Packflask Collapsible 1L', brand: 'Trek Mate', makerId: 'trek-mate', cat: 'bottles', kind: 'bottle',
    price: 28, rating: 4.3, reviews: 289,
    img: 'photo-1523362628745-0c100150b504',
    gallery: ['photo-1523362628745-0c100150b504', 'photo-1544003484-3cd181d17917'],
    colors: [{ name: 'Slate', hex: '#3F4A4F' }, { name: 'Ember', hex: '#C95F2E' }],
    sizes: ['1 L'],
    blurb: 'Rolls to the size of a fist when empty. Food-grade silicone and TPU, freezer safe, threads onto common filters.',
    specs: [['Volume', '1 L'], ['Packed size', '8 cm rolled'], ['Thread', '28 mm standard']],
    listedGrams: 42, measuredGrams: 44, packedL: 0.2,
    attrs: {},
    fieldTest: { days: 44, testers: 5, routes: ['PCT Section J, WA', 'Enchantments, WA'], note: 'Survived a 2 m drop onto granite full. Wash with warm water to keep it from tasting of plastic.' },
  },
  {
    id: 'p19', name: 'Trailspring Filter Bottle', brand: 'Wayfarer Supply', makerId: 'wayfarer', cat: 'bottles', kind: 'filter',
    price: 54, rating: 4.6, reviews: 402,
    img: 'photo-1568395216634-ab1b1e848751',
    gallery: ['photo-1568395216634-ab1b1e848751', 'photo-1605539585404-a846f1193d19'],
    colors: [{ name: 'Clear/Grey', hex: '#B8BEC2' }],
    sizes: ['24 oz'],
    blurb: 'A two-stage filter built into the bottle removes 99.9% of bacteria and protozoa straight from the stream.',
    specs: [['Volume', '24 oz / 710 ml'], ['Filter life', '1,000 L'], ['Removes', 'Bacteria, protozoa']],
    listedGrams: 220, measuredGrams: 226,
    attrs: {},
    fieldTest: { days: 39, testers: 4, routes: ['Timberline Trail, OR', 'Olympic coast, WA'], note: 'Flow slows on silty glacial melt. Backflush it nightly and it recovers.' },
  },

  // ── Layers ────────────────────────────────────────────
  {
    id: 'p21', name: 'Stormline 3L Shell Jacket', brand: 'Basin & Range', makerId: 'basin-range', cat: 'winter', kind: 'shell',
    price: 349, rating: 4.7, reviews: 198,
    img: 'photo-1581504912285-745af0d408f3',
    gallery: ['photo-1581504912285-745af0d408f3', 'photo-1572349618468-4e4208f41af2'],
    colors: [{ name: 'Slate', hex: '#3F4A4F' }, { name: 'Rust', hex: '#A85A2E' }],
    sizes: ['S', 'M', 'L', 'XL'],
    blurb: 'Fully seam-taped three-layer hardshell with pit zips, a storm hood and a hem that packs into its own pocket.',
    specs: [['Waterproofing', '20,000 mm'], ['Breathability', '15,000 g/m²'], ['Hood', 'Helmet compatible']],
    listedGrams: 410, measuredGrams: 421, packedL: 1.6,
    attrs: {},
    fieldTest: { days: 35, testers: 4, routes: ['Olympic coast, WA', 'Mt Hood, OR'], note: 'Dry through six hours of coastal rain. Pit zips are what make it wearable on climbs.' },
  },
  {
    id: 'p7', name: 'Tundra Down Parka', brand: 'North & Ash', makerId: 'north-ash', cat: 'winter', kind: 'insulation',
    price: 525, old: 625, rating: 4.9, reviews: 264,
    img: 'photo-1572349618468-4e4208f41af2',
    gallery: ['photo-1572349618468-4e4208f41af2', 'photo-1581504912285-745af0d408f3'],
    colors: [{ name: 'Char', hex: '#2A2A2A' }, { name: 'Moss', hex: '#2D3F2E' }],
    sizes: ['S', 'M', 'L', 'XL'],
    blurb: '800-fill goose down with a helmet-compatible hood. Built for cold belays and deep-winter camp.',
    specs: [['Fill', '800 goose down'], ['Shell', '20D Pertex'], ['Comfort', 'to −30°C at rest']],
    tag: 'Bestseller', listedGrams: 720, measuredGrams: 738, packedL: 6,
    attrs: {},
    fieldTest: { days: 21, testers: 3, routes: ['Mt Hood winter camp, OR', 'Denali basecamp, AK'], note: 'The warmest thing we tested. Too much jacket for a summer overnight.' },
  },
  {
    id: 'p22', name: 'Basecamp Fleece Half-Zip', brand: 'Trek Mate', makerId: 'trek-mate', cat: 'winter', kind: 'fleece',
    price: 95, rating: 4.5, reviews: 431,
    img: 'photo-1603959479879-f0f176b8286a',
    gallery: ['photo-1603959479879-f0f176b8286a', 'photo-1581504912285-745af0d408f3'],
    colors: [{ name: 'Moss', hex: '#2D3F2E' }, { name: 'Sand', hex: '#C9B08A' }, { name: 'Char', hex: '#2A2A2A' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    blurb: 'Midweight grid fleece for camp and cold mornings, with a brushed inner face. Breathes better than a puffy on the move.',
    specs: [['Material', '240 gsm grid fleece'], ['Zip', 'Half, with chin guard']],
    tag: 'New', listedGrams: 380, measuredGrams: 386, packedL: 2.4,
    attrs: {},
    fieldTest: { days: 49, testers: 6, routes: ['Three Sisters, OR', 'Goat Rocks, WA'], note: 'Our most-worn layer. Pills slightly at the hipbelt after a season.' },
  },
  {
    id: 'p8', name: 'Alpine Glove', brand: 'Cairn Co.', makerId: 'cairn', cat: 'winter', kind: 'gloves',
    price: 89, rating: 4.4, reviews: 142,
    img: 'photo-1634852836003-c0aa5b67d243',
    gallery: ['photo-1634852836003-c0aa5b67d243', 'photo-1553695776-6a5b8cb9b171'],
    colors: [{ name: 'Char', hex: '#2A2A2A' }, { name: 'Ember', hex: '#C95F2E' }],
    sizes: ['S', 'M', 'L'],
    blurb: 'Goat-leather palm, PrimaLoft insulation and a touch-screen index finger.',
    specs: [['Insulation', 'PrimaLoft Gold'], ['Palm', 'Goat leather'], ['Cuff', 'Gauntlet']],
    listedGrams: 190, measuredGrams: 198, packedL: 0.6,
    attrs: {},
    fieldTest: { days: 19, testers: 3, routes: ['Mt Hood, OR'], note: 'Warm to about 15°F while moving. Dexterous enough for crampon straps.' },
  },

  // ── Footwear (worn) ───────────────────────────────────
  {
    id: 'p2', name: 'Granite Trail Boot', brand: 'Cairn Co.', makerId: 'cairn', cat: 'boots', kind: 'boot',
    price: 245, rating: 4.7, reviews: 1024,
    img: 'photo-1631287381310-925554130169',
    gallery: ['photo-1631287381310-925554130169', 'photo-1530792271526-7ddf516473b3'],
    colors: [{ name: 'Walnut', hex: '#6B4226' }, { name: 'Olive', hex: '#4A5240' }, { name: 'Char', hex: '#2A2A2A' }],
    sizes: ['8', '9', '10', '11', '12'],
    blurb: 'Full-grain leather on a Vibram Megagrip outsole, with a Gore-Tex membrane for wet alpine traverses.',
    specs: [['Upper', 'Full-grain leather'], ['Sole', 'Vibram Megagrip'], ['Lining', 'Gore-Tex'], ['Weight basis', 'Pair, size 9']],
    tag: 'Bestseller', listedGrams: 1180, measuredGrams: 1196, wornByDefault: true,
    attrs: {},
    fieldTest: { days: 88, testers: 7, routes: ['Timberline Trail, OR', 'Wonderland Trail, WA'], note: 'Needs about 30 km to break in. Still waterproof after a season of creek crossings.' },
  },
  {
    id: 'p11', name: 'Talus Mid Hiker', brand: 'Basin & Range', makerId: 'basin-range', cat: 'boots', kind: 'boot',
    price: 178, rating: 4.5, reviews: 540,
    img: 'photo-1575987116913-e96e7d490b8a',
    gallery: ['photo-1575987116913-e96e7d490b8a', 'photo-1600100315778-850119b19220'],
    colors: [{ name: 'Stone', hex: '#8A8477' }, { name: 'Char', hex: '#2A2A2A' }],
    sizes: ['7', '8', '9', '10', '11'],
    blurb: 'Breathable mesh-and-suede mid for day hikes and light backpacking. Comfortable out of the box.',
    specs: [['Upper', 'Suede and mesh'], ['Midsole', 'EVA'], ['Weight basis', 'Pair, size 9']],
    listedGrams: 890, measuredGrams: 905, wornByDefault: true,
    attrs: {},
    fieldTest: { days: 52, testers: 5, routes: ['Columbia Gorge, OR', 'Three Sisters, OR'], note: 'No break-in needed. Wets out in sustained rain, then dries overnight.' },
  },
  {
    id: 'p12', name: 'Cirque Mountaineering Boot', brand: 'North & Ash', makerId: 'north-ash', cat: 'boots', kind: 'boot',
    price: 379, rating: 4.9, reviews: 143,
    img: 'photo-1606036525923-525fa3b35465',
    gallery: ['photo-1606036525923-525fa3b35465', 'photo-1600100315760-ac46b65f6fdd'],
    colors: [{ name: 'Char', hex: '#2A2A2A' }, { name: 'Rust', hex: '#A85A2E' }],
    sizes: ['8', '9', '10', '11', '12', '13'],
    blurb: 'Crampon-compatible stiff-shank boot for glacier travel and technical alpine routes.',
    specs: [['Shank', 'Full nylon'], ['Crampons', 'Semi-automatic'], ['Insulation', '200 g PrimaLoft'], ['Weight basis', 'Pair, size 9']],
    tag: "Editor's Pick", listedGrams: 1650, measuredGrams: 1688, wornByDefault: true,
    attrs: {},
    fieldTest: { days: 24, testers: 3, routes: ['Mt Baker, WA', 'Mt Hood, OR'], note: 'Precise on front-points. Overbuilt for trail walking, and we say so.' },
  },

  // ── Optics ────────────────────────────────────────────
  {
    id: 'p23', name: 'Ridgeview Polarized Sunglasses', brand: 'Kestrel Optics', makerId: 'kestrel', cat: 'optics', kind: 'sunglasses',
    price: 128, rating: 4.6, reviews: 372,
    img: 'photo-1699266784348-68f657f770c3',
    gallery: ['photo-1699266784348-68f657f770c3', 'photo-1652794120295-6330b3e1d106'],
    colors: [{ name: 'Tortoise', hex: '#6B4226' }, { name: 'Matte Black', hex: '#1A1A1A' }],
    sizes: ['One size'],
    blurb: 'Category 3 polarized lenses that cut glare off snow and water, in an impact-resistant frame.',
    specs: [['Lens', 'Polarized, category 3'], ['Frame', 'TR90 nylon'], ['UV', '100% UVA/UVB']],
    tag: 'Bestseller', listedGrams: 26, measuredGrams: 27, wornByDefault: true,
    attrs: {},
    fieldTest: { days: 71, testers: 6, routes: ['Mt Hood, OR', 'Olympic coast, WA'], note: 'Stay put on a sweaty climb. Category 3 is enough for snowfields, not glaciers.' },
  },
  {
    id: 'p24', name: 'Whiteout Ski Goggles', brand: 'Kestrel Optics', makerId: 'kestrel', cat: 'optics', kind: 'goggles',
    price: 189, rating: 4.7, reviews: 156,
    img: 'photo-1614270263016-ce6e3f460154',
    gallery: ['photo-1614270263016-ce6e3f460154', 'photo-1606821226898-60ed355f9654'],
    colors: [{ name: 'Char/Amber', hex: '#2A2A2A' }],
    sizes: ['One size'],
    blurb: 'Interchangeable-lens goggles with an anti-fog coating and a wide field of view.',
    specs: [['Lens', 'Interchangeable, anti-fog'], ['Fit', 'Helmet compatible']],
    listedGrams: 210, measuredGrams: 214, packedL: 1.1,
    attrs: {},
    fieldTest: { days: 17, testers: 3, routes: ['Mt Hood, OR'], note: 'The lens swap takes under a minute with gloves on. Fogs only when pushed up on the forehead.' },
  },
  {
    id: 'p25', name: 'Summit 8x32 Binoculars', brand: 'Kestrel Optics', makerId: 'kestrel', cat: 'optics', kind: 'binoculars',
    price: 249, rating: 4.8, reviews: 94,
    img: 'photo-1559780528-19fc03b3a725',
    gallery: ['photo-1559780528-19fc03b3a725', 'photo-1453563391321-df71955e9289'],
    colors: [{ name: 'Olive', hex: '#4A5240' }],
    sizes: ['One size'],
    blurb: 'Compact roof-prism binoculars for wildlife and route scouting. Waterproof and fog-proof.',
    specs: [['Magnification', '8 × 32'], ['Field of view', '135 m at 1,000 m'], ['Waterproof', 'IPX7']],
    tag: "Editor's Pick", listedGrams: 420, measuredGrams: 431, packedL: 0.7,
    attrs: {},
    fieldTest: { days: 30, testers: 4, routes: ['North Cascades, WA'], note: 'Bright enough at dusk for elk. The case is heavy; most testers left it at home.' },
  },
];

export const REVIEWS: Review[] = [
  { productId: 'p1', quote: 'Held up through four days of sideways rain on the West Coast Trail. Two doors means no climbing over each other at 2am.', author: 'Marisol C.', location: 'Vancouver, BC', trip: '4 nights · West Coast Trail', rating: 5 },
  { productId: 'p1', quote: 'Lighter than my old dome by almost a kilo and much faster to pitch in the dark.', author: 'Devon R.', location: 'Bend, OR', trip: '2 nights · Three Sisters', rating: 5 },
  { productId: 'p1', quote: 'Great tent. The stuff sack is tight, so I pack it loose and save the faff.', author: 'Priya N.', location: 'Boulder, CO', trip: '3 nights · Indian Peaks', rating: 4 },
  { productId: 'p10', quote: 'I hike with poles anyway, so this felt like getting a tent for free weight-wise.', author: 'Jonah K.', location: 'Seattle, WA', trip: '6 nights · PCT Section J', rating: 5 },
  { productId: 'p10', quote: 'Single wall means some condensation. Vents open, wipe in the morning, no drama.', author: 'Aiko T.', location: 'Portland, OR', trip: '2 nights · Enchantments', rating: 4 },
  { productId: 'p3', quote: 'Carried a week of food comfortably. The hipbelt pockets fit a phone and two bars.', author: 'Rafael M.', location: 'Fresno, CA', trip: '8 nights · John Muir Trail', rating: 5 },
  { productId: 'p14', quote: 'Swapped from a 65 L and lost 300 g and a lot of empty space I kept filling with stuff.', author: 'Hannah L.', location: 'Eugene, OR', trip: '3 nights · Three Sisters loop', rating: 5 },
  { productId: 'p20', quote: 'Replaced my insulated bottle with two of these. Saved nearly 700 g and I do not miss cold water.', author: 'Theo B.', location: 'Spokane, WA', trip: '5 nights · Wonderland Trail', rating: 5 },
  { productId: 'p5', quote: 'Boils fast, weighs nothing. Bring a windscreen if you camp exposed.', author: 'Lena F.', location: 'Missoula, MT', trip: '4 nights · Bob Marshall', rating: 5 },
  { productId: 'p21', quote: 'Six hours of rain on the coast and I stayed dry. The pit zips are the reason I can wear it uphill.', author: 'Owen P.', location: 'Port Angeles, WA', trip: '3 nights · Olympic coast', rating: 5 },
  { productId: 'p15', quote: 'Not the lightest, but it kept me warm on a damp night when my friend\'s down bag went flat.', author: 'Grace W.', location: 'Corvallis, OR', trip: '2 nights · Olympic coast', rating: 4 },
  { productId: 'p2', quote: 'Took a few hikes to break in, then nothing but comfort through creek crossings.', author: 'Sam H.', location: 'Portland, OR', trip: '4 nights · Timberline Trail', rating: 5 },
  { productId: 'p4', quote: 'Toasty at 10°F on Mt Hood. Pricey, but it is the warmest bag per gram we own.', author: 'Iris D.', location: 'Hood River, OR', trip: '1 night · Mt Hood winter camp', rating: 5 },
  { productId: 'p23', quote: 'They do not slide down my nose on a sweaty climb, which is all I ask.', author: 'Mateo G.', location: 'Bellingham, WA', trip: 'Day · Mt Baker approach', rating: 4 },
];

export const ADDRESSES: Address[] = [
  { id: 'home', label: 'Home', name: 'Sam Halvorson', line: '1408 NE Alberta St, Apt 3', city: 'Portland, OR 97211', isDefault: true },
  { id: 'trailhead', label: 'Trailhead pickup', name: 'Sam Halvorson', line: 'General Delivery, Timberline Lodge', city: 'Government Camp, OR 97028' },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'visa4242', kind: 'card', label: 'Visa ending in 4242', sub: 'Expires 03/28' },
  { id: 'paypal', kind: 'paypal', label: 'PayPal', sub: 'sam@trekmate.co' },
];

export const ORDERS: Order[] = [
  {
    id: 'TM-482913', date: '2026-10-14', itemCount: 2, status: 'In transit', total: 377,
    lines: [
      { productId: 'p21', name: 'Stormline 3L Shell Jacket', qty: 1, price: 349, color: 'Slate', size: 'M' },
      { productId: 'p20', name: 'Packflask Collapsible 1L', qty: 1, price: 28, color: 'Ember', size: '1 L' },
    ],
    shipTo: 'Home · Portland, OR 97211', method: 'Standard · free', tracking: 'TM 7731 0482 9135',
  },
  {
    id: 'TM-471028', date: '2026-08-14', itemCount: 1, status: 'Delivered', total: 245,
    lines: [{ productId: 'p2', name: 'Granite Trail Boot', qty: 1, price: 245, color: 'Walnut', size: '9' }],
    shipTo: 'Home · Portland, OR 97211', method: 'Standard · free', tracking: 'TM 7731 0471 0281',
  },
  {
    id: 'TM-459887', date: '2026-05-03', itemCount: 3, status: 'Delivered', total: 326,
    lines: [
      { productId: 'p15', name: 'Meadow 20°F Synthetic Bag', qty: 1, price: 189, color: 'Moss', size: 'Reg' },
      { productId: 'p22', name: 'Basecamp Fleece Half-Zip', qty: 1, price: 95, color: 'Moss', size: 'M' },
      { productId: 'p6', name: 'Glacier 32oz Bottle', qty: 1, price: 42, color: 'Moss', size: '32 oz' },
    ],
    shipTo: 'Home · Portland, OR 97211', method: 'Standard · free', tracking: 'TM 7731 0459 8870',
  },
];

export function productImg(id: string, w = 600, h?: number) {
  return img(id, w, h);
}

export function getProduct(id: string | undefined): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function categoryCount(catId: CategoryId): number {
  return PRODUCTS.filter((p) => p.cat === catId).length;
}

export function productsByCategory(catId: CategoryId): Product[] {
  return PRODUCTS.filter((p) => p.cat === catId);
}

export function reviewsFor(productId: string): Review[] {
  const own = REVIEWS.filter((r) => r.productId === productId);
  return own;
}

export const TOTAL_FIELD_DAYS = PRODUCTS.reduce((s, p) => s + p.fieldTest.days, 0);
