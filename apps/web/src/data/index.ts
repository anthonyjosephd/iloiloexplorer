export interface Attraction {
  id: string
  name: string
  category: 'heritage' | 'beach' | 'museum' | 'religious' | 'park' | 'market'
  description: string
  address: string
  openHours: string
  entryFee: string
  emoji: string
  highlights: string[]
  tips: string[]
  rating: number
}

export interface JeepneyRoute {
  id: string
  code: string
  name: string
  color: string
  from: string
  to: string
  viaPoints: string[]
  fareStart: number
  fareMax: number
  operatingHours: string
  frequency: string
  tips: string[]
}

export interface FoodItem {
  id: string
  name: string
  category: 'kakanin' | 'main' | 'street' | 'seafood' | 'dessert' | 'drink'
  description: string
  whereToFind: string[]
  priceRange: string
  mustTry: boolean
  emoji: string
  story: string
}

export const attractions: Attraction[] = [
  {
    id: 'molo-church',
    name: 'Molo Church',
    category: 'religious',
    description: 'The iconic feminist church of the Philippines, known for its all-female saints on the facade and as the center of the Molo district heritage zone.',
    address: 'Molo, Iloilo City',
    openHours: '6:00 AM – 6:00 PM',
    entryFee: 'Free',
    emoji: '⛪',
    highlights: ['All-female saint statues on facade', 'Baroque architecture', 'National Cultural Treasure', 'Historic convent'],
    tips: ['Visit during early morning for soft light photography', 'Attend Sunday Mass for the full experience', 'Walk the heritage district afterwards'],
    rating: 4.8,
  },
  {
    id: 'miag-ao-church',
    name: 'Miag-ao Church',
    category: 'heritage',
    description: 'A UNESCO World Heritage Site, this fortress-church features a stunning carved facade depicting Saint Christopher surrounded by Philippine flora.',
    address: 'Miag-ao, Iloilo',
    openHours: '8:00 AM – 5:00 PM',
    entryFee: 'Free',
    emoji: '🏛️',
    highlights: ['UNESCO World Heritage Site', 'Baroque coral stone facade', 'Philippine motifs in European style', 'Fortress-church architecture'],
    tips: ['30-minute drive from Iloilo City', 'Best photographed in morning light', 'Visit the town plaza nearby'],
    rating: 4.9,
  },
  {
    id: 'museo-iloilo',
    name: 'Museo Iloilo',
    category: 'museum',
    description: 'The premier museum of Western Visayas showcasing artifacts, gold jewelry, pottery, and the history of Iloilo from pre-colonial to modern times.',
    address: 'Bonifacio Drive, Iloilo City',
    openHours: '9:00 AM – 5:00 PM (Closed Mondays)',
    entryFee: '₱50 adult, ₱30 student',
    emoji: '🏺',
    highlights: ['Pre-colonial gold artifacts', 'Antique pottery collection', 'Spanish colonial exhibits', 'WWII memorabilia'],
    tips: ['Allow 2 hours minimum', 'Photography allowed in most areas', 'English-speaking guides available'],
    rating: 4.6,
  },
  {
    id: 'iloilo-river-esplanade',
    name: 'Iloilo River Esplanade',
    category: 'park',
    description: 'A stunning 1.5-kilometer riverside promenade lined with food stalls, cultural murals, and a vibrant nightlife scene along the Iloilo River.',
    address: 'Iloilo River, Iloilo City',
    openHours: 'Open 24 hours',
    entryFee: 'Free',
    emoji: '🌊',
    highlights: ['River views', 'Street food vendors', 'Cultural murals', 'Live music on weekends', 'Bike rentals'],
    tips: ['Best at sunset and evening', 'Try the grilled seafood stalls', 'Weekends have live performances'],
    rating: 4.7,
  },
  {
    id: 'jaro-cathedral',
    name: 'Jaro Cathedral',
    category: 'religious',
    description: 'The only shrine in Asia where the venerated image is feminine — Nuestra Señora de la Candelaria, Patroness of the Diocese of Jaro.',
    address: 'Jaro, Iloilo City',
    openHours: '6:00 AM – 7:00 PM',
    entryFee: 'Free',
    emoji: '🕍',
    highlights: ['Only feminine shrine in Asia', 'Free-standing bell tower', 'Penitents during Holy Week', 'Heritage plaza'],
    tips: ['The bell tower stands separately from the church', 'Visit during Dinagyang for celebrations', 'Pilgrims come year-round'],
    rating: 4.7,
  },
  {
    id: 'tigbauan-ruins',
    name: 'The Ruins of Talisay',
    category: 'heritage',
    description: 'The iconic "Taj Mahal of Negros" — the burned skeletal mansion of Don Mariano Ledesma Lacson, built as a monument to his Portuguese wife Maria Braga.',
    address: 'Talisay City, Negros Occidental (day trip)',
    openHours: '8:00 AM – 10:00 PM',
    entryFee: '₱100 adult',
    emoji: '🏚️',
    highlights: ['Sunset photography', 'Neoclassical architecture', 'Romantic history', 'Landscaped gardens'],
    tips: ['Best visited at golden hour', 'Available as a day trip from Iloilo', '45 min ferry to Bacolod then 30 min drive'],
    rating: 4.9,
  },
  {
    id: 'dinagyang-festival-museum',
    name: 'Dinagyang Festival Museum',
    category: 'museum',
    description: 'Celebrate the spirit of Iloilo\'s world-famous Dinagyang Festival year-round through costumes, photography, and interactive exhibits.',
    address: 'City Hall Complex, Iloilo City',
    openHours: '9:00 AM – 5:00 PM',
    entryFee: '₱30',
    emoji: '🥁',
    highlights: ['Festival costumes', 'Tribe histories', 'Drumming workshops', 'Photo installations'],
    tips: ['The actual festival is in January', 'Great for understanding Ilonggo culture', 'Book drumming workshops in advance'],
    rating: 4.4,
  },
  {
    id: 'guimaras-island',
    name: 'Guimaras Island',
    category: 'beach',
    description: 'Just 15 minutes by ferry, this island province is famous for the sweetest mangoes in the world and pristine beaches with crystal-clear waters.',
    address: 'Guimaras Island (via Jordan Wharf)',
    openHours: 'Ferry: 5:00 AM – 6:00 PM',
    entryFee: 'Ferry ₱14, island entry ₱50',
    emoji: '🥭',
    highlights: ['World\'s sweetest mangoes', 'Isla Naburot resort', 'Navalas Church ruins', 'Mango wine tasting'],
    tips: ['Buy mangoes from farm stalls, not city markets', 'Rent a tricycle for island hopping', 'Best mango season: March to June'],
    rating: 4.9,
  },
]

