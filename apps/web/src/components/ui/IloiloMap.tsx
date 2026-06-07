'use client'

import { useEffect, useRef } from 'react'
import type { Map, Marker, Polyline, DivIcon } from 'leaflet'

interface MarkerData {
  id: string
  name: string
  emoji: string
  lat: number
  lng: number
  color: string
  routeCode?: string
  district: string
  fare?: string
  duration?: string
  isSelected?: boolean
}

interface RoutePolyline {
  code: string
  color: string
  path: [number, number][]
}

interface IloiloMapProps {
  markers: MarkerData[]
  selectedId?: string | null
  onMarkerClick?: (id: string) => void
  routes?: RoutePolyline[]
  center?: [number, number]
  zoom?: number
}

const ILOILO_CENTER: [number, number] = [10.7202, 122.5621]

export default function IloiloMap({
  markers,
  selectedId,
  onMarkerClick,
  routes = [],
  center = ILOILO_CENTER,
  zoom = 13,
}: IloiloMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<Map | null>(null)
  const markersRef = useRef<Marker[]>([])
  const polylinesRef = useRef<Polyline[]>([])

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
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      mapInstanceRef.current = map
      renderMarkers(L, map)
      renderRoutes(L, map, routes)
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markersRef.current = []
        polylinesRef.current = []
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current) return
    import('leaflet').then(L => {
      markersRef.current.forEach(m => m.remove())
      markersRef.current = []
      renderMarkers(L, mapInstanceRef.current!)

      if (selectedId) {
        const found = markers.find(m => m.id === selectedId)
        if (found) mapInstanceRef.current!.flyTo([found.lat, found.lng], 15, { duration: 1.2 })
      }

      renderRoutes(L, mapInstanceRef.current!, routes)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, markers, routes])

  function makeIcon(L: typeof import('leaflet'), marker: MarkerData): DivIcon {
    const isSelected = marker.id === selectedId
    const size = isSelected ? 52 : 40
    return L.divIcon({
      html: `<div style="width:${size}px;height:${size}px;background:${isSelected ? marker.color : 'white'};border:${isSelected ? 4 : 2}px solid ${marker.color};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:${isSelected ? 24 : 18}px;box-shadow:0 ${isSelected ? 8 : 4}px ${isSelected ? 24 : 12}px rgba(0,0,0,${isSelected ? 0.3 : 0.15});cursor:pointer;">${marker.emoji}</div>${isSelected ? `<div style="position:absolute;bottom:-28px;left:50%;transform:translateX(-50%);background:${marker.color};color:white;white-space:nowrap;padding:3px 10px;border-radius:100px;font-size:11px;font-weight:600;font-family:sans-serif;">${marker.name}</div>` : ''}`,
      className: '',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    })
  }

  function renderMarkers(L: typeof import('leaflet'), map: Map) {
    markers.forEach(markerData => {
      const icon = makeIcon(L, markerData)
      const m = L.marker([markerData.lat, markerData.lng], { icon })
        .addTo(map)
        .bindPopup(`<div style="font-family:sans-serif;min-width:180px;padding:4px"><div style="font-size:22px;margin-bottom:6px">${markerData.emoji}</div><div style="font-size:15px;font-weight:700;color:#1A1209;margin-bottom:2px">${markerData.name}</div><div style="font-size:12px;color:#888;margin-bottom:8px">${markerData.district} District</div>${markerData.routeCode ? `<div style="display:inline-block;background:${markerData.color}22;color:${markerData.color};border-radius:100px;padding:3px 10px;font-size:11px;font-weight:700;margin-bottom:6px">Route ${markerData.routeCode}</div>` : ''}${markerData.fare ? `<div style="font-size:12px;color:#555">💰 ${markerData.fare} &nbsp;·&nbsp; ⏱ ${markerData.duration}</div>` : ''}</div>`, { maxWidth: 240 })
      if (onMarkerClick) m.on('click', () => onMarkerClick(markerData.id))
      markersRef.current.push(m)
    })
  }

  function renderRoutes(L: typeof import('leaflet'), map: Map, routeList: RoutePolyline[]) {
    polylinesRef.current.forEach(p => p.remove())
    polylinesRef.current = []
    routeList.forEach(route => {
      if (route.path.length < 2) return
      const line = L.polyline(route.path, { color: route.color, weight: 5, opacity: 0.8, dashArray: '10, 6', lineJoin: 'round' }).addTo(map)
      polylinesRef.current.push(line)
    })
  }

  return (
    <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>
      <div ref={mapRef} style={{ width: '100%', height: '420px' }} />
      <style>{`
        .leaflet-container { font-family: 'DM Sans', sans-serif; }
        .leaflet-popup-content-wrapper { border-radius: 14px !important; box-shadow: 0 8px 32px rgba(0,0,0,0.15) !important; }
        .leaflet-popup-tip { display: none; }
        .leaflet-control-attribution { font-size: 10px !important; }
        .leaflet-control-zoom a { border-radius: 8px !important; }
      `}</style>
    </div>
  )
}
