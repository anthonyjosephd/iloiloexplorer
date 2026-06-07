export interface Place {
  id: string
  name: string
  aliases?: string[]
  category: PlaceCategory
  subcategory?: string
  emoji: string
  lat: number
  lng: number
  address: string
  district: string
  description?: string
  openHours?: string
  priceRange?: string
  tags: string[]
}

export type PlaceCategory =
  | 'heritage'
  | 'church'
  | 'museum'
  | 'restaurant'
  | 'cafe'
  | 'fastfood'
  | 'street_food'
  | 'mall'
  | 'market'
  | 'hotel'
  | 'hospital'
  | 'school'
  | 'government'
  | 'park'
  | 'transport'
  | 'bank'
  | 'shop'
  | 'nightlife'
  | 'beach'

export const categoryConfig: Record<PlaceCategory, { label: string; emoji: string; color: string }> = {
  heritage:    { label: 'Heritage Site',   emoji: '🏛️', color: '#C41E3A' },
  church:      { label: 'Church',          emoji: '⛪', color: '#1B4F8A' },
  museum:      { label: 'Museum',          emoji: '🏺', color: '#6B4423' },
  restaurant:  { label: 'Restaurant',      emoji: '🍽️', color: '#D4A017' },
  cafe:        { label: 'Café',            emoji: '☕', color: '#8B4513' },
  fastfood:    { label: 'Fast Food',       emoji: '🍔', color: '#E65C00' },
  street_food: { label: 'Street Food',     emoji: '🍜', color: '#C41E3A' },
  mall:        { label: 'Mall / Shopping', emoji: '🏬', color: '#2D6A4F' },
  market:      { label: 'Market',          emoji: '🛒', color: '#6B4423' },
  hotel:       { label: 'Hotel',           emoji: '🏨', color: '#1B4F8A' },
  hospital:    { label: 'Hospital',        emoji: '🏥', color: '#C41E3A' },
  school:      { label: 'School / Univ',   emoji: '🎓', color: '#1B4F8A' },
  government:  { label: 'Government',      emoji: '🏛️', color: '#6B4423' },
  park:        { label: 'Park / Nature',   emoji: '🌿', color: '#2D6A4F' },
  transport:   { label: 'Transport Hub',   emoji: '🚌', color: '#8B1A1A' },
  bank:        { label: 'Bank / ATM',      emoji: '🏦', color: '#1B4F8A' },
  shop:        { label: 'Shop / Store',    emoji: '🛍️', color: '#D4A017' },
  nightlife:   { label: 'Nightlife',       emoji: '🌙', color: '#4A0080' },
  beach:       { label: 'Beach / Island',  emoji: '🌊', color: '#1B4F8A' },
}