export const jeepneyRoutes: JeepneyRoute[] = [
  {
    id: 'route-02b',
    code: '02B',
    name: 'Jaro – City Proper – La Paz',
    color: '#C41E3A',
    from: 'Jaro Terminal',
    to: 'La Paz Market',
    viaPoints: ['Jaro Plaza', 'Rizal Street', 'City Hall', 'Molo', 'Central Market'],
    fareStart: 13,
    fareMax: 25,
    operatingHours: '5:00 AM – 10:00 PM',
    frequency: 'Every 5-10 minutes',
    tips: ['Hail from the right side of the road', 'Tell the driver your stop', 'Exact change preferred', 'Pass fare through other passengers'],
  },
  {
    id: 'route-03c',
    code: '03C',
    name: 'Mandurriao – Downtown – Molo',
    color: '#1B4F8A',
    from: 'Mandurriao Terminal',
    to: 'Molo Church',
    viaPoints: ['Airport Road', 'SM City Iloilo', 'Iznart Street', 'Plaza Libertad', 'Molo Heritage Zone'],
    fareStart: 13,
    fareMax: 30,
    operatingHours: '5:30 AM – 9:00 PM',
    frequency: 'Every 10-15 minutes',
    tips: ['Passes near SM City and major malls', 'Good route for tourists hitting heritage sites', 'Slower during rush hour (7-9am, 5-7pm)'],
  },
  {
    id: 'route-04a',
    code: '04A',
    name: 'Diversion Road Loop',
    color: '#D4A017',
    from: 'Tagbak Terminal',
    to: 'Tagbak Terminal',
    viaPoints: ['Diversion Road', 'Robinsons Place', 'Gaisano Mall', 'IloIlo Business Park', 'SM City'],
    fareStart: 13,
    fareMax: 28,
    operatingHours: '6:00 AM – 9:30 PM',
    frequency: 'Every 15 minutes',
    tips: ['Loops around the commercial area', 'Good for mall hopping', 'Air-conditioned modern units available'],
  },
  {
    id: 'route-08',
    code: '08',
    name: 'Fort San Pedro – Esplanade',
    color: '#6B4423',
    from: 'Fort San Pedro Drive',
    to: 'Iloilo River Esplanade',
    viaPoints: ['Yulo Drive', 'Guanco Street', 'Osmeña Street', 'Ortiz Street'],
    fareStart: 13,
    fareMax: 20,
    operatingHours: '5:00 AM – 8:00 PM',
    frequency: 'Every 10 minutes',
    tips: ['Great for reaching the Esplanade from downtown', 'Short route, very affordable', 'Watch for one-way streets'],
  },
  {
    id: 'route-11',
    code: '11',
    name: 'Pavia – Arevalo Heritage',
    color: '#2D6A4F',
    from: 'Pavia',
    to: 'Arevalo District',
    viaPoints: ['La Paz', 'Buntatala', 'Arevalo Market', 'Arevalo Church'],
    fareStart: 13,
    fareMax: 35,
    operatingHours: '5:00 AM – 7:00 PM',
    frequency: 'Every 20 minutes',
    tips: ['Arevalo is known for its antique shops', 'Longer route, allow extra time', 'Less frequent on Sundays'],
  },
  {
    id: 'route-sa',
    code: 'SA',
    name: 'Special Airports Route',
    color: '#8B1A1A',
    from: 'City Proper Terminal',
    to: 'Iloilo International Airport',
    viaPoints: ['SM City', 'Mandurriao', 'Airport Road'],
    fareStart: 30,
    fareMax: 50,
    operatingHours: '4:00 AM – 11:00 PM',
    frequency: 'Every 30 minutes',
    tips: ['Book a tricycle or Grab if you have heavy luggage', 'Allow 45 minutes from city center', 'Confirm route with driver — some stop short of terminal'],
  },
]

