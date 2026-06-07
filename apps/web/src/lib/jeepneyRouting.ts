// Haversine distance in meters
export function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function minsWalk(meters: number) { return Math.max(1, Math.round(meters / 80)) }
export function minsRide(meters: number) { return Math.max(3, Math.round(meters / 280) + 3) }

export interface BoardingStop {
  name: string
  lat: number
  lng: number
  routeCodes: string[]
  walkMeters?: number
}

export interface JeepneyRoute {
  code: string
  name: string
  color: string
  boardingStops: BoardingStop[]
  destinations: RouteDestination[]
  fare: { base: number; max: number }
  frequency: string
  operatingHours: string
  path: [number, number][]
}

export interface RouteDestination {
  placeId: string
  alightAt: string
  lat: number
  lng: number
}

export interface RouteRecommendation {
  route: JeepneyRoute
  boardingStop: BoardingStop
  destination: RouteDestination
  walkToStop: number
  rideMeters: number
  totalFare: string
  walkMinutes: number
  rideMinutes: number
  totalMinutes: number
  confidence: 'direct' | 'nearby' | 'transfer'
  tip?: string
}

// ─── KNOWN ORIGIN LANDMARKS ─────────────────────────────────────────────────
export const knownOrigins = [
  { id: 'festive-walk',       name: 'Festive Walk / Iloilo Business Park', lat: 10.7225, lng: 122.5463 },
  { id: 'sm-city-origin',     name: 'SM City Iloilo',                      lat: 10.7388, lng: 122.5472 },
  { id: 'robinsons-origin',   name: 'Robinsons Place Iloilo',              lat: 10.7278, lng: 122.5494 },
  { id: 'jaro-plaza-origin',  name: 'Jaro Plaza',                          lat: 10.7333, lng: 122.5583 },
  { id: 'molo-plaza-origin',  name: 'Molo Plaza',                         lat: 10.6953, lng: 122.5434 },
  { id: 'lapaz-origin',       name: 'La Paz Market',                       lat: 10.7260, lng: 122.5510 },
  { id: 'downtown-origin',    name: 'City Proper / Downtown',              lat: 10.7202, lng: 122.5604 },
  { id: 'airport-origin',     name: 'Iloilo Airport',                      lat: 10.7652, lng: 122.5453 },
  { id: 'tagbak-origin',      name: 'Tagbak Terminal',                     lat: 10.7420, lng: 122.5380 },
  { id: 'wvmc-origin',        name: 'Western Visayas Medical Center',      lat: 10.7302, lng: 122.5621 },
]

