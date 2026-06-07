'use client'

import { useEffect, useRef, useCallback } from 'react'
import type { Map, Marker, Polyline, Circle } from 'leaflet'

export interface MapMarker {
  id: string
  name: string
  emoji: string
  lat: number
  lng: number
  color: string
  district?: string
  subtitle?: string
  isSelected?: boolean
  isUser?: boolean
  popupHtml?: string
}

export interface RoutePolyline {
  code: string
  color: string
  path: [number, number][]
}

interface IloiloMapProps {
  markers: MapMarker[]
  selectedId?: string | null
  userLocation?: { lat: number; lng: number } | null
  onMarkerClick?: (id: string) => void
  routes?: RoutePolyline[]
  center?: [number, number]
  zoom?: number
  height?: string
}

const ILOILO_CENTER: [number, number] = [10.7202, 122.5621]

export default function IloiloMap({
  markers, selectedId, userLocation, onMarkerClick,
  routes = [], center = ILOILO_CENTER, zoom = 13, height = '480px',
}: IloiloMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<Map | null>(null)
  const markersRef = useRef<Marker[]>([])
  const polylinesRef = useRef<Polyline[]>([])
  const userMarkerRef = useRef<Marker | null>(null)
  const userCircleRef = useRef<Circle | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return
    import('leaflet').then(L => {
      const iconProto = L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: unknown }
      delete iconProto._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })
      const map = L.map(mapRef.current!, { center, zoom, zoomControl: true, scrollWheelZoom: true })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)
      mapInstanceRef.current = map
    })
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markersRef.current = []
        polylinesRef.current = []
        userMarkerRef.current = null
        userCircleRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const renderAll = useCallback(() => {
    if (!mapInstanceRef.current) return
    import('leaflet').then(L => {
      const map = mapInstanceRef.current!

      // Clear markers
      markersRef.current.forEach(m => m.remove())
      markersRef.current = []

      // Place markers
      markers.forEach(md => {
        const isSelected = md.id === selectedId
        const size = isSelected ? 56 : 40
        const icon = L.divIcon({
          html: `<div style="width:${size}px;height:${size}px;background:${isSelected ? md.color : 'white'};border:${isSelected ? 4 : 2}px solid ${md.color};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:${isSelected ? 26 : 18}px;box-shadow:0 ${isSelected ? 10 : 3}px ${isSelected ? 28 : 10}px rgba(0,0,0,${isSelected ? 0.35 : 0.15});cursor:pointer;transition:all 0.3s;">${md.emoji}</div>${isSelected ? `<div style="position:absolute;bottom:-30px;left:50%;transform:translateX(-50%);background:${md.color};color:white;white-space:nowrap;padding:4px 12px;border-radius:100px;font-size:11px;font-weight:700;font-family:sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.2)">${md.name}</div>` : ''}`,
          className: '', iconSize: [size, size], iconAnchor: [size / 2, size / 2],
        })
        const popup = md.popupHtml || `<div style="font-family:sans-serif;padding:4px"><div style="font-size:22px;margin-bottom:6px">${md.emoji}</div><div style="font-size:15px;font-weight:700;color:#1A1209;margin-bottom:3px">${md.name}</div>${md.district ? `<div style="font-size:12px;color:#888;margin-bottom:6px">${md.district}</div>` : ''}${md.subtitle ? `<div style="font-size:12px;color:#555">${md.subtitle}</div>` : ''}</div>`
        const m = L.marker([md.lat, md.lng], { icon }).addTo(map).bindPopup(popup, { maxWidth: 260 })
        if (onMarkerClick) m.on('click', () => onMarkerClick(md.id))
        markersRef.current.push(m)
      })

      // User location
      if (userMarkerRef.current) { userMarkerRef.current.remove(); userMarkerRef.current = null }
      if (userCircleRef.current) { userCircleRef.current.remove(); userCircleRef.current = null }
      if (userLocation) {
        const userIcon = L.divIcon({
          html: `<div style="width:20px;height:20px;background:#4285F4;border:3px solid white;border-radius:50%;box-shadow:0 0 0 4px rgba(66,133,244,0.25);"></div>`,
          className: '', iconSize: [20, 20], iconAnchor: [10, 10],
        })
        userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon, zIndexOffset: 1000 })
          .addTo(map).bindPopup('<div style="font-family:sans-serif;font-size:13px;font-weight:600">📍 You are here</div>')
        userCircleRef.current = L.circle([userLocation.lat, userLocation.lng], { radius: 150, color: '#4285F4', fillColor: '#4285F4', fillOpacity: 0.08, weight: 1 }).addTo(map)
      }

      // Routes
      polylinesRef.current.forEach(p => p.remove())
      polylinesRef.current = []
      routes.forEach(route => {
        if (route.path.length < 2) return
        const line = L.polyline(route.path, { color: route.color, weight: 5, opacity: 0.85, dashArray: '10,6', lineJoin: 'round' }).addTo(map)
        polylinesRef.current.push(line)
      })

      // Fly to selected
      if (selectedId) {
        const found = markers.find(m => m.id === selectedId)
        if (found) map.flyTo([found.lat, found.lng], 15, { duration: 1.0 })
      } else if (userLocation && markers.length === 0) {
        map.flyTo([userLocation.lat, userLocation.lng], 15, { duration: 1.0 })
      }
    })
  }, [markers, selectedId, userLocation, routes, onMarkerClick])

  useEffect(() => { renderAll() }, [renderAll])

  return (
    <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>
      <div ref={mapRef} style={{ width: '100%', height }} />
      <style>{`
        .leaflet-container { font-family: 'DM Sans', sans-serif; }
        .leaflet-popup-content-wrapper { border-radius: 14px !important; box-shadow: 0 8px 32px rgba(0,0,0,0.15) !important; border: none !important; }
        .leaflet-popup-tip-container { display: none; }
        .leaflet-control-attribution { font-size: 10px !important; }
        .leaflet-control-zoom a { border-radius: 8px !important; font-family: sans-serif !important; }
      `}</style>
    </div>
  )
}
