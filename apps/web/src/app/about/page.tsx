import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { neighborhoods } from '@/data'

export const metadata: Metadata = {
  title: 'About Iloilo — Iloilo Explorer',
  description: 'Discover the history, culture, and character of Iloilo City — the Heart of the Philippines.',
}

const timeline = [
  {
    year: '1566',
    title: 'Spanish Colonization',
    desc: 'Spanish conquistadors arrive in Iloilo, establishing settlements and beginning the colonial era that would shape the city\'s architecture and culture.',
  },
  {
    year: '1855',
    title: 'Port Opens to World Trade',
    desc: 'Iloilo becomes the first port in the Philippines opened to international trade, transforming it into the country\'s second-most important city after Manila.',
  },
  {
    year: '1899',
    title: 'First Philippine Republic Capital',
    desc: 'Iloilo briefly becomes the capital of the First Philippine Republic after Emilio Aguinaldo flees from Manila.',
  },
  {
    year: '1937',
    title: 'Birth of Batchoy',
    desc: 'Federico Guillergan Sr. invents La Paz Batchoy at La Paz Market, creating Iloilo\'s most iconic culinary contribution.',
  },
  {
    year: '1993',
    title: 'UNESCO Heritage Recognition',
    desc: 'The Baroque churches of the Philippines, including Miag-ao Church in Iloilo, are inscribed as UNESCO World Heritage Sites.',
  },
  {
    year: '2011',
    title: 'Most Competitive City',
    desc: 'Iloilo City is recognized as the Most Competitive City in the Philippines, beginning a decade of rapid urban development.',
  },
  {
    year: '2024',
    title: 'Top Tourism Destination',
    desc: 'Iloilo consistently ranks among the Philippines\' top tourist destinations, beloved for heritage, food, and the legendary Dinagyang Festival.',
  },
]

const festivals = [
  {
    name: 'Dinagyang Festival',
    month: 'January',
    description: 'Iloilo\'s premier cultural festival — a riot of drums, elaborate tribal costumes, and passionate street dancing honoring the Santo Niño. Considered one of Asia\'s best festivals.',
    emoji: '🥁',
  },
  {
    name: 'Paraw Regatta',
    month: 'February',
    description: 'An international sailing festival where traditional double outrigger sailboats (paraos) race across Iloilo Strait in a spectacle of traditional seamanship.',
    emoji: '⛵',
  },
  {
    name: 'Iloilo City Fiesta',
    month: 'June',
    description: 'The city\'s founding anniversary celebration, marked by cultural shows, food festivals, historical reenactments, and community celebrations across all districts.',
    emoji: '🎊',
  },
  {
    name: 'Guimaras Manggahan Festival',
    month: 'May',
    description: 'A tribute to the world-famous Guimaras mangoes — featuring mango-eating contests, cultural shows, and the crowning of a Mango Queen.',
    emoji: '🥭',
  },
]