// ─── JEEPNEY NETWORK ─────────────────────────────────────────────────────────
export const jeepneyNetwork: JeepneyRoute[] = [
  {
    code: '02B',
    name: 'Jaro – City Proper – La Paz',
    color: '#C41E3A',
    fare: { base: 13, max: 25 },
    frequency: 'Every 5–10 min',
    operatingHours: '5:00 AM – 10:00 PM',
    boardingStops: [
      { name: 'Jaro Terminal / Jaro Plaza',      lat: 10.7333, lng: 122.5583, routeCodes: ['02B'] },
      { name: 'Lopez Jaena St (CPU Gate)',        lat: 10.7185, lng: 122.5508, routeCodes: ['02B'] },
      { name: 'Rizal St / City Hall',             lat: 10.7202, lng: 122.5621, routeCodes: ['02B', '03C'] },
      { name: 'Central Market / Iznart St',       lat: 10.7198, lng: 122.5598, routeCodes: ['02B', '03C'] },
      { name: 'La Paz Market',                    lat: 10.7260, lng: 122.5510, routeCodes: ['02B'] },
      { name: 'Biscocho Haus / Gen. Luna St',     lat: 10.7305, lng: 122.5565, routeCodes: ['02B'] },
    ],
    destinations: [
      { placeId: 'jaro-cathedral',      alightAt: 'Jaro Plaza',                 lat: 10.7333, lng: 122.5583 },
      { placeId: 'lapaz-market',        alightAt: 'La Paz Market',              lat: 10.7260, lng: 122.5510 },
      { placeId: 'netongs-batchoy',     alightAt: 'La Paz Market',              lat: 10.7260, lng: 122.5510 },
      { placeId: 'teds-batchoy',        alightAt: 'La Paz Market',              lat: 10.7260, lng: 122.5510 },
      { placeId: 'central-market',      alightAt: 'Central Market',             lat: 10.7198, lng: 122.5598 },
      { placeId: 'iloilo-city-hall',    alightAt: 'Plaza Libertad / City Hall', lat: 10.7202, lng: 122.5621 },
      { placeId: 'plaza-libertad',      alightAt: 'Plaza Libertad',             lat: 10.7202, lng: 122.5604 },
      { placeId: 'cpu',                 alightAt: 'CPU Gate, Lopez Jaena St',   lat: 10.7185, lng: 122.5508 },
      { placeId: 'wvu-iloilo',          alightAt: 'WVSU Gate, Luna St',         lat: 10.7232, lng: 122.5483 },
      { placeId: 'biscocho-haus',       alightAt: 'Gen. Luna St, Jaro',         lat: 10.7305, lng: 122.5565 },
      { placeId: 'merceds-biscocho',    alightAt: 'Jaro area',                  lat: 10.7295, lng: 122.5572 },
      { placeId: 'st-paul-hospital',    alightAt: 'Jaro area',                  lat: 10.7335, lng: 122.5608 },
      { placeId: 'deco-restaurant',     alightAt: 'Iznart St / City Proper',    lat: 10.7198, lng: 122.5602 },
      { placeId: 'iloilo-doctors',      alightAt: 'West Ave, City Proper',      lat: 10.7195, lng: 122.5560 },
      { placeId: 'gaisano-iloilo',      alightAt: 'Iznart St',                  lat: 10.7241, lng: 122.5571 },
      { placeId: 'bpi-iloilo',          alightAt: 'City Proper',                lat: 10.7205, lng: 122.5609 },
      { placeId: 'bdo-iloilo',          alightAt: 'City Proper',                lat: 10.7200, lng: 122.5615 },
      { placeId: 'jollibee-iloilo',     alightAt: 'City Proper',                lat: 10.7202, lng: 122.5581 },
    ],
    path: [
      [10.7333, 122.5583], [10.7305, 122.5575], [10.7260, 122.5550],
      [10.7232, 122.5530], [10.7202, 122.5621], [10.7198, 122.5598],
      [10.7185, 122.5508], [10.7260, 122.5510],
    ],
  },
  {
    code: '03C',
    name: 'Mandurriao – Downtown – Molo',
    color: '#1B4F8A',
    fare: { base: 13, max: 30 },
    frequency: 'Every 10–15 min',
    operatingHours: '5:30 AM – 9:00 PM',
    boardingStops: [
      { name: 'SM City Iloilo',                  lat: 10.7388, lng: 122.5472, routeCodes: ['03C', '04A', 'SA'] },
      { name: 'Robinsons Place',                  lat: 10.7278, lng: 122.5494, routeCodes: ['03C', '04A'] },
      { name: 'Iznart St / Gaisano',              lat: 10.7205, lng: 122.5609, routeCodes: ['02B', '03C', '08'] },
      { name: 'Plaza Libertad',                   lat: 10.7202, lng: 122.5604, routeCodes: ['03C', '08'] },
      { name: 'Molo Plaza',                       lat: 10.6953, lng: 122.5434, routeCodes: ['03C'] },
      { name: 'Diversion Rd / Airport Rd',        lat: 10.7340, lng: 122.5520, routeCodes: ['03C', '04A'] },
    ],
    destinations: [
      { placeId: 'molo-church',         alightAt: 'Molo Plaza',                 lat: 10.6953, lng: 122.5434 },
      { placeId: 'sm-city',             alightAt: 'SM City Iloilo',             lat: 10.7388, lng: 122.5472 },
      { placeId: 'robinsons-iloilo',    alightAt: 'Robinsons Place',            lat: 10.7278, lng: 122.5494 },
      { placeId: 'plaza-libertad',      alightAt: 'Plaza Libertad',             lat: 10.7202, lng: 122.5604 },
      { placeId: 'iloilo-city-hall',    alightAt: 'Plaza Libertad',             lat: 10.7202, lng: 122.5604 },
      { placeId: 'gaisano-iloilo',      alightAt: 'Iznart St',                  lat: 10.7241, lng: 122.5571 },
      { placeId: 'deco-restaurant',     alightAt: 'Iznart St / City Proper',    lat: 10.7198, lng: 122.5602 },
      { placeId: 'museum-iloilo',       alightAt: 'Bonifacio Drive',            lat: 10.7180, lng: 122.5680 },
      { placeId: 'jollibee-iloilo',     alightAt: 'City Proper',                lat: 10.7202, lng: 122.5581 },
      { placeId: 'mcdonalds-iloilo',    alightAt: 'SM City',                    lat: 10.7390, lng: 122.5468 },
      { placeId: 'starbucks-iloilo',    alightAt: 'SM City',                    lat: 10.7385, lng: 122.5475 },
      { placeId: 'microtel-iloilo',     alightAt: 'SM City area',               lat: 10.7395, lng: 122.5480 },
      { placeId: 'western-visayas-medical', alightAt: 'WVMC, Mandurriao',       lat: 10.7302, lng: 122.5621 },
    ],
    path: [
      [10.7388, 122.5472], [10.7340, 122.5520], [10.7278, 122.5494],
      [10.7241, 122.5571], [10.7205, 122.5609], [10.7202, 122.5604],
      [10.7150, 122.5550], [10.7050, 122.5490], [10.6953, 122.5434],
    ],
  },
  {
    code: '04A',
    name: 'Diversion Road Loop',
    color: '#D4A017',
    fare: { base: 13, max: 28 },
    frequency: 'Every 15 min',
    operatingHours: '6:00 AM – 9:30 PM',
    boardingStops: [
      { name: 'Tagbak Terminal',                  lat: 10.7420, lng: 122.5380, routeCodes: ['04A', '02B'] },
      { name: 'SM City Iloilo',                   lat: 10.7388, lng: 122.5472, routeCodes: ['03C', '04A', 'SA'] },
      { name: 'Robinsons Place',                  lat: 10.7278, lng: 122.5494, routeCodes: ['03C', '04A'] },
      { name: 'Iloilo Business Park / Festive Walk', lat: 10.7225, lng: 122.5463, routeCodes: ['04A'] },
      { name: 'Gaisano Mall / Iznart St',         lat: 10.7241, lng: 122.5571, routeCodes: ['03C', '04A'] },
      { name: 'Diversion Rd / Airport Rd',        lat: 10.7340, lng: 122.5520, routeCodes: ['03C', '04A'] },
    ],
    destinations: [
      { placeId: 'tagbak-terminal',     alightAt: 'Tagbak Terminal',            lat: 10.7420, lng: 122.5380 },
      { placeId: 'sm-city',             alightAt: 'SM City Iloilo',             lat: 10.7388, lng: 122.5472 },
      { placeId: 'robinsons-iloilo',    alightAt: 'Robinsons Place',            lat: 10.7278, lng: 122.5494 },
      { placeId: 'festive-walk',        alightAt: 'Iloilo Business Park',       lat: 10.7225, lng: 122.5463 },
      { placeId: 'iloilo-business-park',alightAt: 'Iloilo Business Park',       lat: 10.7225, lng: 122.5463 },
      { placeId: 'richmonde-hotel',     alightAt: 'Iloilo Business Park',       lat: 10.7228, lng: 122.5461 },
      { placeId: 'crimson-hotel',       alightAt: 'IBP area',                   lat: 10.7240, lng: 122.5455 },
      { placeId: 'smalltalk-cafe',      alightAt: 'Iloilo Business Park',       lat: 10.7222, lng: 122.5465 },
      { placeId: 'the-district-festive',alightAt: 'Iloilo Business Park',       lat: 10.7227, lng: 122.5466 },
      { placeId: 'gaisano-iloilo',      alightAt: 'Gaisano Mall',               lat: 10.7241, lng: 122.5571 },
      { placeId: 'wvu-iloilo',          alightAt: 'WVSU Gate, Luna St / La Paz',lat: 10.7232, lng: 122.5483 },
      { placeId: 'manokan-country',     alightAt: 'SM City area',               lat: 10.7202, lng: 122.5577 },
      { placeId: 'mcdonalds-iloilo',    alightAt: 'SM City',                    lat: 10.7390, lng: 122.5468 },
      { placeId: 'starbucks-iloilo',    alightAt: 'SM City',                    lat: 10.7385, lng: 122.5475 },
      { placeId: 'microtel-iloilo',     alightAt: 'SM City area',               lat: 10.7395, lng: 122.5480 },
      { placeId: 'western-visayas-medical', alightAt: 'WVMC, Q. Abeto St',      lat: 10.7302, lng: 122.5621 },
      { placeId: 'cafe-barista',        alightAt: 'City Proper area',           lat: 10.7215, lng: 122.5578 },
    ],
    path: [
      [10.7420, 122.5380], [10.7388, 122.5472], [10.7340, 122.5520],
      [10.7278, 122.5494], [10.7241, 122.5571], [10.7225, 122.5463],
      [10.7232, 122.5483], [10.7202, 122.5577], [10.7420, 122.5380],
    ],
  },
  {
    code: '08',
    name: 'Downtown – Esplanade – Wharf',
    color: '#6B4423',
    fare: { base: 13, max: 20 },
    frequency: 'Every 10 min',
    operatingHours: '5:00 AM – 9:00 PM',
    boardingStops: [
      { name: 'Iznart St / Ledesma St',           lat: 10.7205, lng: 122.5609, routeCodes: ['02B', '03C', '08'] },
      { name: 'Bonifacio Drive',                  lat: 10.7180, lng: 122.5680, routeCodes: ['08'] },
      { name: 'Esplanade / Carpenter\'s Bridge',  lat: 10.7215, lng: 122.5710, routeCodes: ['08'] },
      { name: 'Fort San Pedro Drive',             lat: 10.7138, lng: 122.5749, routeCodes: ['08'] },
      { name: 'Ortiz Wharf',                      lat: 10.7128, lng: 122.5756, routeCodes: ['08'] },
    ],
    destinations: [
      { placeId: 'esplanade',           alightAt: "Carpenter's Bridge / Esplanade", lat: 10.7215, lng: 122.5710 },
      { placeId: 'museo-iloilo',        alightAt: 'Bonifacio Drive',            lat: 10.7180, lng: 122.5680 },
      { placeId: 'ortiz-wharf',         alightAt: 'Ortiz Wharf',                lat: 10.7128, lng: 122.5756 },
      { placeId: 'guimaras-island',     alightAt: 'Ortiz Wharf (ferry to Guimaras)', lat: 10.7128, lng: 122.5756 },
      { placeId: 'fort-san-pedro',      alightAt: 'Fort San Pedro Drive',       lat: 10.7138, lng: 122.5749 },
      { placeId: 'hotel-del-rio',       alightAt: 'MH del Pilar St',            lat: 10.7212, lng: 122.5720 },
      { placeId: 'iloilo-doctors',      alightAt: 'West Ave, City Proper',      lat: 10.7195, lng: 122.5560 },
    ],
    path: [
      [10.7205, 122.5609], [10.7195, 122.5620], [10.7190, 122.5650],
      [10.7180, 122.5680], [10.7215, 122.5710], [10.7150, 122.5728],
      [10.7138, 122.5749], [10.7128, 122.5756],
    ],
  },
  {
    code: '11',
    name: 'Pavia – Arevalo Heritage',
    color: '#2D6A4F',
    fare: { base: 13, max: 35 },
    frequency: 'Every 20 min',
    operatingHours: '5:00 AM – 7:00 PM',
    boardingStops: [
      { name: 'La Paz area',                      lat: 10.7232, lng: 122.5483, routeCodes: ['11'] },
      { name: 'Molo Plaza',                       lat: 10.6953, lng: 122.5434, routeCodes: ['03C', '11'] },
      { name: 'Arevalo Market',                   lat: 10.6860, lng: 122.5320, routeCodes: ['11'] },
    ],
    destinations: [
      { placeId: 'arevalo-antiques',    alightAt: 'Arevalo Market',             lat: 10.6860, lng: 122.5320 },
      { placeId: 'arevalo-church',      alightAt: 'Arevalo Church',             lat: 10.6872, lng: 122.5318 },
      { placeId: 'breakthrough-restaurant', alightAt: 'Villa Beach, Arevalo',   lat: 10.7190, lng: 122.5430 },
      { placeId: 'tatoys-manokan',      alightAt: 'Villa Beach, Arevalo',       lat: 10.7168, lng: 122.5418 },
      { placeId: 'robertos-kansi',      alightAt: 'Molo area',                  lat: 10.7145, lng: 122.5588 },
    ],
    path: [
      [10.7232, 122.5483], [10.7150, 122.5460], [10.7050, 122.5430],
      [10.6953, 122.5434], [10.6900, 122.5370], [10.6860, 122.5320],
    ],
  },
  {
    code: 'SA',
    name: 'Special Airport Route',
    color: '#8B1A1A',
    fare: { base: 30, max: 50 },
    frequency: 'Every 30 min',
    operatingHours: '4:00 AM – 11:00 PM',
    boardingStops: [
      { name: 'City Terminal / City Proper',      lat: 10.7202, lng: 122.5621, routeCodes: ['SA'] },
      { name: 'SM City Iloilo',                   lat: 10.7388, lng: 122.5472, routeCodes: ['03C', '04A', 'SA'] },
      { name: 'Airport Road / Mandurriao',        lat: 10.7500, lng: 122.5450, routeCodes: ['SA'] },
    ],
    destinations: [
      { placeId: 'iloilo-airport',      alightAt: 'Iloilo International Airport Terminal', lat: 10.7652, lng: 122.5453 },
    ],
    path: [
      [10.7202, 122.5621], [10.7388, 122.5472], [10.7500, 122.5455],
      [10.7580, 122.5453], [10.7652, 122.5453],
    ],
  },
]

