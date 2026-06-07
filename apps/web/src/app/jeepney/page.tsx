'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import {
  Bus, MapPin, ArrowRight, RotateCcw, Clock, DollarSign,
  Navigation, Zap, Search, X, Map, Locate, ChevronRight,
  AlertCircle, CheckCircle, Footprints, Info, Star, ChevronDown
} from 'lucide-react'
import { iloiloPlaces, searchPlaces, categoryConfig, type Place } from '@/data/places'
import { findRoutes, findNearbyBoarding, knownOrigins, minsWalk, type RouteRecommendation } from '@/lib/jeepneyRouting'
import type { MapMarker, RoutePolyline } from '@/components/ui/IloiloMap'

const IloiloMap = dynamic(() => import('@/components/ui/IloiloMap'), {
  ssr: false,
  loading: () => (
    <div style={{ width: '100%', height: '460px', background: '#e8ead8', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'rgba(26,18,9,0.4)' }}>
      <div style={{ fontSize: '32px' }}>🗺️</div>
      <div style={{ fontSize: '14px' }}>Loading map…</div>
    </div>
  ),
})

type LocationStatus = 'idle' | 'requesting' | 'granted' | 'denied'

const confidenceStyle = {
  direct:   { bg: 'rgba(45,106,79,0.1)',   text: '#2D6A4F', border: 'rgba(45,106,79,0.25)',   badge: '✓ Direct', dot: '#2D6A4F' },
  nearby:   { bg: 'rgba(212,160,23,0.1)',  text: '#B8860B', border: 'rgba(212,160,23,0.25)',  badge: '~ Short walk', dot: '#D4A017' },
  transfer: { bg: 'rgba(196,30,58,0.08)',  text: '#C41E3A', border: 'rgba(196,30,58,0.2)',    badge: '↻ Longer walk', dot: '#C41E3A' },
}

