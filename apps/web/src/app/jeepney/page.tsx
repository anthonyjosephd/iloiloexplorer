'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import {
  Bus, MapPin, ArrowRight, RotateCcw, Clock, DollarSign,
  Navigation, Zap, Search, X, Map, Locate,
  CheckCircle, Footprints, Star, Info
} from 'lucide-react'
import { iloiloPlaces, searchPlaces, categoryConfig, type Place } from '@/data/places'
import { findRoutes, findNearbyBoarding, minsWalk, type RouteRecommendation } from '@/lib/jeepneyRouting'
import type { MapMarker, RoutePolyline } from '@/components/ui/IloiloMap'

const IloiloMap = dynamic(() => import('@/components/ui/IloiloMap'), {
  ssr: false,
  loading: () => (
    <div style={{ width: '100%', height: '440px', background: '#e8ead8', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'rgba(26,18,9,0.4)' }}>
      <div style={{ fontSize: '32px' }}>🗺️</div>
      <div style={{ fontSize: '14px' }}>Loading map…</div>
    </div>
  ),
})

type GpsStatus = 'requesting' | 'granted' | 'denied' | 'unavailable'

const conf = {
  direct:   { bg: 'rgba(45,106,79,0.1)',  text: '#2D6A4F', border: 'rgba(45,106,79,0.25)',  badge: '✓ Direct route' },
  nearby:   { bg: 'rgba(212,160,23,0.1)', text: '#B8860B', border: 'rgba(212,160,23,0.25)', badge: '~ Short walk to stop' },
  transfer: { bg: 'rgba(196,30,58,0.08)', text: '#C41E3A', border: 'rgba(196,30,58,0.2)',   badge: '↗ Longer walk needed' },
}

