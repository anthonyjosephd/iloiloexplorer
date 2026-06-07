import type { Metadata } from 'next'
import { Bus, MapPin, Clock, ChevronRight, AlertCircle, DollarSign } from 'lucide-react'
import { jeepneyRoutes } from '@/data'

export const metadata: Metadata = {
  title: 'Jeepney Routes — Iloilo Explorer',
  description: 'Navigate Iloilo City with our comprehensive jeepney route guide. Fares, stops, and travel tips.',
}

export default function JeepneyPage() {
  return (
    <div style={{ paddingTop: '72px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(160deg, #1B4F8A, #0D3060)',
        padding: '80px 24px 100px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 30% 50%, rgba(212, 160, 23, 0.12) 0%, transparent 60%)',
        }} />
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            color: '#D4A017', fontSize: '12px', fontWeight: '600',
            letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '20px',
          }}>
            <Bus size={12} /> Public Transit Guide
          </div>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(40px, 5vw, 72px)',
            color: 'white', fontWeight: '700',
            marginBottom: '20px', lineHeight: '1.1',
          }}>
            Jeepney Routes
          </h1>
          <p style={{
            fontFamily: 'Source Serif 4, serif',
            fontSize: '18px', color: 'rgba(200, 220, 255, 0.8)',
            lineHeight: '1.7', maxWidth: '600px',
          }}>
            The jeepney is Iloilo&apos;s lifeblood — colorful, affordable, and essential. Use this guide to navigate the city like a local.
          </p>
        </div>
      </div>

      {/* Fare info banner */}
      <div style={{
        background: '#D4A017', padding: '16px 24px',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <AlertCircle size={18} color="rgba(0,0,0,0.7)" />
          <span style={{ fontSize: '14px', fontWeight: '600', color: 'rgba(0,0,0,0.8)' }}>
            Base fare: ₱13 for first 4km | ₱1.80 per additional km | Children &amp; Senior Citizens: discounted
          </span>
        </div>
      </div>

      {/* How to Ride */}
      <section style={{ padding: '64px 24px', background: 'white' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', color: 'var(--color-dark)', marginBottom: '40px' }}>
            How to Ride a Jeepney
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {[
              { step: '1', title: 'Hail from the Right', desc: 'Stand on the right side of the road. Wave your hand as the jeepney approaches.', emoji: '👋' },
              { step: '2', title: 'State Your Stop', desc: 'Tell the driver or barker your destination. They\'ll confirm if they pass there.', emoji: '📍' },
              { step: '3', title: 'Squeeze In', desc: 'Jeepneys fill up! The driver won\'t leave until all seats are taken.', emoji: '🚌' },
              { step: '4', title: 'Pass the Fare', desc: 'Hand your coins to a fellow passenger toward the driver. They\'ll pass change back.', emoji: '💰' },
              { step: '5', title: 'Say "Para"', desc: 'Shout "Para!" (stop) or tap the ceiling when approaching your destination.', emoji: '✋' },
              { step: '6', title: 'Alight Right', desc: 'Exit through the rear. Check for traffic before stepping out.', emoji: '🏁' },
            ].map(item => (
              <div key={item.step} style={{
                background: 'var(--color-cream)',
                borderRadius: '16px', padding: '24px',
                border: '1px solid rgba(26, 18, 9, 0.06)',
              }}>
                <div style={{
                  width: '40px', height: '40px',
                  background: 'var(--color-blue)',
                  borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', fontWeight: '700', color: 'white',
                  marginBottom: '16px',
                }}>
                  {item.step}
                </div>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>{item.emoji}</div>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-dark)', marginBottom: '8px' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '13px', color: 'rgba(26, 18, 9, 0.65)', lineHeight: '1.6', margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Routes */}
      <section style={{ padding: '64px 24px', background: 'var(--color-cream)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', color: 'var(--color-dark)', marginBottom: '12px' }}>
            Main Routes
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(26, 18, 9, 0.6)', marginBottom: '40px' }}>
            {jeepneyRoutes.length} key routes covering central Iloilo City
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {jeepneyRoutes.map(route => (
              <article key={route.id} className="card-hover" style={{
                background: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(26, 18, 9, 0.07)',
                border: '1px solid rgba(26, 18, 9, 0.06)',
              }}>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {/* Route code sidebar */}
                  <div style={{
                    background: route.color,
                    padding: '32px 28px',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    minWidth: '120px',
                  }}>
                    <div style={{
                      fontSize: '32px', fontWeight: '800',
                      fontFamily: 'Playfair Display, serif',
                      color: 'white', lineHeight: 1,
                    }}>
                      {route.code}
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '6px', textAlign: 'center' }}>
                      Route
                    </div>
                  </div>

                  {/* Main content */}
                  <div style={{ flex: 1, padding: '28px', minWidth: '250px' }}>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: '700', color: 'var(--color-dark)', marginBottom: '16px' }}>
                      {route.name}
                    </h3>

                    {/* Route path */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        background: 'rgba(27, 79, 138, 0.08)', padding: '6px 12px',
                        borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: '#1B4F8A',
                      }}>
                        <MapPin size={13} />
                        {route.from}
                      </div>
                      <div style={{ color: 'rgba(26, 18, 9, 0.3)', fontSize: '20px' }}>→</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        {route.viaPoints.slice(0, 3).map((point, i) => (
                          <span key={i} style={{ fontSize: '12px', color: 'rgba(26, 18, 9, 0.5)' }}>
                            {point}{i < Math.min(route.viaPoints.length, 3) - 1 ? ' →' : ''}
                          </span>
                        ))}
                        {route.viaPoints.length > 3 && (
                          <span style={{ fontSize: '12px', color: 'rgba(26, 18, 9, 0.4)' }}>+{route.viaPoints.length - 3} more</span>
                        )}
                      </div>
                      <div style={{ color: 'rgba(26, 18, 9, 0.3)', fontSize: '20px' }}>→</div>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        background: `${route.color}15`, padding: '6px 12px',
                        borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                        color: route.color,
                      }}>
                        <MapPin size={13} />
                        {route.to}
                      </div>
                    </div>

                    {/* Meta info */}
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
                      {[
                        { icon: DollarSign, label: `₱${route.fareStart}–₱${route.fareMax}` },
                        { icon: Clock, label: route.operatingHours },
                        { icon: Bus, label: route.frequency },
                      ].map(({ icon: Icon, label }) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'rgba(26, 18, 9, 0.65)' }}>
                          <Icon size={14} color="var(--color-red)" />
                          {label}
                        </div>
                      ))}
                    </div>

                    {/* Tips */}
                    <div style={{
                      background: 'rgba(212, 160, 23, 0.06)',
                      border: '1px solid rgba(212, 160, 23, 0.15)',
                      borderRadius: '10px', padding: '14px',
                    }}>
                      <div style={{ fontSize: '11px', fontWeight: '600', color: '#9A7010', marginBottom: '8px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        Travel Tips
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {route.tips.map(tip => (
                          <div key={tip} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '12px', color: 'rgba(26, 18, 9, 0.7)' }}>
                            <ChevronRight size={12} color="#D4A017" style={{ marginTop: '3px', flexShrink: 0 }} />
                            {tip}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Etiquette section */}
      <section style={{ padding: '64px 24px', background: 'var(--color-dark)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', color: 'white', marginBottom: '12px' }}>
            Jeepney Etiquette
          </h2>
          <p style={{ color: 'rgba(232, 220, 200, 0.7)', marginBottom: '40px' }}>
            Respect local customs and make your commute pleasant for everyone.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', textAlign: 'left' }}>
            {[
              { emoji: '🤝', do: true, text: 'Pass fare forward — everyone cooperates' },
              { emoji: '💺', do: true, text: 'Scoot in to make room for others' },
              { emoji: '🗣️', do: true, text: 'Say "para" clearly when nearing your stop' },
              { emoji: '📵', do: false, text: 'Don\'t use your phone speaker in a crowded jeep' },
              { emoji: '🚫', do: false, text: 'Don\'t eat or drink messy food aboard' },
              { emoji: '👴', do: true, text: 'Give up your seat for elderly/pregnant passengers' },
            ].map(item => (
              <div key={item.text} style={{
                background: item.do ? 'rgba(45, 106, 79, 0.15)' : 'rgba(196, 30, 58, 0.12)',
                border: `1px solid ${item.do ? 'rgba(45, 106, 79, 0.2)' : 'rgba(196, 30, 58, 0.2)'}`,
                borderRadius: '12px', padding: '16px',
              }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.emoji}</div>
                <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', color: item.do ? '#4CAF80' : '#E57373' }}>
                  {item.do ? '✓ DO' : '✗ DON\'T'}
                </div>
                <p style={{ fontSize: '13px', color: 'rgba(232, 220, 200, 0.8)', margin: 0, lineHeight: '1.5' }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