export const foodItems: FoodItem[] = [
  {
    id: 'batchoy',
    name: 'La Paz Batchoy',
    category: 'main',
    description: 'Iloilo\'s most iconic dish — a rich pork broth noodle soup topped with pork organs, chicharron, and fresh egg noodles. Born in La Paz Market in the 1930s.',
    whereToFind: ['Original La Paz Market Stalls', 'Netong\'s', 'Deco\'s', 'Ted\'s Old Timer Lapaz Batchoy', 'Sharky\'s'],
    priceRange: '₱60 – ₱150',
    mustTry: true,
    emoji: '🍜',
    story: 'Federico Guillergan Sr. invented batchoy in La Paz Market in the 1930s, combining Chinese noodles with pork organs that were otherwise discarded. Today it\'s the pride of every Ilonggo.',
  },
  {
    id: 'pancit-molo',
    name: 'Pancit Molo',
    category: 'main',
    description: 'A unique wonton soup originating from the Molo district — pork-filled dumplings in a rich chicken broth, often served at special occasions.',
    whereToFind: ['Molo Mansion Restaurant', 'Breakthrough Restaurant', 'Local carinderias in Molo'],
    priceRange: '₱80 – ₱180',
    mustTry: true,
    emoji: '🥟',
    story: 'Molo was historically a Chinese trading post, and Pancit Molo reflects this Sino-Filipino heritage. The dumplings are made with pork and shrimp wrapped in thin wonton skin.',
  },
  {
    id: 'kansi',
    name: 'Kansi',
    category: 'main',
    description: 'Iloilo\'s bold answer to bulalo — a slow-cooked beef bone marrow soup with the distinctive tartness of batwan fruit, creating a sour-umami depth unlike anything else.',
    whereToFind: ['Netong\'s', 'Roberto\'s Kansi', 'Breakthrough Restaurant'],
    priceRange: '₱180 – ₱350',
    mustTry: true,
    emoji: '🍖',
    story: 'Kansi uses batwan (Garcinia binucao), a souring agent unique to the Visayas. The sour note cuts through the richness of bone marrow, creating a perfect balance that defines Ilonggo cooking.',
  },
  {
    id: 'inasal',
    name: 'Chicken Inasal',
    category: 'main',
    description: 'Bacolod-born but beloved in Iloilo — charcoal-grilled chicken marinated in annatto, vinegar, lemongrass, and calamansi. The butter rice dripping is the secret weapon.',
    whereToFind: ['Manokan Country', 'Aida\'s Chicken Inasal', 'Local carinderia throughout the city'],
    priceRange: '₱80 – ₱200',
    mustTry: true,
    emoji: '🍗',
    story: 'Originally from Bacolod across the strait, inasal has been fully adopted by Iloilo. The chicken oil poured over garlic rice is the detail that makes it extraordinary.',
  },
  {
    id: 'tinuom',
    name: 'Tinuom na Manok',
    category: 'main',
    description: 'Chicken cooked in a sealed clay pot with tanglad (lemongrass), ginger, and native seasonings — slow-steamed to produce intensely aromatic, juicy meat.',
    whereToFind: ['Breakthrough Restaurant', 'Tatoy\'s Manokan', 'Heritage-style restaurants'],
    priceRange: '₱220 – ₱450',
    mustTry: false,
    emoji: '🏺',
    story: 'This ancient Ilonggo cooking method seals flavors inside a clay pot — a technique passed down from pre-colonial times. Every family has a slightly different spice combination.',
  },
  {
    id: 'biscocho',
    name: 'Iloilo Biscocho',
    category: 'dessert',
    description: 'Twice-baked bread slices — crispy, buttery, and subtly sweet. The quintessential Iloilo pasalubong (take-home gift), made by generations of bakeries.',
    whereToFind: ['Biscocho Haus', 'Merced\'s Biscocho', 'Pasalubong shops citywide'],
    priceRange: '₱80 – ₱200 per pack',
    mustTry: true,
    emoji: '🥖',
    story: 'Biscocho Haus has been selling this crunchy twice-baked bread since 1975. It\'s the first thing every Ilonggo abroad requests from home.',
  },
  {
    id: 'dinuguan',
    name: 'Ilonggo Dinuguan',
    category: 'main',
    description: 'The Ilonggo version of pork blood stew uses native vinegar and siling haba, resulting in a milder, more complex flavor than the Manila version.',
    whereToFind: ['Local carinderias', 'Breakthrough Restaurant', 'Weekend paluto stalls'],
    priceRange: '₱60 – ₱120',
    mustTry: false,
    emoji: '🫕',
    story: 'Each region has its dinuguan. The Ilonggo version adds batwan for subtle tartness, and uses native pork for a richer, darker result.',
  },
  {
    id: 'latik',
    name: 'Latik na Mais',
    category: 'kakanin',
    description: 'A sweet corn cake topped with caramelized coconut milk solids (latik) — soft, chewy, and intensely tropical.',
    whereToFind: ['Public markets', 'Kakanin vendors', 'Weekend tiangge markets'],
    priceRange: '₱15 – ₱40',
    mustTry: false,
    emoji: '🌽',
    story: 'Kakanin (rice/corn sweets) represent the agricultural heart of the Visayas. Latik is made by reducing coconut milk until it separates into golden caramel solids.',
  },
  {
    id: 'tsokolate',
    name: 'Sikwate (Tablea Chocolate)',
    category: 'drink',
    description: 'Thick, rich hot chocolate made from locally roasted and ground cacao tablets — intensely chocolatey, slightly grainy, and utterly addictive.',
    whereToFind: ['Café Barista', 'Smalltalk Café', 'Heritage cafés', 'Guimaras island cafés'],
    priceRange: '₱60 – ₱120',
    mustTry: true,
    emoji: '☕',
    story: 'Tablea is made from pure cacao fermented and roasted locally. Unlike commercial chocolate, sikwate has a roasty bitterness and natural sweetness that connects drinkers to pre-colonial tradition.',
  },
  {
    id: 'seafood-paluto',
    name: 'Paluto Seafood',
    category: 'seafood',
    description: 'Choose your live seafood from Esplanade stalls, select your cooking style (grilled, sinigang, adobo, buttered), and eat riverside as boats glide past.',
    whereToFind: ['Iloilo River Esplanade stalls', 'Tatoy\'s Manokan & Seafood', 'Boulevard seafood row'],
    priceRange: '₱200 – ₱600 per dish',
    mustTry: true,
    emoji: '🦀',
    story: 'Iloilo Bay is one of the Philippines\' richest fishing grounds. "Paluto" means "cook it for me" — you select from fresh daily catch and choose how it\'s prepared.',
  },
]