export default function JeepneyPage() {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [recommendations, setRecommendations] = useState<RouteRecommendation[]>([])
  const [selectedRec, setSelectedRec] = useState<RouteRecommendation | null>(null)
  const [ridingStep, setRidingStep] = useState(0)
  const [showRiding, setShowRiding] = useState(false)
  const [gpsStatus, setGpsStatus] = useState<GpsStatus>('requesting')
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null)
  const [nearbyRoutes, setNearbyRoutes] = useState<ReturnType<typeof findNearbyBoarding>>([])
  const [showMap, setShowMap] = useState(true)
  const searchRef = useRef<HTMLDivElement>(null)
  const searchResults = searchPlaces(query)

  // ── Auto-request GPS on mount ─────────────────────────────────────
  const startGps = useCallback(() => {
    if (!navigator.geolocation) { setGpsStatus('unavailable'); return }
    setGpsStatus('requesting')
    navigator.geolocation.getCurrentPosition(
      pos => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setUserLoc(loc)
        setGpsStatus('granted')
        setNearbyRoutes(findNearbyBoarding(loc.lat, loc.lng))
        setSelectedPlace(p => {
          if (p) setRecommendations(findRoutes(loc.lat, loc.lng, p.id))
          return p
        })
      },
      () => setGpsStatus('denied'),
      { enableHighAccuracy: true, timeout: 12000 }
    )
  }, [])

  useEffect(() => { startGps() }, [startGps])

  // Close dropdown on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (!searchRef.current?.contains(e.target as Node)) setFocused(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const selectPlace = useCallback((place: Place) => {
    setSelectedPlace(place)
    setQuery(''); setFocused(false)
    setSelectedRec(null); setShowRiding(false); setRidingStep(0)
    if (userLoc) setRecommendations(findRoutes(userLoc.lat, userLoc.lng, place.id))
  }, [userLoc])

  const reset = () => {
    setSelectedPlace(null); setRecommendations([])
    setSelectedRec(null); setShowRiding(false); setRidingStep(0); setQuery('')
  }

  // Map markers
  const mapMarkers: MapMarker[] = iloiloPlaces.slice(0, 50).map(p => ({
    id: p.id, name: p.name, emoji: p.emoji,
    lat: p.lat, lng: p.lng,
    color: categoryConfig[p.category].color,
    district: p.district,
    isSelected: p.id === selectedPlace?.id,
    popupHtml: `<div style="font-family:sans-serif;padding:4px;min-width:180px"><div style="font-size:20px;margin-bottom:5px">${p.emoji}</div><div style="font-size:14px;font-weight:700;color:#1A1209;margin-bottom:2px">${p.name}</div><div style="font-size:11px;color:#888;margin-bottom:5px">${p.district} · <span style="background:${categoryConfig[p.category].color}18;color:${categoryConfig[p.category].color};padding:1px 7px;border-radius:100px;font-weight:600">${categoryConfig[p.category].label}</span></div>${p.description ? `<div style="font-size:11px;color:#555;line-height:1.5">${p.description.slice(0, 80)}…</div>` : ''}</div>`,
  }))

  const mapRoutes: RoutePolyline[] = selectedRec
    ? [{ code: selectedRec.route.displayName, color: selectedRec.route.color, path: selectedRec.route.path }]
    : []

  const ridingSteps = selectedRec && selectedPlace ? [
    {
      icon: '🚶',
      title: 'Walk to the jeepney stop',
      desc: `Walk ${selectedRec.boardingStop.walkMeters}m (~${selectedRec.walkMinutes} min) to: ${selectedRec.boardingStop.name}. Stand on the right side of the road.`,
    },
    {
      icon: '👋',
      title: `Hail the "${selectedRec.route.displayName}" jeepney`,
      desc: `Look for a jeepney with "${selectedRec.route.displayName}" on the front windshield. Wave your hand to stop it. Frequency: ${selectedRec.route.frequency}.`,
    },
    {
      icon: '🗣️',
      title: 'Tell the driver where to drop you',
      desc: `Say "${selectedRec.destination.alightAt}" clearly when you board. The driver or barker will confirm. Board from the rear.`,
    },
    {
      icon: '💰',
      title: 'Pass your fare forward',
      desc: `Hand ${selectedRec.totalFare} to the passenger nearest the driver. They'll pass it forward and your change comes back the same way.`,
    },
    {
      icon: '✋',
      title: 'Shout "Para!" to stop',
      desc: `When you see "${selectedRec.destination.alightAt}", shout "Para!" (stop) or tap the metal ceiling. Step off from the rear — check for traffic first.`,
    },
    {
      icon: '🎉',
      title: `You've arrived at ${selectedPlace.name}!`,
      desc: selectedRec.tip
        ? `${selectedRec.tip} Total trip: ~${selectedRec.totalMinutes} min · Fare: ${selectedRec.totalFare}.`
        : `Welcome to ${selectedPlace.name}! Total: ~${selectedRec.totalMinutes} min · Fare: ${selectedRec.totalFare}.`,
    },
  ] : []

  const gpsLabel = gpsStatus === 'requesting' ? '⏳ Getting your location…'
    : gpsStatus === 'granted' ? '📍 Using your GPS location'
    : gpsStatus === 'denied' ? '⚠️ Location blocked — tap to retry'
    : '⚠️ GPS unavailable — tap to retry'

  const quickSearches = ['WVSU', 'SM City', 'Hospital', 'Airport', 'Molo Church', "Tatoy's", 'Batchoy', 'Guimaras', 'Jollibee', 'Esplanade']

  return (
    <div style={{ paddingTop: '72px', minHeight: '100vh', background: 'var(--color-cream)' }}>

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(160deg, #1B4F8A, #0D3060)', padding: '36px 24px 72px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 25% 60%, rgba(212,160,23,0.12) 0%, transparent 55%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '940px', margin: '0 auto', position: 'relative' }}>

          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                <Bus size={14} color="#D4A017" />
                <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.12em', color: '#D4A017', textTransform: 'uppercase' }}>Iloilo Jeepney Navigator</span>
              </div>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px,5vw,50px)', color: 'white', fontWeight: '700', margin: 0, lineHeight: 1.1 }}>Where are you going?</h1>
              <p style={{ fontSize: '14px', color: 'rgba(200,220,255,0.7)', marginTop: '8px', marginBottom: 0 }}>Search any place — we find your jeepney automatically</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button onClick={() => setShowMap(m => !m)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: showMap ? '#D4A017' : 'rgba(255,255,255,0.12)', border: `1px solid ${showMap ? '#D4A017' : 'rgba(255,255,255,0.2)'}`, borderRadius: '10px', padding: '9px 14px', color: showMap ? '#1A1209' : 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                <Map size={14} /> {showMap ? 'Hide Map' : 'Show Map'}
              </button>
              {selectedPlace && <button onClick={reset} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', padding: '9px 14px', color: 'white', fontSize: '13px', cursor: 'pointer' }}>
                <RotateCcw size={13} /> Clear
              </button>}
            </div>
          </div>

          {/* GPS status pill */}
          <button onClick={startGps} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: gpsStatus === 'granted' ? 'rgba(66,133,244,0.2)' : 'rgba(255,200,50,0.15)', border: `1px solid ${gpsStatus === 'granted' ? 'rgba(66,133,244,0.4)' : 'rgba(255,200,50,0.3)'}`, borderRadius: '100px', padding: '7px 16px', color: 'white', fontSize: '12px', fontWeight: '600', cursor: 'pointer', marginBottom: '16px' }}>
            <Locate size={13} style={{ animation: gpsStatus === 'requesting' ? 'spin 1.5s linear infinite' : 'none' }} />
            {gpsLabel}
            {gpsStatus === 'granted' && <CheckCircle size={12} color="rgba(100,220,150,0.9)" />}
          </button>

          {/* Search bar */}
          <div ref={searchRef} style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: focused ? 'white' : 'rgba(255,255,255,0.96)', borderRadius: focused ? '14px 14px 0 0' : '14px', padding: '0 16px', boxShadow: focused ? '0 0 0 3px rgba(212,160,23,0.5)' : '0 6px 28px rgba(0,0,0,0.25)', transition: 'all 0.2s', minHeight: '52px' }}>
              <Search size={18} color={focused ? '#1B4F8A' : 'rgba(26,18,9,0.4)'} style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder={selectedPlace ? selectedPlace.name : 'Search: WVSU, SM City, Jollibee, Molo Church, hospital, airport…'}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '15px', color: selectedPlace && !query ? '#1B4F8A' : '#1A1209', padding: '16px 0', fontFamily: 'DM Sans, sans-serif', fontWeight: selectedPlace && !query ? '600' : '400' }}
              />
              {(query || selectedPlace) && (
                <button onClick={() => { setQuery(''); if (selectedPlace) reset() }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'rgba(26,18,9,0.35)', display: 'flex', flexShrink: 0 }}>
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Results */}
            {focused && query && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', borderRadius: '0 0 16px 16px', boxShadow: '0 20px 48px rgba(0,0,0,0.18)', zIndex: 200, overflow: 'hidden', maxHeight: '400px', overflowY: 'auto', border: '1px solid rgba(26,18,9,0.06)', borderTop: 'none' }}>
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
                      style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 18px', textAlign: 'left', borderTop: i === 0 ? 'none' : '1px solid rgba(26,18,9,0.04)', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(27,79,138,0.04)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'none'}
                    >
                      <div style={{ width: '42px', height: '42px', borderRadius: '11px', background: `${cat.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '21px', flexShrink: 0 }}>{place.emoji}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1A1209', marginBottom: '3px' }}>{place.name}</div>
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
            {focused && !query && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', borderRadius: '0 0 16px 16px', boxShadow: '0 20px 48px rgba(0,0,0,0.18)', zIndex: 200, padding: '14px 18px 18px', border: '1px solid rgba(26,18,9,0.06)', borderTop: 'none' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(26,18,9,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Popular searches</div>
                <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  {quickSearches.map(s => (
                    <button key={s} onClick={() => setQuery(s)} style={{ background: 'var(--color-cream)', border: '1px solid rgba(26,18,9,0.08)', borderRadius: '100px', padding: '5px 13px', fontSize: '12px', color: '#1A1209', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Search size={10} color="rgba(26,18,9,0.35)" />{s}
                    </button>
                  ))}
                </div>
                <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(26,18,9,0.05)', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {(['restaurant','church','mall','hotel','hospital','school'] as const).map(cat => {
                    const c = categoryConfig[cat]
                    return <button key={cat} onClick={() => setQuery(c.label)} style={{ background: `${c.color}10`, border: `1px solid ${c.color}20`, borderRadius: '100px', padding: '4px 12px', fontSize: '11px', color: c.color, fontWeight: '600', cursor: 'pointer' }}>{c.emoji} {c.label}</button>
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN ────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: '940px', margin: '-28px auto 0', padding: '0 24px 80px', position: 'relative', zIndex: 1 }}>

        {/* MAP */}
        {showMap && (
          <div style={{ background: 'white', borderRadius: '22px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(26,18,9,0.1)', marginBottom: '20px' }}>
            <div style={{ padding: '13px 18px', borderBottom: '1px solid rgba(26,18,9,0.06)', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <Map size={14} color="#1B4F8A" />
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#1A1209' }}>
                {selectedPlace ? `Route to ${selectedPlace.name}` : 'Iloilo City — tap any pin to get directions'}
              </span>
              {selectedRec && (
                <span style={{ marginLeft: 'auto', background: `${selectedRec.route.color}15`, color: selectedRec.route.color, fontSize: '11px', padding: '3px 10px', borderRadius: '100px', fontWeight: '700' }}>
                  {selectedRec.route.displayName}
                </span>
              )}
            </div>
            <IloiloMap
              markers={mapMarkers}
              selectedId={selectedPlace?.id ?? null}
              userLocation={userLoc}
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

        {/* Nearby routes when GPS active, no destination chosen */}
        {gpsStatus === 'granted' && !selectedPlace && nearbyRoutes.length > 0 && (
          <div style={{ background: 'white', borderRadius: '20px', padding: '22px 24px', boxShadow: '0 4px 20px rgba(26,18,9,0.07)', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#4285F4', boxShadow: '0 0 0 3px rgba(66,133,244,0.2)' }} />
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#1A1209' }}>Jeepneys you can board right now</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
              {nearbyRoutes.slice(0, 5).map((nr, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', background: 'var(--color-cream)', borderRadius: '12px' }}>
                  <div style={{ background: nr.route.color, borderRadius: '10px', padding: '6px 12px', flexShrink: 0 }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: 'white', whiteSpace: 'nowrap' }}>{nr.route.displayName}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1A1209', marginBottom: '2px' }}>{nr.route.fullRoute}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(26,18,9,0.5)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Footprints size={10} />{nr.walkMeters}m to {nr.stop.name}</span>
                      <span>· {nr.route.frequency}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: nr.walkMeters < 250 ? '#2D6A4F' : nr.walkMeters < 600 ? '#B8860B' : '#C41E3A', background: nr.walkMeters < 250 ? 'rgba(45,106,79,0.1)' : nr.walkMeters < 600 ? 'rgba(212,160,23,0.1)' : 'rgba(196,30,58,0.08)', padding: '3px 10px', borderRadius: '100px', flexShrink: 0, whiteSpace: 'nowrap' }}>
                    ~{minsWalk(nr.walkMeters)} min walk
                  </span>
                </div>
              ))}
            </div>
            <div style={{ padding: '11px 14px', background: 'rgba(27,79,138,0.05)', borderRadius: '11px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={13} color="#1B4F8A" />
              <span style={{ fontSize: '13px', color: '#1B4F8A', fontWeight: '500' }}>Search a destination above to get your personalized jeepney suggestion</span>
            </div>
          </div>
        )}

        {/* GPS denied prompt */}
        {gpsStatus === 'denied' && !selectedPlace && (
          <div style={{ background: 'white', borderRadius: '20px', padding: '28px', textAlign: 'center', boxShadow: '0 4px 20px rgba(26,18,9,0.07)', marginBottom: '16px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📍</div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', color: '#1A1209', marginBottom: '8px' }}>Enable location for smart routing</h3>
            <p style={{ fontSize: '13px', color: 'rgba(26,18,9,0.6)', lineHeight: '1.7', maxWidth: '380px', margin: '0 auto 20px' }}>
              Allow location access in your browser settings, then tap retry. We use your GPS to find the nearest jeepney stop.
            </p>
            <button onClick={startGps} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#1B4F8A', color: 'white', padding: '12px 24px', borderRadius: '11px', fontSize: '14px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>
              <Locate size={15} /> Retry GPS
            </button>
          </div>
        )}

        {/* ── DESTINATION SELECTED ─────────────────────────────────── */}
        {selectedPlace && (
          <div>
            {/* Destination header */}
            <div style={{ background: 'white', borderRadius: '18px', padding: '16px 20px', boxShadow: '0 4px 18px rgba(26,18,9,0.08)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '13px', background: `${categoryConfig[selectedPlace.category].color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>{selectedPlace.emoji}</div>
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
              {gpsStatus === 'granted' && <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'rgba(26,18,9,0.4)' }}>
                <Navigation size={11} /> From your location
              </div>}
            </div>

            {/* Needs GPS */}
            {gpsStatus !== 'granted' && (
              <div style={{ background: 'linear-gradient(135deg, #1B4F8A, #0D3060)', borderRadius: '18px', padding: '24px', marginBottom: '14px', textAlign: 'center' }}>
                <Locate size={28} color="rgba(255,255,255,0.5)" style={{ marginBottom: '10px' }} />
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: 'white', marginBottom: '8px' }}>Enable GPS to get directions</h3>
                <p style={{ fontSize: '13px', color: 'rgba(200,220,255,0.8)', marginBottom: '18px', lineHeight: '1.6' }}>We need your location to suggest the right jeepney to <strong>{selectedPlace.name}</strong>.</p>
                <button onClick={startGps} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: '#D4A017', color: '#1A1209', padding: '11px 24px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', border: 'none', cursor: 'pointer' }}>
                  <Locate size={15} /> {gpsStatus === 'requesting' ? 'Getting GPS…' : 'Enable GPS'}
                </button>
              </div>
            )}

            {/* ── ROUTE RECOMMENDATIONS ────────────────────────────── */}
            {gpsStatus === 'granted' && recommendations.length > 0 && (
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(26,18,9,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Bus size={12} color="#C41E3A" /> {recommendations.length} jeepney option{recommendations.length !== 1 ? 's' : ''} from your location
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {recommendations.map((rec, i) => {
                    const c = conf[rec.confidence]
                    const isSelected = selectedRec === rec
                    return (
                      <button key={i} onClick={() => { setSelectedRec(rec); setShowRiding(false); setRidingStep(0) }}
                        style={{ background: 'white', border: isSelected ? `2px solid ${rec.route.color}` : '2px solid rgba(26,18,9,0.07)', borderRadius: '18px', padding: 0, overflow: 'hidden', cursor: 'pointer', textAlign: 'left', boxShadow: isSelected ? `0 8px 28px ${rec.route.color}28` : '0 2px 12px rgba(26,18,9,0.06)', transition: 'all 0.2s' }}
                        onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = `${rec.route.color}50` }}
                        onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(26,18,9,0.07)' }}
                      >
                        {/* Route header strip */}
                        <div style={{ background: isSelected ? rec.route.color : `${rec.route.color}12`, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                          {/* Name badge */}
                          <div style={{ background: isSelected ? 'rgba(255,255,255,0.22)' : rec.route.color, borderRadius: '10px', padding: '7px 14px', flexShrink: 0 }}>
                            <div style={{ fontSize: '13px', fontWeight: '800', color: 'white', whiteSpace: 'nowrap' }}>{rec.route.displayName}</div>
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: isSelected ? 'white' : '#1A1209', marginBottom: '1px' }}>{rec.route.fullRoute}</div>
                            <div style={{ fontSize: '11px', color: isSelected ? 'rgba(255,255,255,0.65)' : 'rgba(26,18,9,0.45)' }}>{rec.route.frequency} · {rec.route.operatingHours}</div>
                          </div>
                          <div style={{ display: 'flex', gap: '6px', flexShrink: 0, flexWrap: 'wrap' }}>
                            {i === 0 && <span style={{ background: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(212,160,23,0.15)', color: isSelected ? 'white' : '#9A7010', fontSize: '10px', fontWeight: '700', padding: '3px 9px', borderRadius: '100px' }}>⭐ Best</span>}
                            <span style={{ background: isSelected ? 'rgba(255,255,255,0.2)' : c.bg, color: isSelected ? 'white' : c.text, border: isSelected ? 'none' : `1px solid ${c.border}`, fontSize: '10px', fontWeight: '700', padding: '3px 9px', borderRadius: '100px' }}>{c.badge}</span>
                          </div>
                        </div>

                        {/* Journey details */}
                        <div style={{ padding: '14px 20px' }}>
                          {/* Flow: You → walk → Board → ride → Alight */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                            <div style={{ background: 'rgba(66,133,244,0.08)', borderRadius: '9px', padding: '7px 12px' }}>
                              <div style={{ fontSize: '9px', color: '#4285F4', fontWeight: '700', textTransform: 'uppercase', marginBottom: '2px' }}>You</div>
                              <div style={{ fontSize: '12px', fontWeight: '600', color: '#1A1209' }}>📍 Your location</div>
                            </div>
                            <div style={{ textAlign: 'center', flexShrink: 0 }}>
                              <div style={{ fontSize: '9px', color: 'rgba(26,18,9,0.35)' }}>~{rec.walkMinutes} min walk</div>
                              <Footprints size={13} color="rgba(26,18,9,0.3)" />
                            </div>
                            <div style={{ background: `${rec.route.color}12`, border: `1px solid ${rec.route.color}25`, borderRadius: '9px', padding: '7px 12px', flex: 1, minWidth: '80px' }}>
                              <div style={{ fontSize: '9px', color: rec.route.color, fontWeight: '700', textTransform: 'uppercase', marginBottom: '2px' }}>Board at</div>
                              <div style={{ fontSize: '12px', fontWeight: '600', color: '#1A1209', lineHeight: '1.3' }}>{rec.boardingStop.name.split('/')[0].trim()}</div>
                            </div>
                            <div style={{ textAlign: 'center', flexShrink: 0 }}>
                              <div style={{ fontSize: '9px', color: 'rgba(26,18,9,0.35)' }}>~{rec.rideMinutes} min</div>
                              <div style={{ width: '22px', height: '2px', background: rec.route.color, borderRadius: '2px', margin: '3px auto' }} />
                              <Bus size={11} color={rec.route.color} />
                            </div>
                            <div style={{ background: `${rec.route.color}1A`, borderRadius: '9px', padding: '7px 12px', flex: 1, minWidth: '80px' }}>
                              <div style={{ fontSize: '9px', color: rec.route.color, fontWeight: '700', textTransform: 'uppercase', marginBottom: '2px' }}>Alight at</div>
                              <div style={{ fontSize: '12px', fontWeight: '600', color: '#1A1209', lineHeight: '1.3' }}>{rec.destination.alightAt}</div>
                            </div>
                          </div>

                          {/* Stats */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: isSelected ? '12px' : 0 }}>
                            {[
                              { icon: DollarSign, label: 'Fare',       val: rec.totalFare,          color: '#2D6A4F' },
                              { icon: Clock,       label: 'Total time', val: `~${rec.totalMinutes} min`, color: '#1B4F8A' },
                              { icon: Zap,         label: 'Frequency', val: rec.route.frequency,    color: '#B8860B' },
                            ].map(({ icon: Icon, label, val, color }) => (
                              <div key={label} style={{ background: 'var(--color-cream)', borderRadius: '9px', padding: '9px 8px', textAlign: 'center' }}>
                                <Icon size={14} color={color} style={{ marginBottom: '3px' }} />
                                <div style={{ fontSize: '12px', fontWeight: '700', color: '#1A1209', marginBottom: '1px' }}>{val}</div>
                                <div style={{ fontSize: '9px', color: 'rgba(26,18,9,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                              </div>
                            ))}
                          </div>

                          {isSelected && rec.tip && (
                            <div style={{ display: 'flex', gap: '8px', padding: '10px 12px', background: 'rgba(212,160,23,0.07)', borderRadius: '10px', marginBottom: '12px', alignItems: 'flex-start' }}>
                              <Star size={13} color="#D4A017" fill="#D4A017" style={{ marginTop: '2px', flexShrink: 0 }} />
                              <p style={{ fontSize: '12px', color: 'rgba(26,18,9,0.7)', lineHeight: '1.5', margin: 0 }}>{rec.tip}</p>
                            </div>
                          )}

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

            {/* No routes */}
            {gpsStatus === 'granted' && recommendations.length === 0 && (
              <div style={{ background: 'white', borderRadius: '18px', padding: '28px', textAlign: 'center', boxShadow: '0 4px 18px rgba(26,18,9,0.07)', marginBottom: '14px' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🚌</div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#1A1209', marginBottom: '8px' }}>No direct jeepney found</div>
                <div style={{ fontSize: '13px', color: 'rgba(26,18,9,0.55)', lineHeight: '1.6', maxWidth: '340px', margin: '0 auto' }}>Try searching a nearby landmark or take a tricycle to the nearest jeepney stop.</div>
              </div>
            )}

            {/* ── RIDING GUIDE ─────────────────────────────────────── */}
            {showRiding && selectedRec && (
              <div style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 8px 32px rgba(26,18,9,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <div style={{ background: selectedRec.route.color, borderRadius: '9px', padding: '6px 12px', flexShrink: 0 }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: 'white', whiteSpace: 'nowrap' }}>{selectedRec.route.displayName}</span>
                  </div>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', color: '#1A1209', margin: 0 }}>Riding Guide</h2>
                </div>
                <p style={{ fontSize: '12px', color: 'rgba(26,18,9,0.4)', marginBottom: '24px' }}>
                  Your location → {selectedPlace.name} · ~{selectedRec.totalMinutes} min · {selectedRec.totalFare}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {ridingSteps.map((s, i) => {
                    const isActive = i === ridingStep
                    const isDone = i < ridingStep
                    const isLast = i === ridingSteps.length - 1
                    return (
                      <div key={i} style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: isDone ? '#2D6A4F' : isActive ? selectedRec.route.color : 'var(--color-cream)', border: `2px solid ${isDone ? '#2D6A4F' : isActive ? selectedRec.route.color : 'rgba(26,18,9,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '19px', color: isDone ? 'white' : 'inherit', transition: 'all 0.3s' }}>
                            {isDone ? '✓' : s.icon}
                          </div>
                          {!isLast && <div style={{ width: '2px', flex: 1, minHeight: '16px', background: isDone ? '#2D6A4F' : 'rgba(26,18,9,0.08)', margin: '3px 0' }} />}
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

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
