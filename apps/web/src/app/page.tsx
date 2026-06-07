import Link from 'next/link'
import { MapPin, Utensils, Bus, Star, ArrowRight, Wind, Anchor } from 'lucide-react'
import { attractions, foodItems, neighborhoods } from '@/data'

export default function HomePage() {
  const featuredAttractions = attractions.slice(0, 4)
  const featuredFood = foodItems.filter(f => f.mustTry).slice(0, 4)

  return (
    <div style={{ paddingTop: '72px' }}>
      {/* HERO */}
      <section style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #FAF3E0 0%, #F5E6C8 40%, #FAF3E0 100%)',
        display: 'flex',
        alignItems: 'center',
      }}>
        {/* Background decorative elements */}
        <div style={{
          position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
        }}>
          <div style={{
            position: 'absolute', top: '10%', right: '5%', width: '600px', height: '600px',
            background: 'radial-gradient(circle, rgba(196, 30, 58, 0.06) 0%, transparent 70%)',
            borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute', bottom: '10%', left: '5%', width: '500px', height: '500px',
            background: 'radial-gradient(circle, rgba(212, 160, 23, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            width: '800px', height: '800px',
            background: 'radial-gradient(circle, rgba(27, 79, 138, 0.03) 0%, transparent 70%)',
            borderRadius: '50%',
          }} />
          {/* Decorative pattern */}
          <svg style={{ position: 'absolute', top: 0, right: 0, opacity: 0.04 }} width="400" height="400" viewBox="0 0 400 400">
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#C41E3A" strokeWidth="1"/>
            </pattern>
            <rect width="400" height="400" fill="url(#grid)" />
          </svg>
        </div>

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 24px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}
            className="grid-hero">
            {/* Left — text */}
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(196, 30, 58, 0.08)',
                border: '1px solid rgba(196, 30, 58, 0.2)',
                borderRadius: '100px',
                padding: '6px 16px',
                marginBottom: '32px',
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--color-red)',
              }}>
                <MapPin size={13} />
                Iloilo City, Western Visayas
              </div>
              <h1 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(48px, 6vw, 88px)',
                fontWeight: '700',
                lineHeight: '1.05',
                color: 'var(--color-dark)',
                marginBottom: '28px',
              }}>
                Discover the{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #C41E3A, #D4A017)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Heart
                </span>
                {' '}of the Philippines
              </h1>
              <p style={{
                fontFamily: 'Source Serif 4, serif',
                fontSize: '20px',
                lineHeight: '1.7',
                color: 'rgba(26, 18, 9, 0.65)',
                marginBottom: '48px',
                maxWidth: '520px',
              }}>
                From the UNESCO-listed Miag-ao Church to the steaming bowls of La Paz Batchoy — Iloilo is the Philippines&apos; most underrated gem.
              </p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <Link href="/attractions" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'var(--color-red)',
                  color: 'white',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '15px',
                  transition: 'all 0.2s',
                  boxShadow: '0 8px 24px rgba(196, 30, 58, 0.25)',
                }}>
                  Explore Attractions
                  <ArrowRight size={18} />
                </Link>
                <Link href="/food" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'white',
                  color: 'var(--color-dark)',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '15px',
                  border: '1px solid rgba(26, 18, 9, 0.12)',
                  transition: 'all 0.2s',
                }}>
                  Food Guide
                </Link>
              </div>
            </div>

            {/* Right — stats cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { emoji: '🏛️', number: '8+', label: 'Heritage Sites', color: '#C41E3A' },
                { emoji: '🍜', number: '50+', label: 'Local Dishes', color: '#D4A017' },
                { emoji: '🚌', number: '20+', label: 'Jeepney Routes', color: '#1B4F8A' },
                { emoji: '🥭', number: '#1', label: 'Sweetest Mangoes', color: '#2D6A4F' },
              ].map((stat, i) => (
                <div key={i} className="card-hover" style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '28px 24px',
                  boxShadow: '0 4px 20px rgba(26, 18, 9, 0.07)',
                  border: '1px solid rgba(26, 18, 9, 0.06)',
                  animationDelay: `${i * 0.1}s`,
                }}>
                  <div style={{ fontSize: '36px', marginBottom: '12px' }}>{stat.emoji}</div>
                  <div style={{
                    fontSize: '36px', fontWeight: '700',
                    fontFamily: 'Playfair Display, serif',
                    color: stat.color, lineHeight: 1,
                    marginBottom: '6px',
                  }}>{stat.number}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(26, 18, 9, 0.55)', fontWeight: '500' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '80px' }}>
            <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,40 1440,40 L1440,80 L0,80 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* QUICK NAV */}
      <section style={{ background: 'white', padding: '0 24px 64px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {[
              { href: '/attractions', icon: MapPin, title: 'Attractions', desc: 'Heritage sites & beaches', color: '#C41E3A', bg: 'rgba(196, 30, 58, 0.06)' },
              { href: '/jeepney', icon: Bus, title: 'Jeepney Routes', desc: 'Navigate the city', color: '#1B4F8A', bg: 'rgba(27, 79, 138, 0.06)' },
              { href: '/food', icon: Utensils, title: 'Food Guide', desc: 'Must-try Ilonggo dishes', color: '#D4A017', bg: 'rgba(212, 160, 23, 0.06)' },
              { href: '/about', icon: Wind, title: 'About Iloilo', desc: 'History & culture', color: '#2D6A4F', bg: 'rgba(45, 106, 79, 0.06)' },
            ].map(item => (
              <Link key={item.href} href={item.href} className="card-hover" style={{
                display: 'block',
                padding: '28px 24px',
                background: item.bg,
                borderRadius: '16px',
                border: `1px solid ${item.color}20`,
                textDecoration: 'none',
              }}>
                <item.icon size={28} color={item.color} style={{ marginBottom: '14px' }} />
                <div style={{ fontWeight: '600', fontSize: '16px', color: 'var(--color-dark)', marginBottom: '4px' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(26, 18, 9, 0.55)' }}>{item.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED ATTRACTIONS */}
      <section style={{ padding: '80px 24px', background: 'var(--color-cream)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '0.12em', color: 'var(--color-red)', textTransform: 'uppercase', marginBottom: '12px' }}>
                Top Destinations
              </div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: '700', color: 'var(--color-dark)', margin: 0 }}>
                Iconic Iloilo Attractions
              </h2>
            </div>
            <Link href="/attractions" style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              color: 'var(--color-red)', textDecoration: 'none',
              fontWeight: '600', fontSize: '14px',
            }}>
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {featuredAttractions.map(attraction => (
              <Link key={attraction.id} href={`/attractions#${attraction.id}`} className="card-hover" style={{
                background: 'white', borderRadius: '20px', overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(26, 18, 9, 0.07)',
                border: '1px solid rgba(26, 18, 9, 0.06)',
                textDecoration: 'none', color: 'inherit', display: 'block',
              }}>
                <div style={{
                  height: '160px',
                  background: `linear-gradient(135deg, 
                    ${attraction.category === 'religious' ? '#1B4F8A, #2D6A8A' : 
                      attraction.category === 'heritage' ? '#C41E3A, #8B1A1A' :
                      attraction.category === 'museum' ? '#6B4423, #8B5A2B' :
                      '#2D6A4F, #1A4A35'}
                  )`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '64px',
                }} aria-hidden>
                  {attraction.emoji}
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{
                    display: 'inline-block',
                    fontSize: '11px', fontWeight: '600',
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: 'var(--color-red)',
                    background: 'rgba(196, 30, 58, 0.08)',
                    padding: '4px 10px', borderRadius: '100px',
                    marginBottom: '10px',
                  }}>
                    {attraction.category}
                  </div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: 'var(--color-dark)' }}>
                    {attraction.name}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'rgba(26, 18, 9, 0.6)', lineHeight: '1.6', marginBottom: '16px' }}>
                    {attraction.description.slice(0, 100)}...
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={14} color="#D4A017" fill="#D4A017" />
                      <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-dark)' }}>{attraction.rating}</span>
                    </div>
                    <span style={{ fontSize: '13px', color: 'rgba(26, 18, 9, 0.5)' }}>{attraction.entryFee}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FOOD SPOTLIGHT */}
      <section style={{ padding: '80px 24px', background: 'var(--color-dark)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '0.12em', color: '#D4A017', textTransform: 'uppercase', marginBottom: '12px' }}>
                Ilonggo Cuisine
              </div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: '700', color: 'white', margin: 0 }}>
                Must-Try Local Dishes
              </h2>
            </div>
            <Link href="/food" style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              color: '#D4A017', textDecoration: 'none',
              fontWeight: '600', fontSize: '14px',
            }}>
              Full Food Guide <ArrowRight size={16} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {featuredFood.map(food => (
              <div key={food.id} className="card-hover" style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(212, 160, 23, 0.15)',
                borderRadius: '20px', padding: '28px',
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{food.emoji}</div>
                <div style={{
                  display: 'inline-block',
                  fontSize: '11px', fontWeight: '600',
                  background: 'rgba(212, 160, 23, 0.15)',
                  color: '#D4A017',
                  padding: '4px 10px', borderRadius: '100px',
                  marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.08em',
                }}>
                  Must Try
                </div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', color: 'white', marginBottom: '10px' }}>
                  {food.name}
                </h3>
                <p style={{ fontSize: '13px', color: 'rgba(232, 220, 200, 0.65)', lineHeight: '1.6', marginBottom: '16px' }}>
                  {food.description.slice(0, 110)}...
                </p>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#D4A017' }}>
                  {food.priceRange}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEIGHBORHOODS */}
      <section style={{ padding: '80px 24px', background: 'white' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '0.12em', color: 'var(--color-red)', textTransform: 'uppercase', marginBottom: '12px' }}>
              Districts of Iloilo
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: '700', color: 'var(--color-dark)', margin: 0 }}>
              Explore the Neighborhoods
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {neighborhoods.map(hood => (
              <div key={hood.id} className="card-hover" style={{
                background: 'var(--color-cream)',
                borderRadius: '16px', padding: '24px',
                border: '1px solid rgba(26, 18, 9, 0.06)',
                cursor: 'pointer',
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{hood.emoji}</div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: 'var(--color-dark)', marginBottom: '6px' }}>
                  {hood.name}
                </h3>
                <div style={{
                  fontSize: '11px', fontWeight: '600', letterSpacing: '0.06em',
                  color: hood.color, textTransform: 'uppercase', marginBottom: '10px',
                }}>
                  {hood.character}
                </div>
                <p style={{ fontSize: '13px', color: 'rgba(26, 18, 9, 0.6)', lineHeight: '1.6', margin: 0 }}>
                  {hood.description.slice(0, 80)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(135deg, var(--color-red), #8B1A1A)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ fontSize: '48px', marginBottom: '24px' }}>
            <Anchor size={48} color="rgba(255,255,255,0.4)" style={{ display: 'inline-block' }} />
          </div>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(32px, 4vw, 52px)',
            color: 'white', fontWeight: '700',
            marginBottom: '20px', lineHeight: '1.2',
          }}>
            Ready to Explore Iloilo?
          </h2>
          <p style={{
            fontFamily: 'Source Serif 4, serif',
            fontSize: '18px', color: 'rgba(255,255,255,0.8)',
            lineHeight: '1.7', marginBottom: '40px',
          }}>
            Plan your jeepney routes, discover hidden food gems, and uncover Iloilo&apos;s rich heritage — all in one place.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/jeepney" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'white', color: 'var(--color-red)',
              padding: '16px 32px', borderRadius: '12px',
              textDecoration: 'none', fontWeight: '700', fontSize: '15px',
            }}>
              <Bus size={18} />
              Plan My Route
            </Link>
            <Link href="/food" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,255,255,0.15)', color: 'white',
              padding: '16px 32px', borderRadius: '12px',
              textDecoration: 'none', fontWeight: '600', fontSize: '15px',
              border: '1px solid rgba(255,255,255,0.3)',
            }}>
              <Utensils size={18} />
              Food Guide
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .grid-hero { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </div>
  )
}