export const iloiloPlaces: Place[] = [
  // ── HERITAGE & CHURCHES ──────────────────────────────────────────
  {
    id: 'molo-church',
    name: 'Molo Church',
    aliases: ['Saint Anne Parish', 'Molo Simbahan', 'Saint Anne Church'],
    category: 'church',
    emoji: '⛪',
    lat: 10.6953, lng: 122.5434,
    address: 'Molo Plaza, Molo, Iloilo City',
    district: 'Molo',
    description: 'The feminist church of the Philippines — all-female saints on the facade. National Cultural Treasure.',
    openHours: '6:00 AM – 6:00 PM',
    tags: ['heritage', 'free', 'photo spot', 'national cultural treasure', 'baroque'],
  },
  {
    id: 'jaro-cathedral',
    name: 'Jaro Cathedral',
    aliases: ['Nuestra Señora de la Candelaria', 'Jaro Church', 'Jaro Simbahan'],
    category: 'church',
    emoji: '🕍',
    lat: 10.7333, lng: 122.5583,
    address: 'Jaro Plaza, Jaro, Iloilo City',
    district: 'Jaro',
    description: 'Only feminine shrine in Asia. Free-standing bell tower. Pilgrimage site year-round.',
    openHours: '6:00 AM – 7:00 PM',
    tags: ['pilgrimage', 'heritage', 'free', 'shrine', 'asia'],
  },
  {
    id: 'arevalo-church',
    name: 'Arevalo Church',
    aliases: ['Santo Niño de Arevalo', 'Arevalo Parish'],
    category: 'church',
    emoji: '⛪',
    lat: 10.6872, lng: 122.5318,
    address: 'Arevalo District, Iloilo City',
    district: 'Arevalo',
    tags: ['heritage', 'free', 'baroque'],
  },
  {
    id: 'miag-ao-church',
    name: 'Miagao Church',
    aliases: ['Santo Tomas de Villanueva', 'Miag-ao Fortress Church', 'UNESCO church Iloilo'],
    category: 'heritage',
    emoji: '🏛️',
    lat: 10.6509, lng: 122.2367,
    address: 'Miagao, Iloilo (30 min from city)',
    district: 'Miagao',
    description: 'UNESCO World Heritage Site. Baroque coral stone facade with Philippine flora motifs.',
    tags: ['UNESCO', 'world heritage', 'heritage', 'free', 'day trip'],
  },
  {
    id: 'museo-iloilo',
    name: 'Museo Iloilo',
    aliases: ['Iloilo Museum', 'Museo ng Iloilo'],
    category: 'museum',
    emoji: '🏺',
    lat: 10.7180, lng: 122.5680,
    address: 'Bonifacio Drive, City Proper, Iloilo City',
    district: 'City Proper',
    description: 'Premier museum of Western Visayas. Gold artifacts, pottery, Spanish colonial and WWII exhibits.',
    openHours: '9:00 AM – 5:00 PM (Closed Mon)',
    priceRange: '₱50 adult / ₱30 student',
    tags: ['museum', 'history', 'gold artifacts', 'air-conditioned'],
  },
  {
    id: 'esplanade',
    name: 'Iloilo River Esplanade',
    aliases: ['esplanade', 'riverside', 'iloilo river walk', 'boulevard'],
    category: 'park',
    emoji: '🌊',
    lat: 10.7215, lng: 122.5710,
    address: 'Iloilo River, City Proper',
    district: 'City Proper',
    description: '1.5km riverside promenade. Street food, murals, live music on weekends.',
    openHours: 'Open 24 hours',
    priceRange: 'Free',
    tags: ['free', 'nightlife', 'street food', 'river', 'sunset', 'murals'],
  },
  {
    id: 'fort-san-pedro',
    name: 'Fort San Pedro',
    aliases: ['Fort San Pedro Drive', 'Fuerza de Nuestra Señora de la Esperanza'],
    category: 'heritage',
    emoji: '🏰',
    lat: 10.7138, lng: 122.5749,
    address: 'Fort San Pedro Drive, City Proper',
    district: 'City Proper',
    tags: ['heritage', 'history', 'colonial', 'free'],
  },
  {
    id: 'iloilo-business-park',
    name: 'Iloilo Business Park',
    aliases: ['IBP', 'Megaworld Iloilo', 'Festive Walk'],
    category: 'mall',
    emoji: '🏙️',
    lat: 10.7225, lng: 122.5463,
    address: 'Mandurriao, Iloilo City',
    district: 'Mandurriao',
    description: 'Mixed-use development with Festive Walk mall, offices, hotels, and restaurants.',
    openHours: '10:00 AM – 9:00 PM',
    tags: ['mall', 'festive walk', 'megaworld', 'restaurants', 'shopping'],
  },

  // ── MALLS & SHOPPING ─────────────────────────────────────────────
  {
    id: 'sm-city',
    name: 'SM City Iloilo',
    aliases: ['SM Iloilo', 'SM mall Iloilo'],
    category: 'mall',
    emoji: '🏬',
    lat: 10.7388, lng: 122.5472,
    address: 'Benigno Aquino Ave, Mandurriao, Iloilo City',
    district: 'Mandurriao',
    description: 'Largest mall in Iloilo. Cinema, supermarket, food court, department store.',
    openHours: '10:00 AM – 9:00 PM',
    tags: ['mall', 'cinema', 'supermarket', 'shopping', 'air-conditioned'],
  },
  {
    id: 'robinsons-iloilo',
    name: 'Robinsons Place Iloilo',
    aliases: ['Robinsons Iloilo', 'Robinsons mall'],
    category: 'mall',
    emoji: '🏬',
    lat: 10.7278, lng: 122.5494,
    address: 'Ledesma St, City Proper, Iloilo City',
    district: 'City Proper',
    openHours: '10:00 AM – 9:00 PM',
    tags: ['mall', 'shopping', 'cinema', 'supermarket'],
  },
  {
    id: 'gaisano-iloilo',
    name: 'Gaisano City Mall',
    aliases: ['Gaisano mall Iloilo', 'Gaisano'],
    category: 'mall',
    emoji: '🏬',
    lat: 10.7241, lng: 122.5571,
    address: 'Iznart St, City Proper, Iloilo City',
    district: 'City Proper',
    openHours: '9:00 AM – 8:30 PM',
    tags: ['mall', 'department store', 'local mall'],
  },
  {
    id: 'festive-walk',
    name: 'Festive Walk Mall',
    aliases: ['Festive Walk', 'Megaworld Mall Iloilo'],
    category: 'mall',
    emoji: '🛍️',
    lat: 10.7230, lng: 122.5468,
    address: 'Iloilo Business Park, Mandurriao',
    district: 'Mandurriao',
    openHours: '10:00 AM – 9:00 PM',
    tags: ['mall', 'upscale', 'restaurants', 'bars', 'nightlife'],
  },
  {
    id: 'central-market',
    name: 'Iloilo Central Market',
    aliases: ['Central Market', 'Mercado', 'wet market iloilo'],
    category: 'market',
    emoji: '🛒',
    lat: 10.7198, lng: 122.5598,
    address: 'Market Area, City Proper, Iloilo City',
    district: 'City Proper',
    description: 'Main public market. Fresh produce, seafood, pasalubong, biscocho.',
    openHours: '4:00 AM – 6:00 PM',
    tags: ['market', 'fresh produce', 'seafood', 'pasalubong', 'cheap'],
  },
  {
    id: 'lapaz-market',
    name: 'La Paz Public Market',
    aliases: ['La Paz Market', 'lapaz market'],
    category: 'market',
    emoji: '🛒',
    lat: 10.7260, lng: 122.5510,
    address: 'La Paz, Iloilo City',
    district: 'La Paz',
    description: 'Birthplace of La Paz Batchoy. Bustling local market since the 1930s.',
    openHours: '5:00 AM – 6:00 PM',
    tags: ['batchoy', 'market', 'local', 'food'],
  },

  // ── FOOD: BATCHOY INSTITUTIONS ────────────────────────────────────
  {
    id: 'netongs-batchoy',
    name: "Netong's Original La Paz Batchoy",
    aliases: ['Netongs', "Netong's batchoy", 'Netong Batchoy'],
    category: 'restaurant',
    emoji: '🍜',
    lat: 10.7265, lng: 122.5508,
    address: 'La Paz Market, La Paz, Iloilo City',
    district: 'La Paz',
    description: 'One of the original batchoy stalls. The real deal since the 1940s.',
    openHours: '6:00 AM – 3:00 PM',
    priceRange: '₱60–₱120',
    tags: ['batchoy', 'must try', 'iconic', 'original', 'local', 'cash only'],
  },
  {
    id: 'teds-batchoy',
    name: "Ted's Old Timer La Paz Batchoy",
    aliases: ["Ted's batchoy", 'Teds Lapaz Batchoy', 'Old Timer Batchoy'],
    category: 'restaurant',
    emoji: '🍜',
    lat: 10.7255, lng: 122.5515,
    address: 'La Paz Market & multiple branches, Iloilo City',
    district: 'La Paz',
    description: 'Old Timer batchoy chain — the most recognizable batchoy brand in Iloilo.',
    openHours: '6:00 AM – 9:00 PM',
    priceRange: '₱65–₱130',
    tags: ['batchoy', 'must try', 'chain', 'multiple branches'],
  },
  {
    id: 'deco-restaurant',
    name: "Deco's Restaurant",
    aliases: ["Deco's", 'Decos batchoy', 'Deco restaurant Iloilo'],
    category: 'restaurant',
    emoji: '🍜',
    lat: 10.7198, lng: 122.5602,
    address: 'Iznart St, City Proper, Iloilo City',
    district: 'City Proper',
    description: 'Classic Iloilo restaurant famous for batchoy and Ilonggo comfort food.',
    openHours: '7:00 AM – 9:00 PM',
    priceRange: '₱80–₱180',
    tags: ['batchoy', 'ilonggo food', 'local favorite', 'must try'],
  },

  // ── FOOD: ICONIC RESTAURANTS ──────────────────────────────────────
  {
    id: 'breakthrough-restaurant',
    name: 'Breakthrough Restaurant',
    aliases: ['Breakthrough', 'Breakthrough Iloilo'],
    category: 'restaurant',
    emoji: '🦀',
    lat: 10.7190, lng: 122.5430,
    address: 'Villa Beach, Arevalo, Iloilo City',
    district: 'Arevalo',
    description: 'Iconic seafood restaurant on the beach. Famous for fresh seafood, kansi, and tinuom.',
    openHours: '10:00 AM – 9:00 PM',
    priceRange: '₱300–₱800',
    tags: ['seafood', 'kansi', 'tinuom', 'pancit molo', 'beachside', 'iconic'],
  },
  {
    id: 'tatoys-manokan',
    name: "Tatoy's Manokan & Seafood",
    aliases: ["Tatoy's", 'Tatoys', 'Tatoy Iloilo'],
    category: 'restaurant',
    emoji: '🍗',
    lat: 10.7168, lng: 122.5418,
    address: 'Villa Beach, Arevalo, Iloilo City',
    district: 'Arevalo',
    description: 'Beloved open-air restaurant. Inato-style chicken inasal, fresh seafood, and river views.',
    openHours: '10:00 AM – 9:30 PM',
    priceRange: '₱200–₱600',
    tags: ['chicken inasal', 'seafood', 'beachside', 'local favorite', 'open air'],
  },
  {
    id: 'robertos-kansi',
    name: "Roberto's Kansi",
    aliases: ['Robertos Kansi', 'kansi iloilo', 'Roberto Kansi'],
    category: 'restaurant',
    emoji: '🍖',
    lat: 10.7145, lng: 122.5588,
    address: 'Molo, Iloilo City',
    district: 'Molo',
    description: 'The definitive kansi destination — beef bone marrow soured with batwan.',
    openHours: '7:00 AM – 6:00 PM',
    priceRange: '₱200–₱400',
    tags: ['kansi', 'must try', 'beef', 'bone marrow', 'batwan', 'ilonggo'],
  },
  {
    id: 'manokan-country',
    name: 'Manokan Country',
    aliases: ['Manokan Country Iloilo', 'chicken row iloilo'],
    category: 'restaurant',
    emoji: '🍗',
    lat: 10.7202, lng: 122.5577,
    address: 'Near SM City, Mandurriao, Iloilo City',
    district: 'Mandurriao',
    description: 'A row of open-air chicken inasal restaurants — the original chicken grilling strip.',
    openHours: '5:00 PM – 12:00 AM',
    priceRange: '₱100–₱300',
    tags: ['chicken inasal', 'inasal', 'open air', 'dinner', 'budget', 'grilled'],
  },
  {
    id: 'biscocho-haus',
    name: 'Biscocho Haus',
    aliases: ['biscocho house', 'biscocho iloilo', 'Biscocho-Haus'],
    category: 'shop',
    emoji: '🥖',
    lat: 10.7305, lng: 122.5565,
    address: 'General Luna St, Jaro, Iloilo City',
    district: 'Jaro',
    description: 'The original biscocho bakery since 1975. Best pasalubong in Iloilo.',
    openHours: '8:00 AM – 7:00 PM',
    priceRange: '₱80–₱250',
    tags: ['biscocho', 'pasalubong', 'bakery', 'olives', 'broas', 'gift'],
  },
  {
    id: 'merceds-biscocho',
    name: "Merced's Biscocho",
    aliases: ["Merced's", 'Merceds biscocho'],
    category: 'shop',
    emoji: '🥖',
    lat: 10.7295, lng: 122.5572,
    address: 'Jaro, Iloilo City',
    district: 'Jaro',
    openHours: '8:00 AM – 6:00 PM',
    priceRange: '₱80–₱200',
    tags: ['biscocho', 'pasalubong', 'bakery'],
  },

  // ── CAFÉS ────────────────────────────────────────────────────────
  {
    id: 'smalltalk-cafe',
    name: 'Smalltalk Café',
    aliases: ['Small Talk Cafe', 'Smalltalk Coffee'],
    category: 'cafe',
    emoji: '☕',
    lat: 10.7222, lng: 122.5465,
    address: 'Festive Walk, Iloilo Business Park, Mandurriao',
    district: 'Mandurriao',
    description: 'Popular local café chain known for sikwate (tablea chocolate) and local pastries.',
    openHours: '8:00 AM – 10:00 PM',
    priceRange: '₱80–₱200',
    tags: ['coffee', 'sikwate', 'tablea', 'local cafe', 'chill', 'wifi'],
  },
  {
    id: 'cafe-barista',
    name: 'Café Barista',
    aliases: ['Cafe Barista Iloilo'],
    category: 'cafe',
    emoji: '☕',
    lat: 10.7215, lng: 122.5578,
    address: 'Multiple branches, Iloilo City',
    district: 'City Proper',
    openHours: '7:00 AM – 10:00 PM',
    priceRange: '₱80–₱180',
    tags: ['coffee', 'local chain', 'wifi', 'study spot'],
  },
  {
    id: 'starbucks-iloilo',
    name: 'Starbucks Iloilo',
    aliases: ['Starbucks', 'starbucks SM iloilo'],
    category: 'cafe',
    emoji: '☕',
    lat: 10.7385, lng: 122.5475,
    address: 'SM City Iloilo, Mandurriao',
    district: 'Mandurriao',
    openHours: '8:00 AM – 10:00 PM',
    priceRange: '₱150–₱350',
    tags: ['coffee', 'wifi', 'international', 'air-conditioned'],
  },

  // ── FAST FOOD ────────────────────────────────────────────────────
  {
    id: 'jollibee-iloilo',
    name: 'Jollibee Iloilo',
    aliases: ['Jollibee', 'jolibee iloilo'],
    category: 'fastfood',
    emoji: '🍔',
    lat: 10.7202, lng: 122.5581,
    address: 'Multiple branches, Iloilo City',
    district: 'City Proper',
    openHours: '6:00 AM – 12:00 AM',
    priceRange: '₱80–₱250',
    tags: ['fast food', 'filipino', 'chicken joy', 'budget', '24 hours'],
  },
  {
    id: 'mcdonalds-iloilo',
    name: "McDonald's Iloilo",
    aliases: ['mcdo iloilo', 'mcdonalds', 'McDo'],
    category: 'fastfood',
    emoji: '🍔',
    lat: 10.7390, lng: 122.5468,
    address: 'SM City & other branches, Iloilo City',
    district: 'Mandurriao',
    openHours: '24 hours (SM branch)',
    priceRange: '₱80–₱280',
    tags: ['fast food', 'international', 'budget', '24 hours'],
  },

  // ── HOTELS ───────────────────────────────────────────────────────
  {
    id: 'richmonde-hotel',
    name: 'Richmonde Hotel Iloilo',
    aliases: ['Richmonde Iloilo', 'Richmonde'],
    category: 'hotel',
    emoji: '🏨',
    lat: 10.7228, lng: 122.5461,
    address: 'Iloilo Business Park, Mandurriao',
    district: 'Mandurriao',
    description: '5-star hotel in the heart of Iloilo Business Park.',
    priceRange: '₱4,000–₱10,000/night',
    tags: ['hotel', '5 star', 'luxury', 'business park'],
  },
  {
    id: 'hotel-del-rio',
    name: 'Hotel del Rio',
    aliases: ['Del Rio Hotel', 'Hotel del Rio Iloilo'],
    category: 'hotel',
    emoji: '🏨',
    lat: 10.7212, lng: 122.5720,
    address: 'MH del Pilar St, Molo, Iloilo City',
    district: 'Molo',
    priceRange: '₱2,500–₱6,000/night',
    tags: ['hotel', 'heritage', 'riverside', 'midrange'],
  },
  {
    id: 'crimson-hotel',
    name: 'Crimson Hotel Filinvest City Iloilo',
    aliases: ['Crimson Hotel Iloilo', 'Crimson Iloilo'],
    category: 'hotel',
    emoji: '🏨',
    lat: 10.7240, lng: 122.5455,
    address: 'Mandurriao, Iloilo City',
    district: 'Mandurriao',
    priceRange: '₱3,500–₱9,000/night',
    tags: ['hotel', 'luxury', '5 star', 'pool'],
  },
  {
    id: 'microtel-iloilo',
    name: 'Microtel by Wyndham Iloilo',
    aliases: ['Microtel Iloilo', 'Microtel'],
    category: 'hotel',
    emoji: '🏨',
    lat: 10.7395, lng: 122.5480,
    address: 'Near SM City, Mandurriao',
    district: 'Mandurriao',
    priceRange: '₱1,500–₱4,000/night',
    tags: ['hotel', 'budget', 'midrange', 'SM area'],
  },

  // ── HOSPITALS ────────────────────────────────────────────────────
  {
    id: 'western-visayas-medical',
    name: 'Western Visayas Medical Center',
    aliases: ['WVMC', 'Western Visayas Medical', 'government hospital iloilo'],
    category: 'hospital',
    emoji: '🏥',
    lat: 10.7302, lng: 122.5621,
    address: 'Q. Abeto St, Mandurriao, Iloilo City',
    district: 'Mandurriao',
    description: 'Main government hospital of Western Visayas.',
    openHours: '24 hours',
    tags: ['hospital', 'emergency', 'government', '24 hours'],
  },
  {
    id: 'st-paul-hospital',
    name: "St. Paul's Hospital Iloilo",
    aliases: ['Saint Paul Hospital', 'St Paul Hospital Iloilo'],
    category: 'hospital',
    emoji: '🏥',
    lat: 10.7335, lng: 122.5608,
    address: 'General Luna St, Jaro, Iloilo City',
    district: 'Jaro',
    openHours: '24 hours',
    tags: ['hospital', 'private', 'emergency', '24 hours'],
  },
  {
    id: 'iloilo-doctors',
    name: "Iloilo Doctors' Hospital",
    aliases: ["Iloilo Doctors Hospital", "Iloilo Doctor's", 'IDH'],
    category: 'hospital',
    emoji: '🏥',
    lat: 10.7195, lng: 122.5560,
    address: 'West Ave, City Proper, Iloilo City',
    district: 'City Proper',
    openHours: '24 hours',
    tags: ['hospital', 'private', 'emergency', '24 hours'],
  },

  // ── SCHOOLS & UNIVERSITIES ───────────────────────────────────────
  {
    id: 'cpu',
    name: 'Central Philippine University',
    aliases: ['CPU', 'Central Philippine University Iloilo'],
    category: 'school',
    emoji: '🎓',
    lat: 10.7185, lng: 122.5508,
    address: 'Lopez Jaena St, Jaro, Iloilo City',
    district: 'Jaro',
    description: 'Leading Baptist university in the Philippines, founded 1905.',
    tags: ['university', 'school', 'historic campus'],
  },
  {
    id: 'usp-visayas',
    name: 'University of the Philippines Visayas',
    aliases: ['UP Visayas', 'UPV', 'UP Iloilo'],
    category: 'school',
    emoji: '🎓',
    lat: 10.7350, lng: 122.5730,
    address: 'Miagao, Iloilo (main campus)',
    district: 'Mandurriao (city campus)',
    tags: ['university', 'state university', 'UP system'],
  },
  {
    id: 'wvu-iloilo',
    name: 'West Visayas State University',
    aliases: ['WVSU', 'West Visayas State'],
    category: 'school',
    emoji: '🎓',
    lat: 10.7232, lng: 122.5483,
    address: 'Luna St, La Paz, Iloilo City',
    district: 'La Paz',
    tags: ['university', 'state university', 'nursing', 'education'],
  },

  // ── TRANSPORT ────────────────────────────────────────────────────
  {
    id: 'iloilo-airport',
    name: 'Iloilo International Airport',
    aliases: ['airport', 'ILO', 'Iloilo airport', 'international airport'],
    category: 'transport',
    emoji: '✈️',
    lat: 10.7652, lng: 122.5453,
    address: 'Cabatuan, Iloilo (near Mandurriao)',
    district: 'Mandurriao',
    openHours: '4:00 AM – 11:00 PM',
    tags: ['airport', 'terminal', 'flights', 'transport'],
  },
  {
    id: 'tagbak-terminal',
    name: 'Tagbak Bus Terminal',
    aliases: ['Tagbak terminal', 'bus terminal iloilo', 'northern terminal'],
    category: 'transport',
    emoji: '🚌',
    lat: 10.7420, lng: 122.5380,
    address: 'Tagbak, Jaro, Iloilo City',
    district: 'Jaro',
    description: 'Main inter-city bus terminal. Routes to Miagao, Antique, Caticlan, Bacolod.',
    tags: ['bus', 'terminal', 'inter-city', 'transport'],
  },
  {
    id: 'ortiz-wharf',
    name: 'Ortiz Wharf (Ferry to Guimaras)',
    aliases: ['Jordan Wharf', 'Ortiz wharf', 'Guimaras ferry', 'wharf iloilo'],
    category: 'transport',
    emoji: '⛴️',
    lat: 10.7128, lng: 122.5756,
    address: 'Ortiz, City Proper, Iloilo City',
    district: 'City Proper',
    description: 'Ferry terminal to Guimaras Island. ₱14 motorboat fare, 15 min crossing.',
    openHours: '5:00 AM – 6:00 PM',
    tags: ['ferry', 'guimaras', 'wharf', 'island', 'transport'],
  },

  // ── BANKS ────────────────────────────────────────────────────────
  {
    id: 'bpi-iloilo',
    name: 'BPI Iloilo',
    aliases: ['Bank of the Philippine Islands Iloilo', 'BPI'],
    category: 'bank',
    emoji: '🏦',
    lat: 10.7205, lng: 122.5609,
    address: 'Iznart St, City Proper, Iloilo City',
    district: 'City Proper',
    openHours: '9:00 AM – 4:00 PM (Mon–Fri)',
    tags: ['bank', 'ATM', 'BPI'],
  },
  {
    id: 'bdo-iloilo',
    name: 'BDO Iloilo',
    aliases: ['Banco de Oro Iloilo', 'BDO'],
    category: 'bank',
    emoji: '🏦',
    lat: 10.7200, lng: 122.5615,
    address: 'Multiple branches, Iloilo City',
    district: 'City Proper',
    openHours: '9:00 AM – 4:00 PM (Mon–Fri)',
    tags: ['bank', 'ATM', 'BDO'],
  },

  // ── PARKS & NATURE ───────────────────────────────────────────────
  {
    id: 'plaza-libertad',
    name: 'Plaza Libertad',
    aliases: ['Plaza Libertad Iloilo', 'City Plaza'],
    category: 'park',
    emoji: '🌿',
    lat: 10.7202, lng: 122.5604,
    address: 'City Proper, Iloilo City',
    district: 'City Proper',
    description: 'Historic city plaza surrounded by heritage buildings and the city hall.',
    openHours: 'Open 24 hours',
    tags: ['park', 'free', 'heritage', 'historic'],
  },
  {
    id: 'guimaras-island',
    name: 'Guimaras Island',
    aliases: ['Guimaras', 'Guimaras province', 'mango island'],
    category: 'beach',
    emoji: '🥭',
    lat: 10.5988, lng: 122.6292,
    address: 'Guimaras Province (15 min ferry from Iloilo)',
    district: 'Guimaras',
    description: 'World-famous for the sweetest mangoes. Pristine beaches and island resorts.',
    tags: ['island', 'beach', 'mangoes', 'day trip', 'ferry', 'nature'],
  },

  // ── NIGHTLIFE ────────────────────────────────────────────────────
  {
    id: 'the-district-festive',
    name: 'The District Bars (Festive Walk)',
    aliases: ['Festive Walk bar strip', 'IBP bars', 'Iloilo bar strip'],
    category: 'nightlife',
    emoji: '🍻',
    lat: 10.7227, lng: 122.5466,
    address: 'Festive Walk, Iloilo Business Park',
    district: 'Mandurriao',
    description: 'The main nightlife strip — craft beer bars, live music, restaurants open late.',
    openHours: '5:00 PM – 2:00 AM',
    tags: ['bars', 'nightlife', 'live music', 'craft beer', 'late night'],
  },

  // ── GOVERNMENT ───────────────────────────────────────────────────
  {
    id: 'iloilo-city-hall',
    name: 'Iloilo City Hall',
    aliases: ['City Hall Iloilo', 'Iloilo City government'],
    category: 'government',
    emoji: '🏛️',
    lat: 10.7200, lng: 122.5618,
    address: 'Plaza Libertad, City Proper, Iloilo City',
    district: 'City Proper',
    openHours: '8:00 AM – 5:00 PM (Mon–Fri)',
    tags: ['government', 'city hall', 'transactions'],
  },
]

// Full-text search across all fields
export function searchPlaces(query: string): Place[] {
  if (!query.trim()) return []
  const q = query.toLowerCase()
  return iloiloPlaces
    .filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.aliases?.some(a => a.toLowerCase().includes(q)) ||
      p.district.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      categoryConfig[p.category].label.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q)) ||
      p.address.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.subcategory?.toLowerCase().includes(q)
    )
    .slice(0, 10)
}

// Get places by category
export function getPlacesByCategory(category: PlaceCategory): Place[] {
  return iloiloPlaces.filter(p => p.category === category)
}

// Get nearby places (simple bounding box)
export function getNearbyPlaces(lat: number, lng: number, radiusDeg = 0.02): Place[] {
  return iloiloPlaces.filter(p =>
    Math.abs(p.lat - lat) < radiusDeg && Math.abs(p.lng - lng) < radiusDeg
  )
}