export default function JeepneyPage() {
  const [query, setQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [recommendations, setRecommendations] = useState<RouteRecommendation[]>([])
  const [selectedRec, setSelectedRec] = useState<RouteRecommendation | null>(null)
  const [ridingStep, setRidingStep] = useState(0)
  const [showRiding, setShowRiding] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationStatus, setLocationStatus] = useState<LocationStatus>('idle')
  const [nearbyRoutes, setNearbyRoutes] = useState<ReturnType<typeof findNearbyBoarding>>([])
  const [showMap, setShowMap] = useState(true)
  const [showOriginPicker, setShowOriginPicker] = useState(false)
  const [manualOriginId, setManualOriginId] = useState<string | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const originRef = useRef<HTMLDivElement>(null)
  const searchResults = searchPlaces(query)

  const effectiveOrigin = userLocation ?? (manualOriginId
    ? knownOrigins.find(o => o.id === manualOriginId) ?? null
    : null)

  // Compute routes whenever origin or destination changes
  const computeRoutes = useCallback((origin: { lat: number; lng: number } | null, place: Place | null) => {
    if (!origin || !place) { setRecommendations([]); return }
    setRecommendations(findRoutes(origin.lat, origin.lng, place.id))
  }, [])

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (!searchRef.current?.contains(e.target as Node)) setSearchFocused(false)
      if (!originRef.current?.contains(e.target as Node)) setShowOriginPicker(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) return
    setLocationStatus('requesting')
    navigator.geolocation.getCurrentPosition(
      pos => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setUserLocation(loc)
        setManualOriginId(null)
        setLocationStatus('granted')
        setNearbyRoutes(findNearbyBoarding(loc.lat, loc.lng))
        computeRoutes(loc, selectedPlace)
      },
      () => setLocationStatus('denied'),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [selectedPlace, computeRoutes])

  const selectManualOrigin = (origin: typeof knownOrigins[0]) => {
    setManualOriginId(origin.id)
    setUserLocation(null)
    setLocationStatus('idle')
    setNearbyRoutes(findNearbyBoarding(origin.lat, origin.lng))
    setShowOriginPicker(false)
    computeRoutes(origin, selectedPlace)
  }

  const selectPlace = useCallback((place: Place) => {
    setSelectedPlace(place)
    setQuery(''); setSearchFocused(false)
    setSelectedRec(null); setShowRiding(false); setRidingStep(0)
    computeRoutes(effectiveOrigin, place)
  }, [effectiveOrigin, computeRoutes])

  const reset = () => {
    setSelectedPlace(null); setRecommendations([])
    setSelectedRec(null); setShowRiding(false); setRidingStep(0); setQuery('')
  }

  const currentOriginLabel = locationStatus === 'granted'
    ? '📍 Your GPS location'
    : manualOriginId
      ? knownOrigins.find(o => o.id === manualOriginId)?.name ?? 'Pick origin'
      : 'Pick your starting point'

  // Map markers
  const mapMarkers: MapMarker[] = [
    ...iloiloPlaces.slice(0, 50).map(p => ({
      id: p.id, name: p.name, emoji: p.emoji,
      lat: p.lat, lng: p.lng,
      color: categoryConfig[p.category].color,
      district: p.district,
      subtitle: p.priceRange || p.openHours || '',
      isSelected: p.id === selectedPlace?.id,
      popupHtml: `<div style="font-family:sans-serif;padding:4px;min-width:190px"><div style="font-size:22px;margin-bottom:6px">${p.emoji}</div><div style="font-size:14px;font-weight:700;color:#1A1209;margin-bottom:2px">${p.name}</div><div style="font-size:11px;color:#888;margin-bottom:6px">${p.district} · <span style="background:${categoryConfig[p.category].color}18;color:${categoryConfig[p.category].color};padding:2px 7px;border-radius:100px;font-weight:600">${categoryConfig[p.category].label}</span></div>${p.description ? `<div style="font-size:11px;color:#555;line-height:1.5">${p.description.slice(0, 80)}…</div>` : ''}</div>`,
    })),
    ...(selectedRec ? [{
      id: 'boarding-stop',
      name: `🚏 Board here: ${selectedRec.boardingStop.name}`,
      emoji: '🚏',
      lat: selectedRec.boardingStop.lat,
      lng: selectedRec.boardingStop.lng,
      color: selectedRec.route.color,
      district: `Route ${selectedRec.route.code} · Walk ${selectedRec.boardingStop.walkMeters}m`,
      subtitle: '',
      isSelected: false,
    }] : []),
  ]

  const mapRoutes: RoutePolyline[] = selectedRec
    ? [{ code: selectedRec.route.code, color: selectedRec.route.color, path: selectedRec.route.path }]
    : []

  const ridingSteps = selectedRec && selectedPlace ? [
    {
      icon: '📍',
      title: 'Get to the boarding stop',
      desc: `Walk ${selectedRec.boardingStop.walkMeters}m (~${selectedRec.walkMinutes} min) to: "${selectedRec.boardingStop.name}". Stand on the right side of the road going toward ${selectedPlace.district}.`,
    },
    {
      icon: '👋',
      title: `Hail Route ${selectedRec.route.code}`,
      desc: `Look for a jeepney with "${selectedRec.route.code}" on the front windshield. Wave your hand to signal it to stop. They run ${selectedRec.route.frequency}.`,
    },
    {
      icon: '🗣️',
      title: 'Tell the driver your stop',
      desc: `Say "${selectedRec.destination.alightAt}" clearly. The driver or barker will confirm. Board from the rear and squeeze in.`,
    },
    {
      icon: '💰',
      title: 'Pay the fare',
      desc: `Pass ${selectedRec.totalFare} toward the driver through fellow passengers. They'll pass change back. Exact coins are always appreciated.`,
    },
    {
      icon: '✋',
      title: 'Shout "Para!" to stop',
      desc: `When you see "${selectedRec.destination.alightAt}" approaching, shout "Para!" (stop) or tap the metal ceiling firmly. Step off from the rear — check for traffic.`,
    },
    {
      icon: '🎉',
      title: `You've arrived at ${selectedPlace.name}!`,
      desc: selectedRec.tip
        ? `${selectedRec.tip} Total trip: ~${selectedRec.totalMinutes} min · Fare: ${selectedRec.totalFare}.`
        : `Welcome to ${selectedPlace.name}! Total trip: ~${selectedRec.totalMinutes} min · Fare: ${selectedRec.totalFare}.`,
    },
  ] : []

  return (
    <div style={{ paddingTop: '72px', minHeight: '100vh', background: 'var(--color-cream)' }}>

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(160deg, #1B4F8A, #0D3060)', padding: '36px 24px 72px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 25% 60%, rgba(212,160,23,0.12) 0%, transparent 55%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '960px', margin: '0 auto', position: 'relative' }}>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                <Bus size={14} color="#D4A017" />
                <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.12em', color: '#D4A017', textTransform: 'uppercase' }}>Iloilo Jeepney Navigator</span>
              </div>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px,5vw,50px)', color: 'white', fontWeight: '700', margin: 0, lineHeight: 1.1 }}>
                Where are you going?
              </h1>
              <p style={{ fontSize: '14px', color: 'rgba(200,220,255,0.7)', marginTop: '8px', marginBottom: 0 }}>
                Search any place · We find your exact jeepney
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button onClick={() => setShowMap(m => !m)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: showMap ? '#D4A017' : 'rgba(255,255,255,0.12)', border: `1px solid ${showMap ? '#D4A017' : 'rgba(255,255,255,0.2)'}`, borderRadius: '10px', padding: '9px 14px', color: showMap ? '#1A1209' : 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                <Map size={14} /> {showMap ? 'Hide Map' : 'Show Map'}
              </button>
              {selectedPlace && <button onClick={reset} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', padding: '9px 14px', color: 'white', fontSize: '13px', cursor: 'pointer' }}>
                <RotateCcw size={13} /> Clear
              </button>}
            </div>
          </div>

          {/* ── ORIGIN ROW ─────────────────────────────────────────── */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>

            {/* Origin picker */}
            <div ref={originRef} style={{ position: 'relative', flex: '0 0 auto' }}>
              <button onClick={() => setShowOriginPicker(p => !p)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: locationStatus === 'granted' ? 'rgba(66,133,244,0.2)' : manualOriginId ? 'rgba(212,160,23,0.2)' : 'rgba(255,255,255,0.1)', border: `1px solid ${locationStatus === 'granted' ? 'rgba(66,133,244,0.4)' : manualOriginId ? 'rgba(212,160,23,0.4)' : 'rgba(255,255,255,0.25)'}`, borderRadius: '12px', padding: '11px 16px', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                <MapPin size={14} />
                <span style={{ maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentOriginLabel}</span>
                <ChevronDown size={13} style={{ opacity: 0.6, flexShrink: 0 }} />
              </button>

              {showOriginPicker && (
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, background: 'white', borderRadius: '16px', boxShadow: '0 16px 48px rgba(0,0,0,0.2)', zIndex: 300, minWidth: '290px', overflow: 'hidden', border: '1px solid rgba(26,18,9,0.08)' }}>
                  {/* GPS option */}
                  <button onClick={requestLocation} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', borderBottom: '1px solid rgba(26,18,9,0.06)', textAlign: 'left' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(66,133,244,0.04)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'none'}
                  >
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(66,133,244,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Locate size={18} color="#4285F4" />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#1A1209', marginBottom: '2px' }}>
                        {locationStatus === 'requesting' ? 'Getting GPS…' : locationStatus === 'granted' ? '📍 GPS Active — Update' : 'Use My GPS Location'}
                      </div>
                      <div style={{ fontSize: '11px', color: '#888' }}>Most accurate routing</div>
                    </div>
                  </button>

                  {/* Known origins */}
                  <div style={{ padding: '10px 18px 6px', fontSize: '11px', fontWeight: '700', color: 'rgba(26,18,9,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Known starting points
                  </div>
                  {knownOrigins.map(origin => (
                    <button key={origin.id} onClick={() => selectManualOrigin(origin)}
                      style={{ width: '100%', background: manualOriginId === origin.id ? 'rgba(212,160,23,0.08)' : 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 18px', textAlign: 'left', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(27,79,138,0.04)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = manualOriginId === origin.id ? 'rgba(212,160,23,0.08)' : 'none'}
                    >
                      <MapPin size={14} color={manualOriginId === origin.id ? '#D4A017' : 'rgba(26,18,9,0.3)'} style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '13px', fontWeight: manualOriginId === origin.id ? '600' : '400', color: '#1A1209' }}>{origin.name}</span>
                      {manualOriginId === origin.id && <CheckCircle size={14} color="#D4A017" style={{ marginLeft: 'auto' }} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Arrow */}
            <div style={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '18px', flexShrink: 0, paddingTop: '2px' }}>→</div>

            {/* Destination = search bar */}
            <div ref={searchRef} style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: searchFocused ? 'white' : 'rgba(255,255,255,0.95)', borderRadius: searchFocused && (query || searchFocused) ? '12px 12px 0 0' : '12px', padding: '0 14px', boxShadow: searchFocused ? '0 0 0 3px rgba(212,160,23,0.5)' : '0 4px 20px rgba(0,0,0,0.2)', transition: 'all 0.2s', minHeight: '46px' }}>
                <Search size={16} color={searchFocused ? '#1B4F8A' : 'rgba(26,18,9,0.4)'} style={{ flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder={selectedPlace ? selectedPlace.name : 'Search destination — WVSU, SM City, Jollibee, hospital…'}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', color: selectedPlace && !query ? '#1B4F8A' : 'var(--color-dark)', padding: '13px 0', fontFamily: 'DM Sans, sans-serif', fontWeight: selectedPlace && !query ? '600' : '400' }}
                />
                {(query || selectedPlace) && (
                  <button onClick={() => { setQuery(''); if (selectedPlace) { setSelectedPlace(null); setRecommendations([]) } }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'rgba(26,18,9,0.4)', display: 'flex', flexShrink: 0 }}>
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Search results */}
              {searchFocused && query && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', borderRadius: '0 0 14px 14px', boxShadow: '0 16px 40px rgba(0,0,0,0.15)', zIndex: 200, overflow: 'hidden', maxHeight: '380px', overflowY: 'auto', border: '1px solid rgba(26,18,9,0.06)', borderTop: 'none' }}>
                  {searchResults.length === 0 ? (
                    <div style={{ padding: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <Search size={16} color="rgba(26,18,9,0.2)" />
                      <div>
                        <div style={{ fontSize: '13px', color: 'rgba(26,18,9,0.5)', fontWeight: '500' }}>No results for &ldquo;{query}&rdquo;</div>
                        <div style={{ fontSize: '11px', color: 'rgba(26,18,9,0.35)', marginTop: '3px' }}>Try: WVSU, hospital, batchoy, SM, airport…</div>
                      </div>
                    </div>
                  ) : searchResults.map((place, i) => {
                    const cat = categoryConfig[place.category]
                    return (
                      <button key={place.id} onClick={() => selectPlace(place)}
                        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 16px', textAlign: 'left', borderTop: i === 0 ? 'none' : '1px solid rgba(26,18,9,0.04)', transition: 'background 0.15s' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(27,79,138,0.04)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'none'}
                      >
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${cat.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>{place.emoji}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#1A1209', marginBottom: '2px' }}>{place.name}</div>
                          <div style={{ fontSize: '11px', color: 'rgba(26,18,9,0.5)', display: 'flex', gap: '5px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <span style={{ background: `${cat.color}14`, color: cat.color, padding: '1px 7px', borderRadius: '100px', fontWeight: '600' }}>{cat.label}</span>
                            <span>·</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><MapPin size={9} />{place.district}</span>
                            {place.openHours && <><span>·</span><span>{place.openHours.split('–')[0].trim()}</span></>}
                          </div>
                        </div>
                        <ArrowRight size={13} color="rgba(26,18,9,0.2)" style={{ flexShrink: 0 }} />
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Empty focus: quick picks */}
              {searchFocused && !query && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', borderRadius: '0 0 14px 14px', boxShadow: '0 16px 40px rgba(0,0,0,0.15)', zIndex: 200, padding: '14px 16px 16px', border: '1px solid rgba(26,18,9,0.06)', borderTop: 'none' }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(26,18,9,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Quick searches</div>
                  <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                    {['WVSU', 'SM City', 'Jollibee', 'Hospital', 'Airport', 'Molo Church', "Tatoy's", 'Batchoy', 'Guimaras'].map(s => (
                      <button key={s} onClick={() => setQuery(s)} style={{ background: 'var(--color-cream)', border: '1px solid rgba(26,18,9,0.08)', borderRadius: '100px', padding: '5px 12px', fontSize: '12px', color: '#1A1209', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Search size={10} color="rgba(26,18,9,0.35)" />{s}
                      </button>
                    ))}
                  </div>
                  <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(26,18,9,0.05)', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {(['restaurant', 'church', 'mall', 'hotel', 'hospital', 'school'] as const).map(cat => {
                      const c = categoryConfig[cat]
                      return <button key={cat} onClick={() => setQuery(c.label)} style={{ background: `${c.color}10`, border: `1px solid ${c.color}20`, borderRadius: '100px', padding: '4px 12px', fontSize: '11px', color: c.color, fontWeight: '600', cursor: 'pointer' }}>{c.emoji} {c.label}</button>
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status hints */}
          {locationStatus === 'denied' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: 'rgba(255,200,100,0.9)', marginTop: '8px' }}>
              <AlertCircle size={13} /> Location blocked — enable in browser settings, or pick a starting point above.
            </div>
          )}
          {locationStatus === 'granted' && !selectedPlace && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: 'rgba(100,220,180,0.9)', marginTop: '8px' }}>
              <CheckCircle size={13} /> GPS active · {nearbyRoutes.length} routes near you · Now search a destination →
            </div>
          )}
          {!effectiveOrigin && !selectedPlace && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>
              <Info size={13} /> Pick your starting point above, then search a destination for instant jeepney suggestions.
            </div>
          )}
        </div>
      </div>

      {/* ── MAIN CONTENT ────────────────────────────────────────────── */}
      <div style={{ maxWidth: '960px', margin: '-28px auto 0', padding: '0 24px 80px', position: 'relative', zIndex: 1 }}>

        {/* MAP */}
        {showMap && (
          <div style={{ background: 'white', borderRadius: '22px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(26,18,9,0.1)', marginBottom: '20px' }}>
            <div style={{ padding: '13px 18px', borderBottom: '1px solid rgba(26,18,9,0.06)', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <Map size={14} color="#1B4F8A" />
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#1A1209' }}>
                {selectedPlace ? `Route to ${selectedPlace.name}` : 'Iloilo City — Click any place'}
              </span>
              {selectedRec && <span style={{ marginLeft: 'auto', background: `${selectedRec.route.color}15`, color: selectedRec.route.color, fontSize: '11px', padding: '3px 10px', borderRadius: '100px', fontWeight: '700' }}>Route {selectedRec.route.code} active</span>}
            </div>
            <IloiloMap
              markers={mapMarkers}
              selectedId={selectedPlace?.id ?? null}
              userLocation={userLocation}
              routes={mapRoutes}
              onMarkerClick={id => {
                const p = iloiloPlaces.find(x => x.id === id)
                if (p) selectPlace(p)
              }}
              height="440px"
              zoom={selectedPlace ? 15 : 13}
            />
          </div>
        )}

        {/* ── NO ORIGIN + NO PLACE: prompt cards ─────────────────── */}
        {!effectiveOrigin && !selectedPlace && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }} className="prompt-grid">
            <button onClick={requestLocation} style={{ background: 'white', border: '2px solid rgba(66,133,244,0.2)', borderRadius: '18px', padding: '24px 20px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#4285F4'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(66,133,244,0.2)'; (e.currentTarget as HTMLElement).style.transform = 'none' }}
            >
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>📍</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#1A1209', marginBottom: '6px' }}>Use My GPS Location</div>
              <div style={{ fontSize: '13px', color: 'rgba(26,18,9,0.55)', lineHeight: '1.5' }}>Most accurate — finds the nearest jeepney stop to where you actually are right now.</div>
            </button>
            <button onClick={() => setShowOriginPicker(true)} style={{ background: 'white', border: '2px solid rgba(212,160,23,0.2)', borderRadius: '18px', padding: '24px 20px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#D4A017'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,160,23,0.2)'; (e.currentTarget as HTMLElement).style.transform = 'none' }}
            >
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>🏙️</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#1A1209', marginBottom: '6px' }}>Pick a Known Landmark</div>
              <div style={{ fontSize: '13px', color: 'rgba(26,18,9,0.55)', lineHeight: '1.5' }}>I&apos;m at Festive Walk, SM City, Downtown… pick your starting point.</div>
            </button>
            <style>{`.prompt-grid { @media (max-width:540px) { grid-template-columns: 1fr !important; } }`}</style>
          </div>
        )}

        {/* ── NEARBY ROUTES (origin set, no destination yet) ──────── */}
        {effectiveOrigin && !selectedPlace && nearbyRoutes.length > 0 && (
          <div style={{ background: 'white', borderRadius: '20px', padding: '22px 24px', boxShadow: '0 4px 20px rgba(26,18,9,0.07)', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: locationStatus === 'granted' ? '#4285F4' : '#D4A017', boxShadow: `0 0 0 3px ${locationStatus === 'granted' ? 'rgba(66,133,244,0.2)' : 'rgba(212,160,23,0.2)'}` }} />
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#1A1209' }}>Jeepneys you can board nearby</span>
              <span style={{ fontSize: '12px', color: 'rgba(26,18,9,0.4)' }}>· within walking distance</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {nearbyRoutes.slice(0, 6).map((nr, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', background: 'var(--color-cream)', borderRadius: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: nr.route.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '800', color: 'white', flexShrink: 0 }}>{nr.route.code}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1A1209', marginBottom: '2px' }}>{nr.route.name}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(26,18,9,0.5)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Footprints size={10} />{nr.walkMeters}m to {nr.stop.name}</span>
                      <span>· {nr.route.frequency}</span>
                      <span>· ₱{nr.route.fare.base}+</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: nr.walkMeters < 250 ? '#2D6A4F' : nr.walkMeters < 600 ? '#B8860B' : '#C41E3A', background: nr.walkMeters < 250 ? 'rgba(45,106,79,0.1)' : nr.walkMeters < 600 ? 'rgba(212,160,23,0.1)' : 'rgba(196,30,58,0.08)', padding: '3px 10px', borderRadius: '100px', flexShrink: 0 }}>
                    ~{minsWalk(nr.walkMeters)} min walk
                  </span>
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 14px', background: 'rgba(27,79,138,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Search size={14} color="#1B4F8A" />
              <span style={{ fontSize: '13px', color: '#1B4F8A', fontWeight: '500' }}>Search a destination above to get your personalized route suggestion →</span>
            </div>
          </div>
        )}

        {/* ── DESTINATION SELECTED ─────────────────────────────────── */}
        {selectedPlace && (
          <div>
            {/* Destination card */}
            <div style={{ background: 'white', borderRadius: '18px', padding: '18px 22px', boxShadow: '0 4px 18px rgba(26,18,9,0.08)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '13px', background: `${categoryConfig[selectedPlace.category].color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>{selectedPlace.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '3px' }}>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#1A1209', margin: 0 }}>{selectedPlace.name}</h2>
                  <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: `${categoryConfig[selectedPlace.category].color}14`, color: categoryConfig[selectedPlace.category].color, fontWeight: '700' }}>{categoryConfig[selectedPlace.category].label}</span>
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(26,18,9,0.5)', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><MapPin size={10} />{selectedPlace.address}</span>
                  {selectedPlace.openHours && <><span>·</span><span>🕐 {selectedPlace.openHours}</span></>}
                </div>
              </div>
              {effectiveOrigin && <div style={{ fontSize: '12px', color: 'rgba(26,18,9,0.4)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Navigation size={11} /> From: {currentOriginLabel.replace('📍 ', '')}
              </div>}
            </div>

            {/* No origin: prompt */}
            {!effectiveOrigin && (
              <div style={{ background: 'linear-gradient(135deg, #1B4F8A, #0D3060)', borderRadius: '18px', padding: '24px', marginBottom: '14px', textAlign: 'center' }}>
                <MapPin size={28} color="rgba(255,255,255,0.5)" style={{ marginBottom: '10px' }} />
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: 'white', marginBottom: '8px' }}>Where are you starting from?</h3>
                <p style={{ fontSize: '13px', color: 'rgba(200,220,255,0.8)', marginBottom: '18px', lineHeight: '1.6' }}>We need your starting point to find which jeepney to take to <strong>{selectedPlace.name}</strong>.</p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={requestLocation} style={{ display: 'flex', alignItems: 'center', gap: '7px', background: '#4285F4', color: 'white', padding: '11px 22px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>
                    <Locate size={15} /> Use GPS
                  </button>
                  <button onClick={() => setShowOriginPicker(true)} style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,0.15)', color: 'white', padding: '11px 22px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', border: '1px solid rgba(255,255,255,0.25)', cursor: 'pointer' }}>
                    <MapPin size={15} /> Pick Landmark
                  </button>
                </div>
              </div>
            )}

            {/* ROUTE RECOMMENDATIONS */}
            {effectiveOrigin && recommendations.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(26,18,9,0.45)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Bus size={13} color="#C41E3A" /> {recommendations.length} route{recommendations.length !== 1 ? 's' : ''} found
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {recommendations.map((rec, i) => {
                    const conf = confidenceStyle[rec.confidence]
                    const isSelected = selectedRec === rec
                    const isBest = i === 0
                    return (
                      <button key={i} onClick={() => { setSelectedRec(rec); setShowRiding(false); setRidingStep(0) }}
                        style={{ background: 'white', border: isSelected ? `2px solid ${rec.route.color}` : '2px solid rgba(26,18,9,0.07)', borderRadius: '18px', padding: 0, overflow: 'hidden', cursor: 'pointer', textAlign: 'left', boxShadow: isSelected ? `0 8px 28px ${rec.route.color}28` : '0 2px 12px rgba(26,18,9,0.06)', transition: 'all 0.2s' }}
                        onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = `${rec.route.color}60` }}
                        onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(26,18,9,0.07)' }}
                      >
                        {/* Top bar */}
                        <div style={{ background: isSelected ? rec.route.color : `${rec.route.color}10`, padding: '13px 18px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                          <div style={{ background: isSelected ? 'rgba(255,255,255,0.25)' : rec.route.color, borderRadius: '9px', padding: '6px 13px', flexShrink: 0 }}>
                            <div style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'Playfair Display, serif', color: 'white', lineHeight: 1 }}>{rec.route.code}</div>
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '14px', fontWeight: '700', color: isSelected ? 'white' : '#1A1209', marginBottom: '2px' }}>{rec.route.name}</div>
                            <div style={{ fontSize: '11px', color: isSelected ? 'rgba(255,255,255,0.7)' : 'rgba(26,18,9,0.45)' }}>{rec.route.frequency} · {rec.route.operatingHours}</div>
                          </div>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                            {isBest && <span style={{ background: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(212,160,23,0.15)', color: isSelected ? 'white' : '#9A7010', fontSize: '10px', fontWeight: '700', padding: '3px 9px', borderRadius: '100px' }}>⭐ Best option</span>}
                            <span style={{ background: isSelected ? 'rgba(255,255,255,0.2)' : conf.bg, color: isSelected ? 'white' : conf.text, border: isSelected ? 'none' : `1px solid ${conf.border}`, fontSize: '10px', fontWeight: '700', padding: '3px 9px', borderRadius: '100px' }}>{conf.badge}</span>
                          </div>
                        </div>

                        {/* Journey details */}
                        <div style={{ padding: '14px 18px' }}>
                          {/* Origin → Board → Ride → Destination */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                            <div style={{ background: 'rgba(66,133,244,0.08)', borderRadius: '8px', padding: '7px 12px', minWidth: '80px' }}>
                              <div style={{ fontSize: '9px', color: '#4285F4', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>You</div>
                              <div style={{ fontSize: '12px', fontWeight: '600', color: '#1A1209' }}>{currentOriginLabel.replace('📍 ', '').slice(0, 20)}</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px', flexShrink: 0 }}>
                              <div style={{ fontSize: '9px', color: 'rgba(26,18,9,0.35)' }}>~{rec.walkMinutes}m</div>
                              <div style={{ fontSize: '12px', color: 'rgba(26,18,9,0.3)' }}>⋯</div>
                              <Footprints size={10} color="rgba(26,18,9,0.3)" />
                            </div>
                            <div style={{ background: `${rec.route.color}12`, border: `1px solid ${rec.route.color}25`, borderRadius: '8px', padding: '7px 12px', minWidth: '80px' }}>
                              <div style={{ fontSize: '9px', color: rec.route.color, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>Board</div>
                              <div style={{ fontSize: '12px', fontWeight: '600', color: '#1A1209', lineHeight: '1.3' }}>{rec.boardingStop.name.split('/')[0].trim()}</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px', flexShrink: 0 }}>
                              <div style={{ fontSize: '9px', color: 'rgba(26,18,9,0.35)' }}>~{rec.rideMinutes}m</div>
                              <div style={{ width: '24px', height: '2px', background: rec.route.color, borderRadius: '2px' }} />
                              <Bus size={10} color={rec.route.color} />
                            </div>
                            <div style={{ background: `${rec.route.color}18`, borderRadius: '8px', padding: '7px 12px', flex: 1, minWidth: '80px' }}>
                              <div style={{ fontSize: '9px', color: rec.route.color, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>Alight</div>
                              <div style={{ fontSize: '12px', fontWeight: '600', color: '#1A1209', lineHeight: '1.3' }}>{rec.destination.alightAt}</div>
                            </div>
                          </div>

                          {/* Stats row */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: isSelected ? '12px' : 0 }}>
                            {[
                              { icon: DollarSign, label: 'Fare',      val: rec.totalFare,                          color: '#2D6A4F' },
                              { icon: Clock,       label: 'Total time', val: `~${rec.totalMinutes} min`,            color: '#1B4F8A' },
                              { icon: Zap,         label: 'Frequency', val: rec.route.frequency,                    color: '#B8860B' },
                            ].map(({ icon: Icon, label, val, color }) => (
                              <div key={label} style={{ background: 'var(--color-cream)', borderRadius: '9px', padding: '9px 8px', textAlign: 'center' }}>
                                <Icon size={14} color={color} style={{ marginBottom: '3px' }} />
                                <div style={{ fontSize: '12px', fontWeight: '700', color: '#1A1209', marginBottom: '1px' }}>{val}</div>
                                <div style={{ fontSize: '9px', color: 'rgba(26,18,9,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                              </div>
                            ))}
                          </div>

                          {/* Tip */}
                          {isSelected && rec.tip && (
                            <div style={{ display: 'flex', gap: '8px', padding: '10px 12px', background: 'rgba(212,160,23,0.07)', borderRadius: '10px', marginBottom: '12px', alignItems: 'flex-start' }}>
                              <Star size={13} color="#D4A017" fill="#D4A017" style={{ marginTop: '2px', flexShrink: 0 }} />
                              <p style={{ fontSize: '12px', color: 'rgba(26,18,9,0.7)', lineHeight: '1.5', margin: 0 }}>{rec.tip}</p>
                            </div>
                          )}

                          {/* Riding guide CTA */}
                          {isSelected && (
                            <button onClick={e => { e.stopPropagation(); setShowRiding(true); setRidingStep(0) }}
                              style={{ width: '100%', background: rec.route.color, color: 'white', border: 'none', borderRadius: '11px', padding: '13px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                              <Bus size={16} /> Step-by-step riding guide <ArrowRight size={14} />
                            </button>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* No routes found */}
            {effectiveOrigin && recommendations.length === 0 && (
              <div style={{ background: 'white', borderRadius: '18px', padding: '28px', textAlign: 'center', boxShadow: '0 4px 18px rgba(26,18,9,0.07)', marginBottom: '14px' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🚌</div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#1A1209', marginBottom: '8px' }}>No direct jeepney route found</div>
                <div style={{ fontSize: '13px', color: 'rgba(26,18,9,0.55)', lineHeight: '1.6', maxWidth: '360px', margin: '0 auto' }}>
                  This destination may need a tricycle or Grab from a nearby jeepney stop. Try searching a landmark closer to your destination.
                </div>
              </div>
            )}

            {/* ── RIDING GUIDE ──────────────────────────────────────── */}
            {showRiding && selectedRec && (
              <div style={{ background: 'white', borderRadius: '20px', padding: '26px', boxShadow: '0 8px 32px rgba(26,18,9,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <div style={{ width: '34px', height: '34px', background: selectedRec.route.color, borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800', color: 'white', flexShrink: 0 }}>{selectedRec.route.code}</div>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', color: '#1A1209', margin: 0 }}>Riding Guide</h2>
                </div>
                <p style={{ fontSize: '12px', color: 'rgba(26,18,9,0.45)', marginBottom: '24px' }}>
                  {currentOriginLabel.replace('📍 ', '')} → {selectedPlace.name} · ~{selectedRec.totalMinutes} min · {selectedRec.totalFare}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {ridingSteps.map((s, i) => {
                    const isActive = i === ridingStep
                    const isDone = i < ridingStep
                    const isLast = i === ridingSteps.length - 1
                    return (
                      <div key={i} style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: isDone ? '#2D6A4F' : isActive ? selectedRec.route.color : 'var(--color-cream)', border: `2px solid ${isDone ? '#2D6A4F' : isActive ? selectedRec.route.color : 'rgba(26,18,9,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isDone ? '18px' : '19px', color: isDone ? 'white' : 'inherit', transition: 'all 0.3s' }}>
                            {isDone ? '✓' : s.icon}
                          </div>
                          {!isLast && <div style={{ width: '2px', flex: 1, minHeight: '18px', background: isDone ? '#2D6A4F' : 'rgba(26,18,9,0.08)', margin: '3px 0' }} />}
                        </div>
                        <div style={{ flex: 1, paddingBottom: isLast ? 0 : '16px' }}>
                          <div style={{ background: isActive ? `${selectedRec.route.color}0D` : 'transparent', border: isActive ? `1px solid ${selectedRec.route.color}25` : '1px solid transparent', borderRadius: '11px', padding: isActive ? '12px 14px' : '6px 0', transition: 'all 0.3s' }}>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: isDone ? 'rgba(26,18,9,0.3)' : '#1A1209', textDecoration: isDone ? 'line-through' : 'none', marginBottom: isActive ? '6px' : 0 }}>
                              {i + 1}. {s.title}
                            </div>
                            {isActive && <p style={{ fontSize: '13px', color: 'rgba(26,18,9,0.7)', lineHeight: '1.6', margin: 0 }}>{s.desc}</p>}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                  {ridingStep > 0 && <button onClick={() => setRidingStep(r => r - 1)} style={{ flex: 1, background: 'var(--color-cream)', border: '1px solid rgba(26,18,9,0.1)', borderRadius: '11px', padding: '13px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: '#1A1209' }}>← Back</button>}
                  {ridingStep < ridingSteps.length - 1
                    ? <button onClick={() => setRidingStep(r => r + 1)} style={{ flex: 2, background: selectedRec.route.color, color: 'white', border: 'none', borderRadius: '11px', padding: '13px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>Next step <ArrowRight size={14} /></button>
                    : <button onClick={() => { setShowRiding(false); reset() }} style={{ flex: 2, background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '11px', padding: '13px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>🎉 Plan another trip</button>
                  }
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