export default function AboutPage() {
  return (
    <div style={{ paddingTop: '72px' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(160deg, #1A4A35 0%, #0A2A1E 100%)',
        padding: '80px 24px 100px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 60% 40%, rgba(212, 160, 23, 0.1) 0%, transparent 60%)',
        }} />
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            color: '#D4A017', fontSize: '12px', fontWeight: '600',
            letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '20px',
          }}>
            Puso sang Pilipinas
          </div>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(40px, 5vw, 72px)',
            color: 'white', fontWeight: '700',
            marginBottom: '24px', lineHeight: '1.1',
          }}>
            About Iloilo City
          </h1>
          <p style={{
            fontFamily: 'Source Serif 4, serif',
            fontSize: '20px', color: 'rgba(200, 240, 220, 0.8)',
            lineHeight: '1.7', maxWidth: '640px', marginBottom: '40px',
          }}>
            &ldquo;The Heart of the Philippines&rdquo; — a city that has held this title not just geographically, but through its warmth, culture, and indomitable spirit for over 400 years.
          </p>
          {/* Quick stats */}
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            {[
              { num: '457K+', label: 'Population' },
              { num: '78km²', label: 'Land Area' },
              { num: '1566', label: 'Founded' },
              { num: '6', label: 'Districts' },
            ].map(stat => (
              <div key={stat.label}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: '700', color: '#D4A017' }}>
                  {stat.num}
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(200, 240, 220, 0.6)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overview */}
      <section style={{ padding: '80px 24px', background: 'var(--color-cream)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '80px', alignItems: 'center' }}
            className="about-grid">
            <div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(30px, 3.5vw, 44px)', color: 'var(--color-dark)', marginBottom: '24px', lineHeight: '1.2' }}>
                A City Shaped by History, Defined by Culture
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  'Iloilo City is the regional center of Western Visayas, situated at the southeastern tip of Panay Island. Once the commercial capital of the Philippines, it rivaled Manila as the nation\'s most prosperous city during the Spanish colonial era.',
                  'The city\'s heritage is preserved in six historic districts — Jaro, Molo, Arevalo, La Paz, Mandurriao, and City Proper — each with its own character, architecture, and identity forged over centuries.',
                  'Ilonggos (the people of Iloilo) are renowned throughout the Philippines for their warmth, politeness, and articulateness. The Hiligaynon language spoken here is considered one of the Philippines\' most melodic.',
                  'Today, Iloilo seamlessly blends its colonial heritage with modern development. The Iloilo Business Park stands next to 400-year-old churches, and world-class restaurants serve alongside humble batchoy stalls.',
                ].map((para, i) => (
                  <p key={i} style={{ fontSize: '15px', color: 'rgba(26, 18, 9, 0.72)', lineHeight: '1.8', margin: 0 }}>
                    {para}
                  </p>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { emoji: '🏛️', title: 'Heritage', desc: 'UNESCO sites, baroque churches, Spanish mansions' },
                { emoji: '🍜', title: 'Cuisine', desc: 'Food capital — batchoy, kansi, pancit molo' },
                { emoji: '🥁', title: 'Festivals', desc: 'Dinagyang — Asia\'s premier cultural festival' },
                { emoji: '🎓', title: 'Education', desc: 'Home to top universities in Western Visayas' },
                { emoji: '⛵', title: 'Maritime', desc: 'Historic trading port, gateway to Guimaras' },
                { emoji: '🏗️', title: 'Progress', desc: 'Fastest-growing cities in the Philippines' },
              ].map(item => (
                <div key={item.title} style={{
                  background: 'white', borderRadius: '16px', padding: '20px',
                  boxShadow: '0 4px 16px rgba(26, 18, 9, 0.06)',
                  border: '1px solid rgba(26, 18, 9, 0.06)',
                }}>
                  <div style={{ fontSize: '28px', marginBottom: '10px' }}>{item.emoji}</div>
                  <div style={{ fontWeight: '600', fontSize: '15px', color: 'var(--color-dark)', marginBottom: '6px' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(26, 18, 9, 0.55)', lineHeight: '1.5' }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: '80px 24px', background: 'white' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 3.5vw, 44px)', color: 'var(--color-dark)', marginBottom: '12px' }}>
            Historical Timeline
          </h2>
          <p style={{ color: 'rgba(26, 18, 9, 0.6)', marginBottom: '56px', fontSize: '15px' }}>
            Over four centuries of remarkable history
          </p>
          <div style={{ position: 'relative' }}>
            {/* Timeline line */}
            <div style={{
              position: 'absolute', left: '80px', top: 0, bottom: 0,
              width: '2px',
              background: 'linear-gradient(to bottom, transparent, rgba(212, 160, 23, 0.3), rgba(212, 160, 23, 0.3), transparent)',
            }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              {timeline.map((item, i) => (
                <div key={item.year} style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
                  <div style={{
                    minWidth: '80px', textAlign: 'right',
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '18px', fontWeight: '700',
                    color: i === timeline.length - 1 ? 'var(--color-red)' : 'var(--color-gold)',
                    paddingTop: '4px',
                  }}>
                    {item.year}
                  </div>
                  <div style={{ position: 'relative' }}>
                    {/* Dot */}
                    <div style={{
                      position: 'absolute', left: '-43px', top: '8px',
                      width: '12px', height: '12px',
                      borderRadius: '50%',
                      background: i === timeline.length - 1 ? 'var(--color-red)' : '#D4A017',
                      border: '3px solid white',
                      boxShadow: '0 0 0 2px rgba(212, 160, 23, 0.3)',
                    }} />
                    <h3 style={{ fontSize: '17px', fontWeight: '600', color: 'var(--color-dark)', marginBottom: '8px' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: 'rgba(26, 18, 9, 0.65)', lineHeight: '1.65', margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Festivals */}
      <section style={{ padding: '80px 24px', background: 'var(--color-cream)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 3.5vw, 44px)', color: 'var(--color-dark)', marginBottom: '12px' }}>
            Annual Festivals
          </h2>
          <p style={{ color: 'rgba(26, 18, 9, 0.6)', marginBottom: '48px', fontSize: '15px' }}>
            Iloilo celebrates life with extraordinary passion and color.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {festivals.map(festival => (
              <div key={festival.name} className="card-hover" style={{
                background: 'white', borderRadius: '20px', padding: '32px',
                boxShadow: '0 4px 20px rgba(26, 18, 9, 0.07)',
                border: '1px solid rgba(26, 18, 9, 0.06)',
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{festival.emoji}</div>
                <div style={{
                  display: 'inline-block', padding: '4px 12px', borderRadius: '100px',
                  background: 'rgba(196, 30, 58, 0.08)', color: 'var(--color-red)',
                  fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase',
                  marginBottom: '12px',
                }}>
                  {festival.month}
                </div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', color: 'var(--color-dark)', marginBottom: '10px' }}>
                  {festival.name}
                </h3>
                <p style={{ fontSize: '14px', color: 'rgba(26, 18, 9, 0.65)', lineHeight: '1.65', margin: 0 }}>
                  {festival.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Neighborhoods */}
      <section style={{ padding: '80px 24px', background: 'var(--color-dark)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 3.5vw, 44px)', color: 'white', marginBottom: '12px' }}>
            The Districts of Iloilo
          </h2>
          <p style={{ color: 'rgba(232, 220, 200, 0.6)', marginBottom: '48px', fontSize: '15px' }}>
            Six unique neighborhoods, each with its own soul.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {neighborhoods.map(hood => (
              <div key={hood.id} className="card-hover" style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px', padding: '28px',
              }}>
                <div style={{ fontSize: '36px', marginBottom: '14px' }}>{hood.emoji}</div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', color: 'white', marginBottom: '6px' }}>
                  {hood.name}
                </h3>
                <div style={{
                  fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: hood.color, marginBottom: '12px',
                }}>
                  {hood.character}
                </div>
                <p style={{ fontSize: '13px', color: 'rgba(232, 220, 200, 0.65)', lineHeight: '1.65', margin: 0 }}>
                  {hood.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', background: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '48px', marginBottom: '24px' }}>🌺</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '40px', color: 'var(--color-dark)', marginBottom: '16px' }}>
            Start Your Iloilo Adventure
          </h2>
          <p style={{ fontFamily: 'Source Serif 4, serif', fontSize: '17px', color: 'rgba(26, 18, 9, 0.65)', lineHeight: '1.7', marginBottom: '40px' }}>
            Plan your visit with our comprehensive guides to attractions, food, and transportation.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/attractions" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'var(--color-red)', color: 'white',
              padding: '14px 28px', borderRadius: '12px',
              textDecoration: 'none', fontWeight: '600', fontSize: '14px',
            }}>
              View Attractions <ArrowRight size={16} />
            </Link>
            <Link href="/food" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'var(--color-cream)', color: 'var(--color-dark)',
              padding: '14px 28px', borderRadius: '12px',
              textDecoration: 'none', fontWeight: '600', fontSize: '14px',
              border: '1px solid rgba(26, 18, 9, 0.12)',
            }}>
              Explore Food Guide
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </div>
  )
}
