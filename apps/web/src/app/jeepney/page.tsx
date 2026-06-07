'use client'

import { useState, useRef, useEffect } from 'react'
import { Bus, MapPin, ArrowRight, RotateCcw, Clock, DollarSign, ChevronRight, Star, Navigation, Zap, Search, X } from 'lucide-react'

type Step = 'start' | 'purpose' | 'destination' | 'route' | 'riding'

interface Destination {
  id: string
  name: string
  district: string
  emoji: string
  tags: string[]
  route: RouteResult
}

interface RouteResult {
  code: string
  color: string
  from: string
  boardAt: string
  alightAt: string
  fare: string
  duration: string
  frequency: string
  tip: string
  landmarks: string[]
  difficulty: 'easy' | 'moderate' | 'tricky'
}

const purposes = [
  { id: 'sightseeing', label: 'Sightseeing', emoji: '🏛️', desc: 'Heritage sites & landmarks' },
  { id: 'food', label: 'Eat & Drink', emoji: '🍜', desc: 'Local food & restaurants' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️', desc: 'Malls & markets' },
  { id: 'beach', label: 'Island & Beach', emoji: '🌊', desc: 'Guimaras & waterfront' },
  { id: 'transport', label: 'Getting Around', emoji: '✈️', desc: 'Airport & terminals' },
]

const destinations: Record<string, Destination[]> = {
  sightseeing: [
    {
      id: 'molo-church',
      name: 'Molo Church',
      district: 'Molo',
      emoji: '⛪',
      tags: ['Heritage', 'Free entry', 'Photo spot'],
      route: {
        code: '03C',
        color: '#1B4F8A',
        from: 'City Proper / SM City',
        boardAt: 'Iznart St or SM City stop',
        alightAt: 'Molo Plaza',
        fare: '₱13–₱20',
        duration: '15–25 min',
        frequency: 'Every 10 min',
        tip: 'Tell the driver "Molo Simbahan" — they\'ll let you know when to hop off right at the church.',
        landmarks: ['SM City Iloilo', 'Plaza Libertad', 'Molo Heritage Zone'],
        difficulty: 'easy',
      },
    },
    {
      id: 'jaro-cathedral',
      name: 'Jaro Cathedral',
      district: 'Jaro',
      emoji: '🕍',
      tags: ['Pilgrimage', 'Asia\'s only feminine shrine', 'Historic'],
      route: {
        code: '02B',
        color: '#C41E3A',
        from: 'City Proper',
        boardAt: 'Rizal St (near City Hall)',
        alightAt: 'Jaro Plaza',
        fare: '₱13–₱18',
        duration: '20–30 min',
        frequency: 'Every 5–10 min',
        tip: 'One of the most frequent routes. Just say "Jaro Plaza" and you\'ll be dropped right in front.',
        landmarks: ['City Hall', 'Jaro Market', 'Jaro Bell Tower'],
        difficulty: 'easy',
      },
    },
    {
      id: 'museo-iloilo',
      name: 'Museo Iloilo',
      district: 'City Proper',
      emoji: '🏺',
      tags: ['Museum', '₱50 entry', 'Air-conditioned'],
      route: {
        code: '08',
        color: '#6B4423',
        from: 'Any downtown point',
        boardAt: 'Ledesma St or Ortiz St',
        alightAt: 'Bonifacio Drive',
        fare: '₱13',
        duration: '10 min',
        frequency: 'Every 10 min',
        tip: 'Super short ride. The museum is right on Bonifacio Drive along the river — you can\'t miss it.',
        landmarks: ['Iloilo River', 'Fort San Pedro Drive', 'City Hall'],
        difficulty: 'easy',
      },
    },
    {
      id: 'esplanade',
      name: 'Iloilo River Esplanade',
      district: 'City Proper',
      emoji: '🌅',
      tags: ['Free entry', 'Night life', 'Street food'],
      route: {
        code: '08',
        color: '#6B4423',
        from: 'Downtown',
        boardAt: 'Iznart St',
        alightAt: 'Esplanade / Carpenter\'s Bridge',
        fare: '₱13',
        duration: '10–15 min',
        frequency: 'Every 10 min',
        tip: 'Go after 6pm — the food stalls open and the river lights come alive. Best paired with sunset.',
        landmarks: ['Carpenter\'s Bridge', 'Iloilo River', 'Heritage buildings'],
        difficulty: 'easy',
      },
    },
  ],
  food: [
    {
      id: 'lapaz-market',
      name: 'La Paz Market (Batchoy)',
      district: 'La Paz',
      emoji: '🍜',
      tags: ['Must try', 'Original batchoy', 'Open early'],
      route: {
        code: '02B',
        color: '#C41E3A',
        from: 'City Proper / Jaro',
        boardAt: 'Rizal St',
        alightAt: 'La Paz Market',
        fare: '₱13–₱15',
        duration: '15–20 min',
        frequency: 'Every 5 min',
        tip: 'Go before 9am for the freshest batchoy. Ask for "special" (with everything). Netong\'s and Ted\'s are the originals.',
        landmarks: ['La Paz Church', 'La Paz Market entrance', 'Jaro boundary'],
        difficulty: 'easy',
      },
    },
    {
      id: 'esplanade-food',
      name: 'Esplanade Food Strip',
      district: 'City Proper',
      emoji: '🦀',
      tags: ['Paluto seafood', 'Best at night', 'River views'],
      route: {
        code: '08',
        color: '#6B4423',
        from: 'Downtown',
        boardAt: 'Iznart St or Ledesma St',
        alightAt: 'Esplanade',
        fare: '₱13',
        duration: '10 min',
        frequency: 'Every 10 min',
        tip: 'Point at the fresh seafood you want and say how you want it cooked. Grilled pusit (squid) is legendary here.',
        landmarks: ['Carpenter\'s Bridge', 'River boats', 'Heritage strip'],
        difficulty: 'easy',
      },
    },
    {
      id: 'molo-pancit',
      name: 'Molo Heritage Restaurants',
      district: 'Molo',
      emoji: '🥟',
      tags: ['Pancit Molo', 'Heritage dining', 'Local favorites'],
      route: {
        code: '03C',
        color: '#1B4F8A',
        from: 'City Proper',
        boardAt: 'SM City or Iznart St',
        alightAt: 'Molo Plaza',
        fare: '₱13–₱20',
        duration: '20 min',
        frequency: 'Every 10–15 min',
        tip: 'Breakthrough Restaurant near Molo serves Pancit Molo in the actual heritage district where it was invented.',
        landmarks: ['Molo Church', 'Molo Plaza', 'Spanish-era mansions'],
        difficulty: 'easy',
      },
    },
  ],
  shopping: [
    {
      id: 'sm-city',
      name: 'SM City Iloilo',
      district: 'Mandurriao',
      emoji: '🏬',
      tags: ['Biggest mall', 'Air-conditioned', 'Cinema'],
      route: {
        code: '04A',
        color: '#D4A017',
        from: 'City Proper / Tagbak',
        boardAt: 'Iznart St or Tagbak Terminal',
        alightAt: 'SM City Iloilo',
        fare: '₱13–₱20',
        duration: '20–30 min',
        frequency: 'Every 15 min',
        tip: 'The Diversion Road jeepneys all pass SM. Just say "SM" — every driver knows it.',
        landmarks: ['Diversion Road', 'Robinsons Place', 'Iloilo Business Park'],
        difficulty: 'easy',
      },
    },
    {
      id: 'central-market',
      name: 'Iloilo Central Market',
      district: 'City Proper',
      emoji: '🥬',
      tags: ['Local produce', 'Pasalubong', 'Cheapest prices'],
      route: {
        code: '02B',
        color: '#C41E3A',
        from: 'Jaro / La Paz',
        boardAt: 'Jaro Terminal',
        alightAt: 'Central Market',
        fare: '₱13',
        duration: '10–15 min',
        frequency: 'Every 5 min',
        tip: 'Go in the morning for fresh produce. The pasalubong section has biscocho and local delicacies.',
        landmarks: ['Plaza Libertad', 'City Hall', 'Muelle Loney'],
        difficulty: 'easy',
      },
    },
    {
      id: 'arevalo-antiques',
      name: 'Arevalo Antique Shops',
      district: 'Arevalo',
      emoji: '🧵',
      tags: ['Abel weaving', 'Antiques', 'Unique finds'],
      route: {
        code: '11',
        color: '#2D6A4F',
        from: 'City Proper / La Paz',
        boardAt: 'La Paz or Molo stop',
        alightAt: 'Arevalo Market',
        fare: '₱20–₱35',
        duration: '30–40 min',
        frequency: 'Every 20 min',
        tip: 'Less frequent route — check the time before you go. Worth it for hand-woven abel fabric and antique bargains.',
        landmarks: ['Arevalo Church', 'Arevalo Market', 'Heritage mansions'],
        difficulty: 'moderate',
      },
    },
  ],
  beach: [
    {
      id: 'jordan-wharf',
      name: 'Guimaras Island (via Jordan Wharf)',
      district: 'Ortiz Wharf Area',
      emoji: '⛴️',
      tags: ['Ferry to Guimaras', '₱14 ferry', 'Sweetest mangoes'],
      route: {
        code: '08',
        color: '#6B4423',
        from: 'City Proper',
        boardAt: 'Fort San Pedro Drive',
        alightAt: 'Ortiz / Jordan Wharf',
        fare: '₱13 jeep + ₱14 ferry',
        duration: '15 min jeep + 15 min ferry',
        frequency: 'Ferry every 30 min',
        tip: 'Take the jeepney to the wharf, then catch the motorboat to Jordan, Guimaras. Buy mangoes from roadside stalls, not city shops.',
        landmarks: ['Fort San Pedro', 'Iloilo Strait', 'Jordan Port'],
        difficulty: 'moderate',
      },
    },
    {
      id: 'esplanade-river',
      name: 'Iloilo River Esplanade',
      district: 'City Proper',
      emoji: '🌊',
      tags: ['Riverside', 'Free', 'Sunset views'],
      route: {
        code: '08',
        color: '#6B4423',
        from: 'Downtown',
        boardAt: 'Iznart St',
        alightAt: 'Esplanade',
        fare: '₱13',
        duration: '10 min',
        frequency: 'Every 10 min',
        tip: 'The river walk is free and gorgeous at sunset. River cruise boats also depart from here.',
        landmarks: ['Carpenter\'s Bridge', 'Heritage buildings', 'Boat dock'],
        difficulty: 'easy',
      },
    },
  ],
  transport: [
    {
      id: 'airport',
      name: 'Iloilo International Airport',
      district: 'Mandurriao',
      emoji: '✈️',
      tags: ['Allow 45 min', 'Heavy luggage? Use Grab'],
      route: {
        code: 'SA',
        color: '#8B1A1A',
        from: 'City Proper',
        boardAt: 'City terminal or SM City',
        alightAt: 'Iloilo Airport',
        fare: '₱30–₱50',
        duration: '30–45 min',
        frequency: 'Every 30 min',
        tip: 'If you have big luggage, Grab or tricycle is much easier. Jeepney is fine for carry-on only. Allow extra time during rush hour.',
        landmarks: ['SM City', 'Mandurriao', 'Airport Road'],
        difficulty: 'moderate',
      },
    },
    {
      id: 'tagbak-terminal',
      name: 'Tagbak Terminal (Buses)',
      district: 'Jaro',
      emoji: '🚌',
      tags: ['Inter-city buses', 'To Miag-ao', 'To Caticlan'],
      route: {
        code: '04A',
        color: '#D4A017',
        from: 'City Proper',
        boardAt: 'Iznart St or Diversion Road',
        alightAt: 'Tagbak Terminal',
        fare: '₱20–₱28',
        duration: '25–35 min',
        frequency: 'Every 15 min',
        tip: 'Tagbak is the main bus hub for destinations outside Iloilo — Miag-ao church, Antique province, and the ferry to Boracay/Caticlan.',
        landmarks: ['Diversion Road', 'Jaro area', 'Bus terminal'],
        difficulty: 'moderate',
      },
    },
  ],
}

const allDestinations: (Destination & { purpose: string })[] = Object.entries(destinations).flatMap(
  ([purpose, dests]) => dests.map(d => ({ ...d, purpose }))
)

function searchDestinations(query: string): (Destination & { purpose: string })[] {
  if (!query.trim()) return []
  const q = query.toLowerCase()
  return allDestinations.filter(d =>
    d.name.toLowerCase().includes(q) ||
    d.district.toLowerCase().includes(q) ||
    d.tags.some(t => t.toLowerCase().includes(q)) ||
    d.route.boardAt.toLowerCase().includes(q) ||
    d.route.alightAt.toLowerCase().includes(q) ||
    d.route.landmarks.some(l => l.toLowerCase().includes(q)) ||
    purposes.find(p => p.id === d.purpose)?.label.toLowerCase().includes(q)
  )
}

const difficultyConfig = {
  easy: { label: 'Easy ride', color: '#2D6A4F', bg: 'rgba(45,106,79,0.1)' },
  moderate: { label: 'Moderate', color: '#B8860B', bg: 'rgba(212,160,23,0.12)' },
  tricky: { label: 'Tricky', color: '#C41E3A', bg: 'rgba(196,30,58,0.1)' },
}

export default function JeepneyPage() {
  const [step, setStep] = useState<Step>('start')
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null)
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null)
  const [ridingStep, setRidingStep] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const searchResults = searchDestinations(searchQuery)

  const reset = () => {
    setStep('start')
    setSelectedPurpose(null)
    setSelectedDest(null)
    setRidingStep(0)
    setSearchQuery('')
    setSearchFocused(false)
  }

  const selectFromSearch = (dest: Destination & { purpose: string }) => {
    setSelectedPurpose(dest.purpose)
    setSelectedDest(dest)
    setSearchQuery('')
    setSearchFocused(false)
    setStep('route')
  }

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.closest('.search-container')?.contains(e.target as Node)) {
        setSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const ridingSteps = selectedDest ? [
    { icon: '👣', title: 'Walk to the stop', desc: `Head to ${selectedDest.route.boardAt}. Stand on the right side of the road facing your direction of travel.` },
    { icon: '👋', title: 'Hail the jeepney', desc: `Look for Route ${selectedDest.route.code} displayed on the front windshield. Wave your hand as it approaches.` },
    { icon: '🗣️', title: 'Tell the driver', desc: `Say "${selectedDest.route.alightAt}" clearly. The driver or barker will confirm. Squeeze in and find a seat.` },
    { icon: '💰', title: 'Pay your fare', desc: `Pass ${selectedDest.route.fare} toward the driver through fellow passengers. They'll pass change back the same way.` },
    { icon: '✋', title: 'Shout "Para!"', desc: `When nearing ${selectedDest.route.alightAt}, shout "Para!" (stop) or tap the metal ceiling. Step off the rear — check for traffic!` },
    { icon: '🎉', title: 'You\'ve arrived!', desc: `Welcome to ${selectedDest.name}! ${selectedDest.route.tip}` },
  ] : []

  return (
    <div style={{ paddingTop: '72px', minHeight: '100vh', background: 'var(--color-cream)' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(160deg, #1B4F8A, #0D3060)',
        padding: '48px 24px 80px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(212,160,23,0.12) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '860px', margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Bus size={16} color="#D4A017" />
                <span style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '0.12em', color: '#D4A017', textTransform: 'uppercase' }}>Interactive Jeepney Guide</span>
              </div>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px, 5vw, 56px)', color: 'white', fontWeight: '700', margin: 0, lineHeight: 1.1 }}>
                Where to?
              </h1>
              <p style={{ fontFamily: 'Source Serif 4, serif', fontSize: '17px', color: 'rgba(200,220,255,0.75)', marginTop: '10px', marginBottom: 0 }}>
                Find your jeepney route in seconds.
              </p>
            </div>
            {step !== 'start' && (
              <button onClick={reset} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '10px', padding: '10px 16px', color: 'white',
                fontSize: '13px', fontWeight: '500', cursor: 'pointer',
              }}>
                <RotateCcw size={14} /> Start over
              </button>
            )}
          </div>

          {/* Search bar */}
          <div className="search-container" style={{ position: 'relative', marginTop: '28px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              background: searchFocused ? 'white' : 'rgba(255,255,255,0.92)',
              borderRadius: searchFocused && (searchResults.length > 0 || searchQuery === '') ? '16px 16px 0 0' : '16px',
              padding: '0 18px',
              boxShadow: searchFocused ? '0 0 0 3px rgba(212,160,23,0.4)' : '0 4px 24px rgba(0,0,0,0.2)',
              transition: 'all 0.2s',
            }}>
              <Search size={18} color={searchFocused ? '#1B4F8A' : 'rgba(26,18,9,0.4)'} style={{ flexShrink: 0, transition: 'color 0.2s' }} />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search any place in Iloilo… (e.g. Molo Church, batchoy, airport)"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                style={{
                  flex: 1, border: 'none', outline: 'none', background: 'transparent',
                  fontSize: '15px', color: 'var(--color-dark)', padding: '16px 0',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', color: 'rgba(26,18,9,0.4)' }}>
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Dropdown: results */}
            {searchFocused && searchQuery && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0, background: 'white',
                borderRadius: '0 0 16px 16px', boxShadow: '0 16px 40px rgba(0,0,0,0.15)',
                zIndex: 100, overflow: 'hidden', border: '1px solid rgba(26,18,9,0.06)', borderTop: 'none',
              }}>
                {searchResults.length === 0 ? (
                  <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <MapPin size={18} color="rgba(26,18,9,0.25)" />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: 'rgba(26,18,9,0.5)' }}>No results for &ldquo;{searchQuery}&rdquo;</div>
                      <div style={{ fontSize: '12px', color: 'rgba(26,18,9,0.35)', marginTop: '2px' }}>Try: Molo, batchoy, SM City, airport…</div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ padding: '10px 18px 6px', fontSize: '11px', fontWeight: '600', color: 'rgba(26,18,9,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                    </div>
                    {searchResults.map((dest, i) => {
                      const diff = difficultyConfig[dest.route.difficulty]
                      const purposeInfo = purposes.find(p => p.id === dest.purpose)
                      return (
                        <button key={dest.id} onClick={() => selectFromSearch(dest)}
                          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 18px', textAlign: 'left', borderTop: i === 0 ? 'none' : '1px solid rgba(26,18,9,0.05)', transition: 'background 0.15s' }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(27,79,138,0.04)'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'none'}
                        >
                          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${dest.route.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                            {dest.emoji}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-dark)' }}>{dest.name}</span>
                              <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '100px', background: `${dest.route.color}18`, color: dest.route.color, fontWeight: '600' }}>Route {dest.route.code}</span>
                            </div>
                            <div style={{ fontSize: '12px', color: 'rgba(26,18,9,0.5)', marginTop: '3px', display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><MapPin size={10} /> {dest.district}</span>
                              <span>·</span><span>{dest.route.fare}</span>
                              <span>·</span><span>{dest.route.duration}</span>
                              <span style={{ padding: '1px 7px', borderRadius: '100px', background: diff.bg, color: diff.color, fontWeight: '600', fontSize: '10px' }}>{diff.label}</span>
                              {purposeInfo && <span style={{ color: 'rgba(26,18,9,0.35)' }}>· {purposeInfo.emoji} {purposeInfo.label}</span>}
                            </div>
                          </div>
                          <ArrowRight size={14} color="rgba(26,18,9,0.2)" style={{ flexShrink: 0 }} />
                        </button>
                      )
                    })}
                    <div style={{ padding: '10px 18px', borderTop: '1px solid rgba(26,18,9,0.06)', background: 'rgba(27,79,138,0.03)' }}>
                      <button onClick={() => { setSearchQuery(''); setSearchFocused(false); setStep('purpose') }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#1B4F8A', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Bus size={12} /> Browse all destinations by category →
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Dropdown: quick suggestions when empty */}
            {searchFocused && !searchQuery && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', borderRadius: '0 0 16px 16px', boxShadow: '0 16px 40px rgba(0,0,0,0.15)', zIndex: 100, padding: '14px 18px 16px', border: '1px solid rgba(26,18,9,0.06)', borderTop: 'none' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(26,18,9,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Popular destinations</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['Molo Church', 'Batchoy', 'SM City', 'Airport', 'Guimaras', 'Esplanade', 'Jaro Cathedral', 'Antiques'].map(s => (
                    <button key={s} onClick={() => setSearchQuery(s)} style={{ background: 'var(--color-cream)', border: '1px solid rgba(26,18,9,0.08)', borderRadius: '100px', padding: '6px 14px', fontSize: '13px', color: 'var(--color-dark)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Search size={11} color="rgba(26,18,9,0.4)" />{s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Progress bar */}
          {step !== 'start' && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '28px', alignItems: 'center' }}>
              {['purpose', 'destination', 'route'].map((s, i) => {
                const steps = ['purpose', 'destination', 'route', 'riding']
                const currentIdx = steps.indexOf(step)
                const active = i <= currentIdx
                return (
                  <div key={s} style={{
                    width: active ? '32px' : '8px', height: '8px', borderRadius: '4px',
                    background: active ? '#D4A017' : 'rgba(255,255,255,0.2)',
                    transition: 'all 0.3s ease',
                  }} />
                )
              })}
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginLeft: '4px' }}>
                {step === 'purpose' ? 'Step 1 of 3' : step === 'destination' ? 'Step 2 of 3' : 'Step 3 of 3'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: '860px', margin: '-40px auto 0', padding: '0 24px 80px', position: 'relative', zIndex: 1 }}>

        {/* START */}
        {step === 'start' && (
          <div style={{ background: 'white', borderRadius: '24px', padding: 'clamp(28px,5vw,48px)', boxShadow: '0 8px 40px rgba(26,18,9,0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: '72px', marginBottom: '20px' }}>🚌</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', color: 'var(--color-dark)', marginBottom: '12px' }}>
              Ride Iloilo Like a Local
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(26,18,9,0.6)', lineHeight: '1.7', maxWidth: '460px', margin: '0 auto 36px' }}>
              Tell us where you want to go and we&apos;ll give you the exact jeepney route, fare, and a step-by-step riding guide.
            </p>
            <button onClick={() => setStep('purpose')} style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: '#1B4F8A', color: 'white', padding: '18px 40px', borderRadius: '14px',
              fontSize: '16px', fontWeight: '600', border: 'none', cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(27,79,138,0.3)',
            }}>
              <Navigation size={20} /> Find My Route <ArrowRight size={18} />
            </button>
            <div style={{ marginTop: '40px', padding: '20px', background: 'var(--color-cream)', borderRadius: '14px', textAlign: 'left', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '24px' }}>💡</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-dark)', marginBottom: '4px' }}>Did you know?</div>
                <div style={{ fontSize: '13px', color: 'rgba(26,18,9,0.6)', lineHeight: '1.6' }}>
                  Iloilo has 20+ jeepney routes. Base fare is just <strong>₱13</strong> — one of the most affordable ways to explore a Philippine city.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PURPOSE */}
        {step === 'purpose' && (
          <div style={{ background: 'white', borderRadius: '24px', padding: 'clamp(28px,5vw,40px)', boxShadow: '0 8px 40px rgba(26,18,9,0.1)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '26px', color: 'var(--color-dark)', marginBottom: '8px' }}>
              What&apos;s the plan?
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(26,18,9,0.55)', marginBottom: '28px' }}>Choose what you&apos;re heading out to do.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
              {purposes.map(p => (
                <button key={p.id} onClick={() => { setSelectedPurpose(p.id); setStep('destination') }}
                  style={{ background: 'var(--color-cream)', border: '2px solid transparent', borderRadius: '16px', padding: '20px 14px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1B4F8A'; (e.currentTarget as HTMLElement).style.background = 'rgba(27,79,138,0.05)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; (e.currentTarget as HTMLElement).style.background = 'var(--color-cream)' }}
                >
                  <div style={{ fontSize: '36px', marginBottom: '10px' }}>{p.emoji}</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-dark)', marginBottom: '4px' }}>{p.label}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(26,18,9,0.5)' }}>{p.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* DESTINATION */}
        {step === 'destination' && selectedPurpose && (
          <div style={{ background: 'white', borderRadius: '24px', padding: 'clamp(28px,5vw,40px)', boxShadow: '0 8px 40px rgba(26,18,9,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '13px', color: 'rgba(26,18,9,0.4)' }}>
              <span style={{ cursor: 'pointer', color: '#1B4F8A' }} onClick={() => setStep('purpose')}>
                {purposes.find(p => p.id === selectedPurpose)?.emoji} {purposes.find(p => p.id === selectedPurpose)?.label}
              </span>
              <ChevronRight size={14} />
              <span style={{ color: 'var(--color-dark)' }}>Pick destination</span>
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '26px', color: 'var(--color-dark)', marginBottom: '8px' }}>Where exactly?</h2>
            <p style={{ fontSize: '14px', color: 'rgba(26,18,9,0.55)', marginBottom: '24px' }}>Select a destination and we&apos;ll build your route.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(destinations[selectedPurpose] || []).map(dest => {
                const diff = difficultyConfig[dest.route.difficulty]
                return (
                  <button key={dest.id} onClick={() => { setSelectedDest(dest); setStep('route') }}
                    style={{ background: 'var(--color-cream)', border: '2px solid transparent', borderRadius: '16px', padding: '18px 20px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', transition: 'all 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1B4F8A'; (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; (e.currentTarget as HTMLElement).style.transform = 'translateX(0)' }}
                  >
                    <div style={{ fontSize: '36px', flexShrink: 0 }}>{dest.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-dark)' }}>{dest.name}</span>
                        <span style={{ fontSize: '11px', color: 'rgba(26,18,9,0.4)' }}>• {dest.district}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                        {dest.tags.map(tag => (
                          <span key={tag} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '100px', background: 'rgba(27,79,138,0.08)', color: '#1B4F8A', fontWeight: '500' }}>{tag}</span>
                        ))}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'rgba(26,18,9,0.5)', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={11} /> {dest.route.duration}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><DollarSign size={11} /> {dest.route.fare}</span>
                        <span style={{ padding: '2px 8px', borderRadius: '100px', background: diff.bg, color: diff.color, fontWeight: '600', fontSize: '11px' }}>{diff.label}</span>
                      </div>
                    </div>
                    <ArrowRight size={18} color="rgba(26,18,9,0.25)" style={{ flexShrink: 0 }} />
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ROUTE RESULT */}
        {step === 'route' && selectedDest && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '13px', color: 'rgba(26,18,9,0.4)' }}>
              <span style={{ cursor: 'pointer', color: '#1B4F8A' }} onClick={() => setStep('purpose')}>{purposes.find(p => p.id === selectedPurpose)?.emoji} {purposes.find(p => p.id === selectedPurpose)?.label}</span>
              <ChevronRight size={14} />
              <span style={{ cursor: 'pointer', color: '#1B4F8A' }} onClick={() => setStep('destination')}>{selectedDest.name}</span>
              <ChevronRight size={14} />
              <span style={{ color: 'var(--color-dark)' }}>Your route</span>
            </div>
            <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(26,18,9,0.1)' }}>
              <div style={{ background: selectedDest.route.color, padding: '28px 32px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '14px', padding: '14px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'Playfair Display, serif', color: 'white', lineHeight: 1 }}>{selectedDest.route.code}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>Route</div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>Taking you to</div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(20px,3vw,26px)', color: 'white', fontWeight: '700' }}>{selectedDest.emoji} {selectedDest.name}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>{selectedDest.district} District</div>
                </div>
              </div>
              <div style={{ padding: 'clamp(24px,4vw,32px)' }}>
                {/* Journey path */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', background: 'var(--color-cream)', borderRadius: '14px', padding: '16px 20px', gap: '8px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '120px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(26,18,9,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Board at</div>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-dark)' }}>{selectedDest.route.boardAt}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(26,18,9,0.5)', marginTop: '2px' }}>{selectedDest.route.from}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '0 8px' }}>
                    <div style={{ width: '48px', height: '2px', background: selectedDest.route.color, borderRadius: '2px' }} />
                    <div style={{ fontSize: '10px', color: 'rgba(26,18,9,0.4)' }}>{selectedDest.route.duration}</div>
                  </div>
                  <div style={{ flex: 1, textAlign: 'right', minWidth: '120px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(26,18,9,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Alight at</div>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: selectedDest.route.color }}>{selectedDest.route.alightAt}</div>
                  </div>
                </div>
                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '20px' }}>
                  {[
                    { icon: DollarSign, label: 'Fare', value: selectedDest.route.fare, color: '#2D6A4F' },
                    { icon: Clock, label: 'Duration', value: selectedDest.route.duration, color: '#1B4F8A' },
                    { icon: Zap, label: 'Frequency', value: selectedDest.route.frequency, color: '#B8860B' },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} style={{ background: 'var(--color-cream)', borderRadius: '12px', padding: '14px 10px', textAlign: 'center' }}>
                      <Icon size={18} color={color} style={{ marginBottom: '6px' }} />
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-dark)', marginBottom: '2px' }}>{value}</div>
                      <div style={{ fontSize: '10px', color: 'rgba(26,18,9,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                    </div>
                  ))}
                </div>
                {/* Landmarks */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-dark)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={13} color="var(--color-red)" /> Along the way
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {selectedDest.route.landmarks.map((lm, i) => (
                      <span key={lm} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'rgba(26,18,9,0.65)', background: 'var(--color-cream)', padding: '5px 12px', borderRadius: '100px' }}>
                        {i > 0 && <span style={{ color: 'rgba(26,18,9,0.25)', marginRight: '4px' }}>→</span>}
                        {lm}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Tip */}
                <div style={{ background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: '14px', padding: '16px 18px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <Star size={16} color="#D4A017" fill="#D4A017" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: '600', color: '#9A7010', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '5px' }}>Local tip</div>
                      <p style={{ fontSize: '13px', color: 'rgba(26,18,9,0.75)', lineHeight: '1.6', margin: 0 }}>{selectedDest.route.tip}</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => { setRidingStep(0); setStep('riding') }} style={{
                  width: '100%', background: selectedDest.route.color, color: 'white',
                  border: 'none', borderRadius: '14px', padding: '18px',
                  fontSize: '15px', fontWeight: '600', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                }}>
                  <Bus size={20} /> Step-by-step riding guide <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* RIDING GUIDE */}
        {step === 'riding' && selectedDest && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '13px', color: 'rgba(26,18,9,0.4)' }}>
              <span style={{ cursor: 'pointer', color: '#1B4F8A' }} onClick={() => setStep('route')}>← {selectedDest.name} route</span>
              <ChevronRight size={14} />
              <span style={{ color: 'var(--color-dark)' }}>Riding guide</span>
            </div>
            <div style={{ background: 'white', borderRadius: '24px', padding: 'clamp(28px,5vw,40px)', boxShadow: '0 8px 40px rgba(26,18,9,0.1)' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '26px', color: 'var(--color-dark)', marginBottom: '6px' }}>Step-by-step guide</h2>
              <p style={{ fontSize: '14px', color: 'rgba(26,18,9,0.5)', marginBottom: '32px' }}>Route {selectedDest.route.code} → {selectedDest.name}</p>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {ridingSteps.map((s, i) => {
                  const isActive = i === ridingStep
                  const isDone = i < ridingStep
                  const isLast = i === ridingSteps.length - 1
                  return (
                    <div key={i} style={{ display: 'flex', gap: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                        <div style={{
                          width: '48px', height: '48px', borderRadius: '50%',
                          background: isDone ? '#2D6A4F' : isActive ? selectedDest.route.color : 'var(--color-cream)',
                          border: `2px solid ${isDone ? '#2D6A4F' : isActive ? selectedDest.route.color : 'rgba(26,18,9,0.1)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: isDone ? '20px' : '22px', transition: 'all 0.3s', flexShrink: 0,
                          color: isDone ? 'white' : 'inherit',
                        }}>
                          {isDone ? '✓' : s.icon}
                        </div>
                        {!isLast && <div style={{ width: '2px', flex: 1, minHeight: '20px', background: isDone ? '#2D6A4F' : 'rgba(26,18,9,0.08)', margin: '4px 0' }} />}
                      </div>
                      <div style={{ flex: 1, paddingBottom: isLast ? '0' : '20px' }}>
                        <div style={{
                          background: isActive ? `${selectedDest.route.color}0D` : 'transparent',
                          border: isActive ? `1px solid ${selectedDest.route.color}30` : '1px solid transparent',
                          borderRadius: '14px', padding: isActive ? '16px 18px' : '8px 0', transition: 'all 0.3s',
                        }}>
                          <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: isActive ? '8px' : '0', color: isDone ? 'rgba(26,18,9,0.35)' : 'var(--color-dark)', textDecoration: isDone ? 'line-through' : 'none' }}>
                            Step {i + 1}: {s.title}
                          </div>
                          {isActive && <p style={{ fontSize: '14px', color: 'rgba(26,18,9,0.7)', lineHeight: '1.65', margin: 0 }}>{s.desc}</p>}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                {ridingStep > 0 && (
                  <button onClick={() => setRidingStep(r => r - 1)} style={{ flex: 1, background: 'var(--color-cream)', border: '1px solid rgba(26,18,9,0.1)', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', color: 'var(--color-dark)' }}>
                    ← Back
                  </button>
                )}
                {ridingStep < ridingSteps.length - 1 ? (
                  <button onClick={() => setRidingStep(r => r + 1)} style={{ flex: 2, background: selectedDest.route.color, color: 'white', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    Next step <ArrowRight size={16} />
                  </button>
                ) : (
                  <button onClick={reset} style={{ flex: 2, background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    🎉 Plan another trip
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
