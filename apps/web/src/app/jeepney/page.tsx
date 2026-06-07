'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import {
  Bus, MapPin, ArrowRight, RotateCcw, Clock, DollarSign,
  Star, Navigation, Zap, Search, X, Map, Locate, ChevronRight,
  AlertCircle, CheckCircle, Footprints, Info
} from 'lucide-react'
import { iloiloPlaces, searchPlaces, categoryConfig, type Place } from '@/data/places'
import { findRoutes, findNearbyBoarding, type RouteRecommendation } from '@/lib/jeepneyRouting'

const IloiloMap = dynamic(() => import('@/components/ui/IloiloMap'), {
  ssr: false,
  loading: () => (
    <div style={{ width: '100%', height: '480px', background: '#e8ead8', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', color: 'rgba(26,18,9,0.4)' }}>
      <div style={{ fontSize: '32px' }}>🗺️</div>
      <div style={{ fontSize: '14px' }}>Loading map…</div>
    </div>
  ),
})

type LocationStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable'

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
  const [mapSelectedId, setMapSelectedId] = useState<string | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const searchResults = searchPlaces(query)

  // Close dropdown on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (!searchRef.current?.contains(e.target as Node)) setSearchFocused(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  // Get GPS location
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) { setLocationStatus('unavailable'); return }
    setLocationStatus('requesting')
    navigator.geolocation.getCurrentPosition(
      pos => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setUserLocation(loc)
        setLocationStatus('granted')
        const nearby = findNearbyBoarding(loc.lat, loc.lng)
        setNearbyRoutes(nearby)
        // If a destination is already selected, re-run routing
        if (selectedPlace) {
          const recs = findRoutes(loc.lat, loc.lng, selectedPlace.id)
          setRecommendations(recs)
        }
      },
      () => setLocationStatus('denied'),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [selectedPlace])

  // Select a destination place
  const selectPlace = useCallback((place: Place) => {
    setSelectedPlace(place)
    setQuery('')
    setSearchFocused(false)
    setMapSelectedId(place.id)
    setSelectedRec(null)
    setShowRiding(false)
    setRidingStep(0)

    if (userLocation) {
      const recs = findRoutes(userLocation.lat, userLocation.lng, place.id)
      setRecommendations(recs)
    } else {
      setRecommendations([])
    }
  }, [userLocation])

  // Select a recommendation and show route on map
  const selectRec = (rec: RouteRecommendation) => {
    setSelectedRec(rec)
    setShowRiding(false)
    setRidingStep(0)
  }

  const reset = () => {
    setQuery(''); setSelectedPlace(null); setRecommendations([])
    setSelectedRec(null); setShowRiding(false); setRidingStep(0)
    setMapSelectedId(null)
  }

  // Build map markers
  const mapMarkers = (() => {
    const markers: import('@/components/ui/IloiloMap').MapMarker[] = []

    // All places or filtered subset
    const placesToShow = selectedPlace
      ? iloiloPlaces.filter(p => p.id === selectedPlace.id)
      : iloiloPlaces.slice(0, 40)

    placesToShow.forEach(p => {
      const cat = categoryConfig[p.category]
      markers.push({
        id: p.id, name: p.name, emoji: p.emoji,
        lat: p.lat, lng: p.lng,
        color: cat.color,
        district: p.district,
        subtitle: p.priceRange || p.openHours || '',
        isSelected: p.id === mapSelectedId,
        popupHtml: `<div style="font-family:sans-serif;padding:4px;min-width:200px"><div style="font-size:22px;margin-bottom:6px">${p.emoji}</div><div style="font-size:15px;font-weight:700;color:#1A1209;margin-bottom:2px">${p.name}</div><div style="font-size:12px;color:#888;margin-bottom:6px">${p.district} · <span style="background:${cat.color}18;color:${cat.color};padding:2px 7px;border-radius:100px;font-weight:600">${cat.label}</span></div>${p.description ? `<div style="font-size:12px;color:#555;line-height:1.5;margin-bottom:6px">${p.description}</div>` : ''}${p.openHours ? `<div style="font-size:11px;color:#888">🕐 ${p.openHours}</div>` : ''}${p.priceRange ? `<div style="font-size:11px;color:#888">💰 ${p.priceRange}</div>` : ''}</div>`,
      })
    })

    // Boarding stop markers when a rec is selected
    if (selectedRec) {
      markers.push({
        id: 'boarding-stop',
        name: `Board here: ${selectedRec.boardingStop.name}`,
        emoji: '🚏',
        lat: selectedRec.boardingStop.lat,
        lng: selectedRec.boardingStop.lng,
        color: selectedRec.route.color,
        district: 'Boarding Stop',
        subtitle: `Route ${selectedRec.route.code} · Walk ${selectedRec.boardingStop.walkMeters}m`,
        isSelected: false,
      })
    }

    return markers
  })()

  const mapRoutes = selectedRec ? [{
    code: selectedRec.route.code,
    color: selectedRec.route.color,
    path: selectedRec.route.path,
  }] : []

  const ridingSteps = selectedRec ? [
    { icon: '📍', title: 'Find your location', desc: `You are near ${selectedRec.boardingStop.name}. Walk ${selectedRec.boardingStop.walkMeters}m (about ${Math.round(selectedRec.boardingStop.walkMeters! / 80)} min) to the boarding stop.` },
    { icon: '👋', title: 'Hail Route ' + selectedRec.route.code, desc: `Stand on the right side of the road. Look for a jeepney with "${selectedRec.route.code}" on the front windshield. Wave your hand to stop it.` },
    { icon: '🗣️', title: 'Tell the driver', desc: `Say "${selectedRec.destination.alightAt}" clearly. The driver or barker will confirm. Board from the rear and find a seat.` },
    { icon: '💰', title: 'Pay the fare', desc: `Pass ${selectedRec.totalFare} toward the driver through fellow passengers. They'll pass your change back the same way. Exact change is appreciated.` },
    { icon: '✋', title: 'Shout "Para!"', desc: `When you see ${selectedRec.destination.alightAt}, shout "Para!" (stop) loudly or tap the metal ceiling. Step off from the rear — check for traffic before alighting.` },
    { icon: '🎉', title: `Arrived at ${selectedPlace?.name || 'destination'}!`, desc: `You've made it! Estimated total trip: ${selectedRec.estimatedTime}. Total fare: ${selectedRec.totalFare}.` },
  ] : []

  const confidenceColors = {
    direct: { bg: 'rgba(45,106,79,0.1)', text: '#2D6A4F', border: 'rgba(45,106,79,0.2)', label: '✓ Direct route' },
    nearby: { bg: 'rgba(212,160,23,0.1)', text: '#B8860B', border: 'rgba(212,160,23,0.2)', label: '~ Short walk to stop' },
    transfer: { bg: 'rgba(196,30,58,0.1)', text: '#C41E3A', border: 'rgba(196,30,58,0.2)', label: '⚡ Longer walk' },
  }

  const quickSearches = ['Molo Church', 'Jollibee', 'SM City', 'Airport', 'Guimaras ferry', 'La Paz Batchoy', "Tatoy's", 'Hospital']

  return (
    <div style={{ paddingTop: '72px', minHeight: '100vh', background: 'var(--color-cream)' }}>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(160deg, #1B4F8A, #0D3060)', padding: '40px 24px 70px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(212,160,23,0.12) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '960px', margin: '0 auto', position: 'relative' }}>

          {/* Top row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Bus size={15} color="#D4A017" />
                <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.12em', color: '#D4A017', textTransform: 'uppercase' }}>Live Jeepney Guide · Iloilo City</span>
              </div>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px,5vw,52px)', color: 'white', fontWeight: '700', margin: 0, lineHeight: 1.1 }}>Where are you going?</h1>
              <p style={{ fontSize: '15px', color: 'rgba(200,220,255,0.7)', marginTop: '8px', marginBottom: 0 }}>Search any place in Iloilo · We find your jeepney</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {/* GPS button */}
              <button onClick={requestLocation} style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                background: locationStatus === 'granted' ? 'rgba(66,133,244,0.25)' : locationStatus === 'requesting' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.12)',
                border: `1px solid ${locationStatus === 'granted' ? 'rgba(66,133,244,0.5)' : 'rgba(255,255,255,0.2)'}`,
                borderRadius: '10px', padding: '10px 16px', color: 'white',
                fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap',
              }}>
                <Locate size={14} style={{ animation: locationStatus === 'requesting' ? 'spin 1s linear infinite' : 'none' }} />
                {locationStatus === 'idle' && 'Use My Location'}
                {locationStatus === 'requesting' && 'Getting GPS…'}
                {locationStatus === 'granted' && '📍 Location Active'}
                {locationStatus === 'denied' && 'Location Denied'}
                {locationStatus === 'unavailable' && 'GPS Unavailable'}
              </button>
              <button onClick={() => setShowMap(m => !m)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: showMap ? '#D4A017' : 'rgba(255,255,255,0.12)', border: `1px solid ${showMap ? '#D4A017' : 'rgba(255,255,255,0.2)'}`, borderRadius: '10px', padding: '10px 16px', color: showMap ? '#1A1209' : 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                <Map size={14} />{showMap ? 'Hide Map' : 'Show Map'}
              </button>
              {selectedPlace && <button onClick={reset} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', padding: '10px 16px', color: 'white', fontSize: '13px', cursor: 'pointer' }}>
                <RotateCcw size={14} /> Clear
              </button>}
            </div>
          </div>

          {/* SEARCH BAR */}
          <div ref={searchRef} style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: searchFocused ? 'white' : 'rgba(255,255,255,0.95)', borderRadius: searchFocused ? '16px 16px 0 0' : '16px', padding: '0 18px', boxShadow: searchFocused ? '0 0 0 3px rgba(212,160,23,0.5)' : '0 6px 28px rgba(0,0,0,0.25)', transition: 'all 0.2s' }}>
              <Search size={18} color={searchFocused ? '#1B4F8A' : 'rgba(26,18,9,0.4)'} style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder={selectedPlace ? `→ ${selectedPlace.name}` : 'Search restaurants, churches, malls, hospitals, hotels…'}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '15px', color: 'var(--color-dark)', padding: '17px 0', fontFamily: 'DM Sans, sans-serif', fontWeight: selectedPlace && !query ? '500' : '400' }}
              />
              {(query || selectedPlace) && <button onClick={() => { setQuery(''); if (!selectedPlace) setSearchFocused(true) }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'rgba(26,18,9,0.4)', display: 'flex' }}><X size={16} /></button>}
            </div>

            {/* Dropdown: search results */}
            {searchFocused && query && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', borderRadius: '0 0 18px 18px', boxShadow: '0 20px 48px rgba(0,0,0,0.18)', zIndex: 200, overflow: 'hidden', border: '1px solid rgba(26,18,9,0.06)', borderTop: 'none', maxHeight: '420px', overflowY: 'auto' }}>
                {searchResults.length === 0 ? (
                  <div style={{ padding: '24px 20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Search size={18} color="rgba(26,18,9,0.2)" />
                    <div>
                      <div style={{ fontSize: '14px', color: 'rgba(26,18,9,0.5)', fontWeight: '500' }}>No results for &ldquo;{query}&rdquo;</div>
                      <div style={{ fontSize: '12px', color: 'rgba(26,18,9,0.35)', marginTop: '3px' }}>Try: SM City, Jollibee, Molo Church, hospital…</div>
                    </div>
                  </div>
                ) : searchResults.map((place, i) => {
                  const cat = categoryConfig[place.category]
                  return (
                    <button key={place.id} onClick={() => selectPlace(place)}
                      style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', padding: '13px 20px', textAlign: 'left', borderTop: i === 0 ? 'none' : '1px solid rgba(26,18,9,0.05)', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(27,79,138,0.04)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'none'}
                    >
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${cat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>{place.emoji}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '3px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-dark)' }}>{place.name}</span>
                          <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '100px', background: `${cat.color}15`, color: cat.color, fontWeight: '600' }}>{cat.label}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'rgba(26,18,9,0.5)', display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><MapPin size={10} />{place.district}</span>
                          {place.openHours && <><span>·</span><span>🕐 {place.openHours.split('–')[0].trim()}</span></>}
                          {place.priceRange && <><span>·</span><span>💰 {place.priceRange}</span></>}
                        </div>
                      </div>
                      <ArrowRight size={14} color="rgba(26,18,9,0.2)" style={{ flexShrink: 0 }} />
                    </button>
                  )
                })}
              </div>
            )}

            {/* Dropdown: suggestions when empty */}
            {searchFocused && !query && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', borderRadius: '0 0 18px 18px', boxShadow: '0 20px 48px rgba(0,0,0,0.18)', zIndex: 200, padding: '16px 20px 20px', border: '1px solid rgba(26,18,9,0.06)', borderTop: 'none' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(26,18,9,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Popular searches</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {quickSearches.map(s => (
                    <button key={s} onClick={() => setQuery(s)} style={{ background: 'var(--color-cream)', border: '1px solid rgba(26,18,9,0.08)', borderRadius: '100px', padding: '7px 14px', fontSize: '13px', color: 'var(--color-dark)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Search size={11} color="rgba(26,18,9,0.35)" />{s}
                    </button>
                  ))}
                </div>
                <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(26,18,9,0.06)' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(26,18,9,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Browse by type</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {(['restaurant', 'church', 'mall', 'hotel', 'hospital', 'cafe', 'market'] as const).map(cat => {
                      const c = categoryConfig[cat]
                      return (
                        <button key={cat} onClick={() => setQuery(c.label)} style={{ background: `${c.color}10`, border: `1px solid ${c.color}25`, borderRadius: '100px', padding: '6px 14px', fontSize: '12px', color: c.color, fontWeight: '600', cursor: 'pointer' }}>
                          {c.emoji} {c.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Location status bar */}
          {locationStatus === 'denied' && (
            <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255,200,100,0.9)' }}>
              <AlertCircle size={14} /><span>Location denied — enable it in browser settings for personalized routes.</span>
            </div>
          )}
          {locationStatus === 'granted' && !selectedPlace && (
            <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(100,220,180,0.9)' }}>
              <CheckCircle size={14} /><span>GPS active · {nearbyRoutes.length} jeepney routes reachable from your location · Now search a destination!</span>
            </div>
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: '960px', margin: '-32px auto 0', padding: '0 24px 80px', position: 'relative', zIndex: 1 }}>

        {/* MAP */}
        {showMap && (
          <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(26,18,9,0.1)', marginBottom: '20px' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(26,18,9,0.06)', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <Map size={15} color="#1B4F8A" />
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-dark)' }}>
                {selectedPlace ? `Route to ${selectedPlace.name}` : 'Iloilo City — All Places'}
              </span>
              {selectedRec && (
                <span style={{ marginLeft: 'auto', fontSize: '12px', background: `${selectedRec.route.color}15`, color: selectedRec.route.color, padding: '4px 12px', borderRadius: '100px', fontWeight: '600' }}>
                  Route {selectedRec.route.code} active
                </span>
              )}
              {!selectedPlace && (
                <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'rgba(26,18,9,0.4)' }}>
                  {iloiloPlaces.length} places · Click any pin
                </span>
              )}
            </div>
            <IloiloMap
              markers={mapMarkers}
              selectedId={mapSelectedId}
              userLocation={userLocation}
              routes={mapRoutes}
              onMarkerClick={id => {
                const place = iloiloPlaces.find(p => p.id === id)
                if (place) selectPlace(place)
              }}
              height="460px"
              zoom={selectedPlace ? 15 : 13}
            />
          </div>
        )}

        {/* NEARBY ROUTES (when location granted, no destination yet) */}
        {locationStatus === 'granted' && !selectedPlace && nearbyRoutes.length > 0 && (
          <div style={{ background: 'white', borderRadius: '20px', padding: '24px 28px', boxShadow: '0 4px 20px rgba(26,18,9,0.08)', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4285F4', boxShadow: '0 0 0 3px rgba(66,133,244,0.2)' }} />
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-dark)' }}>Jeepneys near you</span>
              <span style={{ fontSize: '12px', color: 'rgba(26,18,9,0.4)' }}>· within walking distance</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {nearbyRoutes.slice(0, 6).map((nr, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'var(--color-cream)', borderRadius: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: nr.route.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '800', color: 'white', flexShrink: 0 }}>
                    {nr.route.code}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-dark)', marginBottom: '2px' }}>{nr.route.name}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(26,18,9,0.5)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Footprints size={10} /> {nr.walkMeters}m walk to {nr.stop.name}</span>
                      <span>· {nr.route.frequency}</span>
                      <span>· ₱{nr.route.fare.base}+</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '14px', fontSize: '13px', color: 'rgba(26,18,9,0.5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Info size={13} /> Now search a destination above to get personalized route suggestions.
            </div>
          </div>
        )}

        {/* PROMPT: no location yet */}
        {locationStatus === 'idle' && !selectedPlace && (
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(26,18,9,0.08)', textAlign: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📍</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', color: 'var(--color-dark)', marginBottom: '10px' }}>Enable location for smarter routes</h2>
            <p style={{ fontSize: '14px', color: 'rgba(26,18,9,0.6)', lineHeight: '1.7', maxWidth: '440px', margin: '0 auto 24px' }}>
              Share your GPS location and we&apos;ll find the nearest jeepney stop, tell you which route to take, and estimate your walk and ride time.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={requestLocation} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1B4F8A', color: 'white', padding: '14px 28px', borderRadius: '12px', fontSize: '14px', fontWeight: '600', border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(27,79,138,0.25)' }}>
                <Locate size={16} /> Use My Location
              </button>
              <button onClick={() => { setSearchFocused(true) }} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--color-cream)', color: 'var(--color-dark)', padding: '14px 28px', borderRadius: '12px', fontSize: '14px', fontWeight: '600', border: '1px solid rgba(26,18,9,0.1)', cursor: 'pointer' }}>
                <Search size={16} /> Search Destination
              </button>
            </div>
          </div>
        )}

        {/* DESTINATION SELECTED — show route recommendations */}
        {selectedPlace && (
          <div>
            {/* Destination header */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '20px 24px', boxShadow: '0 4px 20px rgba(26,18,9,0.08)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: `${categoryConfig[selectedPlace.category].color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>
                {selectedPlace.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', color: 'var(--color-dark)', margin: 0 }}>{selectedPlace.name}</h2>
                  <span style={{ fontSize: '11px', padding: '3px 9px', borderRadius: '100px', background: `${categoryConfig[selectedPlace.category].color}15`, color: categoryConfig[selectedPlace.category].color, fontWeight: '600' }}>
                    {categoryConfig[selectedPlace.category].label}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(26,18,9,0.55)', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={11} />{selectedPlace.address}</span>
                  {selectedPlace.openHours && <><span>·</span><span>🕐 {selectedPlace.openHours}</span></>}
                </div>
              </div>
            </div>

            {/* No location = prompt */}
            {locationStatus !== 'granted' && (
              <div style={{ background: 'linear-gradient(135deg, #1B4F8A, #0D3060)', borderRadius: '20px', padding: '28px', marginBottom: '16px', textAlign: 'center' }}>
                <Locate size={32} color="rgba(255,255,255,0.6)" style={{ marginBottom: '12px' }} />
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', color: 'white', marginBottom: '8px' }}>Share your location</h3>
                <p style={{ fontSize: '14px', color: 'rgba(200,220,255,0.8)', marginBottom: '20px', lineHeight: '1.6' }}>
                  We need your GPS to find the nearest boarding stop and calculate your exact route to <strong>{selectedPlace.name}</strong>.
                </p>
                <button onClick={requestLocation} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#D4A017', color: '#1A1209', padding: '14px 28px', borderRadius: '12px', fontSize: '14px', fontWeight: '700', border: 'none', cursor: 'pointer' }}>
                  <Locate size={16} /> Enable GPS Now
                </button>
              </div>
            )}

            {/* Route recommendations */}
            {locationStatus === 'granted' && recommendations.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(26,18,9,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Navigation size={13} color="var(--color-red)" /> {recommendations.length} route{recommendations.length !== 1 ? 's' : ''} found from your location
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {recommendations.map((rec, i) => {
                    const conf = confidenceColors[rec.confidence]
                    const isSelected = selectedRec === rec
                    return (
                      <button key={i} onClick={() => selectRec(rec)}
                        style={{ background: isSelected ? 'white' : 'white', border: isSelected ? `2px solid ${rec.route.color}` : '2px solid rgba(26,18,9,0.07)', borderRadius: '18px', padding: '0', overflow: 'hidden', cursor: 'pointer', textAlign: 'left', boxShadow: isSelected ? `0 8px 32px ${rec.route.color}30` : '0 2px 12px rgba(26,18,9,0.06)', transition: 'all 0.25s' }}
                      >
                        {/* Route top bar */}
                        <div style={{ background: isSelected ? rec.route.color : `${rec.route.color}12`, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{ background: isSelected ? 'rgba(255,255,255,0.25)' : rec.route.color, borderRadius: '10px', padding: '8px 14px', textAlign: 'center', flexShrink: 0 }}>
                            <div style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'Playfair Display, serif', color: 'white', lineHeight: 1 }}>{rec.route.code}</div>
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '14px', fontWeight: '700', color: isSelected ? 'white' : 'var(--color-dark)', marginBottom: '2px' }}>{rec.route.name}</div>
                            <div style={{ fontSize: '12px', color: isSelected ? 'rgba(255,255,255,0.75)' : 'rgba(26,18,9,0.5)' }}>{rec.route.frequency} · {rec.route.operatingHours}</div>
                          </div>
                          <div style={{ padding: '4px 12px', borderRadius: '100px', background: isSelected ? 'rgba(255,255,255,0.2)' : conf.bg, color: isSelected ? 'white' : conf.text, fontSize: '11px', fontWeight: '700', border: isSelected ? 'none' : `1px solid ${conf.border}`, flexShrink: 0 }}>
                            {conf.label}
                          </div>
                        </div>

                        {/* Route details */}
                        <div style={{ padding: '16px 18px' }}>
                          {/* Journey */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                            <div style={{ background: 'var(--color-cream)', borderRadius: '10px', padding: '8px 14px', flex: 1, minWidth: '100px' }}>
                              <div style={{ fontSize: '10px', color: 'rgba(26,18,9,0.4)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>Board at</div>
                              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-dark)' }}>{rec.boardingStop.name}</div>
                              <div style={{ fontSize: '11px', color: 'rgba(26,18,9,0.45)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                <Footprints size={10} /> {rec.boardingStop.walkMeters}m walk from you
                              </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                              <div style={{ width: '32px', height: '2px', background: rec.route.color, borderRadius: '2px' }} />
                              <Bus size={14} color={rec.route.color} />
                            </div>
                            <div style={{ background: `${rec.route.color}10`, borderRadius: '10px', padding: '8px 14px', flex: 1, minWidth: '100px', border: `1px solid ${rec.route.color}20` }}>
                              <div style={{ fontSize: '10px', color: rec.route.color, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>Alight at</div>
                              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-dark)' }}>{rec.destination.alightAt}</div>
                            </div>
                          </div>

                          {/* Stats */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
                            {[
                              { icon: DollarSign, label: 'Fare', val: rec.totalFare, color: '#2D6A4F' },
                              { icon: Clock, label: 'Est. Time', val: rec.estimatedTime, color: '#1B4F8A' },
                              { icon: Zap, label: 'Frequency', val: rec.route.frequency, color: '#B8860B' },
                            ].map(({ icon: Icon, label, val, color }) => (
                              <div key={label} style={{ background: 'var(--color-cream)', borderRadius: '10px', padding: '10px 8px', textAlign: 'center' }}>
                                <Icon size={15} color={color} style={{ marginBottom: '4px' }} />
                                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-dark)', marginBottom: '1px' }}>{val}</div>
                                <div style={{ fontSize: '10px', color: 'rgba(26,18,9,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                              </div>
                            ))}
                          </div>

                          {isSelected && (
                            <button onClick={e => { e.stopPropagation(); setShowRiding(true); setRidingStep(0) }}
                              style={{ marginTop: '14px', width: '100%', background: rec.route.color, color: 'white', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                              <Bus size={17} /> Step-by-step riding guide <ArrowRight size={15} />
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
            {locationStatus === 'granted' && recommendations.length === 0 && (
              <div style={{ background: 'white', borderRadius: '18px', padding: '28px', textAlign: 'center', boxShadow: '0 4px 20px rgba(26,18,9,0.07)', marginBottom: '16px' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>🚌</div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-dark)', marginBottom: '8px' }}>No direct jeepney route found</div>
                <div style={{ fontSize: '13px', color: 'rgba(26,18,9,0.55)', lineHeight: '1.6' }}>
                  This destination may require a tricycle or Grab. Try searching a nearby landmark instead.
                </div>
              </div>
            )}

            {/* RIDING GUIDE */}
            {showRiding && selectedRec && (
              <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 8px 32px rgba(26,18,9,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ width: '36px', height: '36px', background: selectedRec.route.color, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: '800', color: 'white', flexShrink: 0 }}>{selectedRec.route.code}</div>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', color: 'var(--color-dark)', margin: 0 }}>Riding Guide</h2>
                </div>
                <p style={{ fontSize: '13px', color: 'rgba(26,18,9,0.5)', marginBottom: '28px' }}>To {selectedPlace.name} · {selectedRec.estimatedTime}</p>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {ridingSteps.map((s, i) => {
                    const isActive = i === ridingStep
                    const isDone = i < ridingStep
                    const isLast = i === ridingSteps.length - 1
                    return (
                      <div key={i} style={{ display: 'flex', gap: '14px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                          <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: isDone ? '#2D6A4F' : isActive ? selectedRec.route.color : 'var(--color-cream)', border: `2px solid ${isDone ? '#2D6A4F' : isActive ? selectedRec.route.color : 'rgba(26,18,9,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isDone ? '18px' : '20px', color: isDone ? 'white' : 'inherit', transition: 'all 0.3s' }}>
                            {isDone ? '✓' : s.icon}
                          </div>
                          {!isLast && <div style={{ width: '2px', flex: 1, minHeight: '20px', background: isDone ? '#2D6A4F' : 'rgba(26,18,9,0.08)', margin: '4px 0' }} />}
                        </div>
                        <div style={{ flex: 1, paddingBottom: isLast ? 0 : '18px' }}>
                          <div style={{ background: isActive ? `${selectedRec.route.color}0D` : 'transparent', border: isActive ? `1px solid ${selectedRec.route.color}25` : '1px solid transparent', borderRadius: '12px', padding: isActive ? '14px 16px' : '7px 0', transition: 'all 0.3s' }}>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: isDone ? 'rgba(26,18,9,0.35)' : 'var(--color-dark)', textDecoration: isDone ? 'line-through' : 'none', marginBottom: isActive ? '7px' : 0 }}>
                              {i + 1}. {s.title}
                            </div>
                            {isActive && <p style={{ fontSize: '13px', color: 'rgba(26,18,9,0.7)', lineHeight: '1.65', margin: 0 }}>{s.desc}</p>}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '28px' }}>
                  {ridingStep > 0 && <button onClick={() => setRidingStep(r => r - 1)} style={{ flex: 1, background: 'var(--color-cream)', border: '1px solid rgba(26,18,9,0.1)', borderRadius: '12px', padding: '13px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: 'var(--color-dark)' }}>← Back</button>}
                  {ridingStep < ridingSteps.length - 1
                    ? <button onClick={() => setRidingStep(r => r + 1)} style={{ flex: 2, background: selectedRec.route.color, color: 'white', border: 'none', borderRadius: '12px', padding: '13px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>Next <ArrowRight size={15} /></button>
                    : <button onClick={() => { setShowRiding(false); reset() }} style={{ flex: 2, background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '12px', padding: '13px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>🎉 Plan another trip</button>
                  }
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 600px) {
          input::placeholder { font-size: 13px; }
        }
      `}</style>
    </div>
  )
}
