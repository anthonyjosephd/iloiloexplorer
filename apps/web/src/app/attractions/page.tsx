import type { Metadata } from 'next'
import { MapPin, Clock, Ticket, Star, ChevronRight } from 'lucide-react'
import { attractions, type Attraction } from '@/data'

export const metadata: Metadata = {
  title: 'Attractions — Iloilo Explorer',
  description: 'Discover Iloilo\'s top tourist attractions including UNESCO heritage sites, churches, museums, and beaches.',
}

const categoryColors: Record<Attraction['category'], { bg: string; text: string; border: string }> = {
  heritage: { bg: 'rgba(196, 30, 58, 0.08)', text: '#C41E3A', border: 'rgba(196, 30, 58, 0.2)' },
  religious: { bg: 'rgba(27, 79, 138, 0.08)', text: '#1B4F8A', border: 'rgba(27, 79, 138, 0.2)' },
  museum: { bg: 'rgba(107, 68, 35, 0.08)', text: '#6B4423', border: 'rgba(107, 68, 35, 0.2)' },
  beach: { bg: 'rgba(45, 106, 79, 0.08)', text: '#2D6A4F', border: 'rgba(45, 106, 79, 0.2)' },
  park: { bg: 'rgba(212, 160, 23, 0.08)', text: '#9A7010', border: 'rgba(212, 160, 23, 0.2)' },
  market: { bg: 'rgba(139, 26, 26, 0.08)', text: '#8B1A1A', border: 'rgba(139, 26, 26, 0.2)' },
}

export default function AttractionsPage() {
  const categories = Array.from(new Set(attractions.map(a => a.category)))

  return (
    <div style={{ paddingTop: '72px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(160deg, var(--color-dark) 0%, #2C1810 100%)',
        padding: '80px 24px 100px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 80% 50%, rgba(196, 30, 58, 0.12) 0%, transparent 60%)',
        }} />
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            color: '#D4A017', fontSize: '12px', fontWeight: '600',
            letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '20px',
          }}>
            <MapPin size={12} /> Iloilo, Philippines
          </div>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(40px, 5vw, 72px)',
            color: 'white', fontWeight: '700',
            marginBottom: '20px', lineHeight: '1.1',
          }}>
            Tourist Attractions
          </h1>
          <p style={{
            fontFamily: 'Source Serif 4, serif',
            fontSize: '18px', color: 'rgba(232, 220, 200, 0.75)',
            lineHeight: '1.7', maxWidth: '600px',
          }}>
            From UNESCO World Heritage churches to island paradise — Iloilo&apos;s attractions span centuries of history and natural beauty.
          </p>
        </div>
      </div>

      {/* Category pills */}
      <div style={{ background: 'white', padding: '20px 24px', borderBottom: '1px solid rgba(26,18,9,0.08)', position: 'sticky', top: '72px', zIndex: 10 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
          {['all', ...categories].map(cat => {
            const colors = cat === 'all' ? { bg: 'var(--color-red)', text: 'white', border: 'var(--color-red)' } : categoryColors[cat as Attraction['category']]
            return (
              <span key={cat} style={{
                padding: '8px 18px',
                borderRadius: '100px',
                fontSize: '13px', fontWeight: '500',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                background: cat === 'all' ? 'var(--color-red)' : colors?.bg,
                color: cat === 'all' ? 'white' : colors?.text,
                border: `1px solid ${cat === 'all' ? 'var(--color-red)' : colors?.border}`,
                textTransform: 'capitalize',
              }}>
                {cat === 'all' ? 'All Attractions' : cat}
              </span>
            )
          })}
        </div>
      </div>

      {/* Attractions Grid */}
      <section style={{ padding: '64px 24px', background: 'var(--color-cream)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '28px' }}>
            {attractions.map(attraction => {
              const colors = categoryColors[attraction.category]
              return (
                <article key={attraction.id} id={attraction.id} className="card-hover" style={{
                  background: 'white', borderRadius: '24px', overflow: 'hidden',
                  boxShadow: '0 4px 24px rgba(26, 18, 9, 0.07)',
                  border: '1px solid rgba(26, 18, 9, 0.06)',
                }}>
                  {/* Visual header */}
                  <div style={{
                    height: '200px',
                    background: `linear-gradient(135deg, 
                      ${attraction.category === 'religious' ? '#1B4F8A, #0D3060' :
                        attraction.category === 'heritage' ? '#C41E3A, #8B1A1A' :
                        attraction.category === 'museum' ? '#6B4423, #3D2511' :
                        attraction.category === 'beach' ? '#2D6A4F, #0D4030' :
                        '#1A4A35, #0A2A1E'}
                    )`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '80px', position: 'relative',
                  }}>
                    {attraction.emoji}
                    <div style={{
                      position: 'absolute', top: '16px', left: '16px',
                      background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)',
                      borderRadius: '100px', padding: '4px 12px',
                      fontSize: '11px', fontWeight: '600', color: 'white',
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                    }}>
                      {attraction.category}
                    </div>
                    <div style={{
                      position: 'absolute', top: '16px', right: '16px',
                      background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)',
                      borderRadius: '100px', padding: '4px 10px',
                      display: 'flex', alignItems: 'center', gap: '4px',
                      fontSize: '13px', fontWeight: '600', color: 'white',
                    }}>
                      <Star size={13} fill="white" color="white" />
                      {attraction.rating}
                    </div>
                  </div>

                  <div style={{ padding: '28px' }}>
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', fontWeight: '700', color: 'var(--color-dark)', marginBottom: '10px' }}>
                      {attraction.name}
                    </h2>
                    <p style={{ fontSize: '14px', color: 'rgba(26, 18, 9, 0.65)', lineHeight: '1.65', marginBottom: '20px' }}>
                      {attraction.description}
                    </p>

                    {/* Metadata row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                      {[
                        { icon: MapPin, label: 'Address', value: attraction.address },
                        { icon: Clock, label: 'Hours', value: attraction.openHours },
                        { icon: Ticket, label: 'Entry', value: attraction.entryFee },
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label} style={{
                          background: 'var(--color-cream)', borderRadius: '12px', padding: '12px 10px',
                          display: 'flex', flexDirection: 'column', gap: '4px',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Icon size={11} color="var(--color-red)" />
                            <span style={{ fontSize: '10px', fontWeight: '600', color: 'var(--color-red)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
                          </div>
                          <span style={{ fontSize: '11px', color: 'var(--color-dark)', fontWeight: '500', lineHeight: '1.4' }}>{value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Highlights */}
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-dark)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Highlights
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {attraction.highlights.map(h => (
                          <span key={h} style={{
                            padding: '5px 12px', borderRadius: '100px',
                            fontSize: '12px', fontWeight: '500',
                            background: colors.bg, color: colors.text,
                            border: `1px solid ${colors.border}`,
                          }}>
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Tips */}
                    <div style={{
                      background: 'rgba(212, 160, 23, 0.06)',
                      border: '1px solid rgba(212, 160, 23, 0.15)',
                      borderRadius: '12px', padding: '16px',
                    }}>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#9A7010', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        💡 Visitor Tips
                      </div>
                      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {attraction.tips.map(tip => (
                          <li key={tip} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '13px', color: 'rgba(26, 18, 9, 0.7)' }}>
                            <ChevronRight size={14} color="#D4A017" style={{ marginTop: '2px', flexShrink: 0 }} />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