// ─── ROUTING ENGINE ──────────────────────────────────────────────────────────

export function findRoutes(
  userLat: number,
  userLng: number,
  destinationPlaceId: string
): RouteRecommendation[] {
  const recommendations: RouteRecommendation[] = []

  for (const route of jeepneyNetwork) {
    const routeDests = route.destinations.filter(d => d.placeId === destinationPlaceId)
    if (routeDests.length === 0) continue

    // Find nearest boarding stop to user
    let nearestStop: BoardingStop | null = null
    let minWalk = Infinity
    for (const stop of route.boardingStops) {
      const dist = getDistance(userLat, userLng, stop.lat, stop.lng)
      if (dist < minWalk) { minWalk = dist; nearestStop = stop }
    }
    if (!nearestStop) continue

    for (const dest of routeDests) {
      const walkM = Math.round(minWalk)
      const rideM = Math.round(getDistance(nearestStop.lat, nearestStop.lng, dest.lat, dest.lng))
      const wMin = minsWalk(walkM)
      const rMin = minsRide(rideM)

      // Build tip based on route
      let tip = ''
      if (destinationPlaceId === 'wvu-iloilo') {
        tip = 'Tell the driver "WVSU" or "Luna Street". The university gate is on Luna St, La Paz.'
      } else if (destinationPlaceId === 'iloilo-airport') {
        tip = 'If you have heavy bags, take Grab instead. Jeepney is fine for carry-on only.'
      } else if (destinationPlaceId.includes('batchoy') || destinationPlaceId === 'lapaz-market') {
        tip = 'Go before 9am for the freshest batchoy. Ask for "special" — it has everything.'
      }

      recommendations.push({
        route,
        boardingStop: { ...nearestStop, walkMeters: walkM },
        destination: dest,
        walkToStop: walkM,
        rideMeters: rideM,
        totalFare: `₱${route.fare.base}${route.fare.max > route.fare.base ? `–₱${route.fare.max}` : ''}`,
        walkMinutes: wMin,
        rideMinutes: rMin,
        totalMinutes: wMin + rMin,
        confidence: walkM < 250 ? 'direct' : walkM < 700 ? 'nearby' : 'transfer',
        tip,
      })
    }
  }

  return recommendations
    .sort((a, b) => {
      const order = { direct: 0, nearby: 1, transfer: 2 }
      if (order[a.confidence] !== order[b.confidence]) return order[a.confidence] - order[b.confidence]
      return a.totalMinutes - b.totalMinutes
    })
    .slice(0, 4) // top 4 options
}

export function findNearbyBoarding(userLat: number, userLng: number, maxWalkMeters = 700) {
  const results: { stop: BoardingStop; route: JeepneyRoute; walkMeters: number }[] = []
  const seen = new Set<string>()
  for (const route of jeepneyNetwork) {
    for (const stop of route.boardingStops) {
      const dist = Math.round(getDistance(userLat, userLng, stop.lat, stop.lng))
      if (dist <= maxWalkMeters) {
        const key = `${route.code}-${stop.name}`
        if (!seen.has(key)) {
          seen.add(key)
          results.push({ stop: { ...stop, walkMeters: dist }, route, walkMeters: dist })
        }
      }
    }
  }
  return results.sort((a, b) => a.walkMeters - b.walkMeters)
}