export const neighborhoods = [
  {
    id: 'jaro',
    name: 'Jaro',
    description: 'The religious and cultural heart of Iloilo. Home to the Jaro Cathedral and the ancestral houses of old Iloilo families.',
    character: 'Heritage & Pilgrimage',
    emoji: '🕍',
    color: '#C41E3A',
  },
  {
    id: 'molo',
    name: 'Molo',
    description: 'The "feminist" district — named for the famous all-female-saint church. Rich in Spanish-era mansions and the birthplace of Pancit Molo.',
    character: 'Heritage & Culture',
    emoji: '⛪',
    color: '#1B4F8A',
  },
  {
    id: 'la-paz',
    name: 'La Paz',
    description: 'Birthplace of the legendary La Paz Batchoy. A working-class district with authentic market culture and the soul of Ilonggo food.',
    character: 'Food & Markets',
    emoji: '🍜',
    color: '#D4A017',
  },
  {
    id: 'city-proper',
    name: 'City Proper',
    description: 'The commercial and administrative center with Spanish-era plaza, city hall, heritage buildings, and the riverside esplanade.',
    character: 'Commerce & Government',
    emoji: '🏙️',
    color: '#6B4423',
  },
  {
    id: 'mandurriao',
    name: 'Mandurriao',
    description: 'Modern Iloilo — home to SM City, the Iloilo Business Park, and the international airport. The city\'s contemporary growth center.',
    character: 'Modern & Business',
    emoji: '✈️',
    color: '#2D6A4F',
  },
  {
    id: 'arevalo',
    name: 'Arevalo',
    description: 'The antiques and crafts district, famous for hand-woven abel fabrics, vintage shops, and the Arevalo Heritage Zone.',
    character: 'Arts & Crafts',
    emoji: '🧵',
    color: '#8B4513',
  },
]
