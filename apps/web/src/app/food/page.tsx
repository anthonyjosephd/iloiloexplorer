import type { Metadata } from 'next'
import { Utensils, MapPin, Star } from 'lucide-react'
import { foodItems, type FoodItem } from '@/data'

export const metadata: Metadata = {
  title: 'Food Guide — Iloilo Explorer',
  description: 'Discover the best of Ilonggo cuisine — from La Paz Batchoy to Pancit Molo and fresh Guimaras mangoes.',
}

const categoryColors: Record<FoodItem['category'], { bg: string; text: string }> = {
  main: { bg: 'rgba(196, 30, 58, 0.08)', text: '#C41E3A' },
  kakanin: { bg: 'rgba(212, 160, 23, 0.1)', text: '#9A7010' },
  street: { bg: 'rgba(107, 68, 35, 0.08)', text: '#6B4423' },
  seafood: { bg: 'rgba(27, 79, 138, 0.08)', text: '#1B4F8A' },
  dessert: { bg: 'rgba(139, 26, 26, 0.08)', text: '#8B1A1A' },
  drink: { bg: 'rgba(45, 106, 79, 0.08)', text: '#2D6A4F' },
}

const categoryLabels: Record<FoodItem['category'], string> = {
  main: 'Main Dish',
  kakanin: 'Kakanin (Sweets)',
  street: 'Street Food',
  seafood: 'Seafood',
  dessert: 'Dessert',
  drink: 'Drinks',
}

export default function FoodPage() {
  const mustTry = foodItems.filter(f => f.mustTry)
  const others = foodItems.filter(f => !f.mustTry)

  return (
    <div style={{ paddingTop: '72px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(160deg, #3D1C02, #6B4423)',
        padding: '80px 24px 100px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 70% 30%, rgba(212, 160, 23, 0.15) 0%, transparent 60%)',
        }} />
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            color: '#D4A017', fontSize: '12px', fontWeight: '600',
            letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '20px',
          }}>
            <Utensils size={12} /> Ilonggo Cuisine
          </div>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(40px, 5vw, 72px)',
            color: 'white', fontWeight: '700',
            marginBottom: '20px', lineHeight: '1.1',
          }}>
            The Iloilo Food Guide
          </h1>
          <p style={{
            fontFamily: 'Source Serif 4, serif',
            fontSize: '18px', color: 'rgba(255, 240, 210, 0.8)',
            lineHeight: '1.7', maxWidth: '600px',
          }}>
            Iloilo is widely considered the food capital of the Philippines. From the iconic La Paz Batchoy to the sour depth of Kansi — every dish tells a story.
          </p>
        </div>
      </div>

      {/* Must Try Section */}
      <section style={{ padding: '80px 24px', background: 'var(--color-cream)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Star size={18} color="#D4A017" fill="#D4A017" />
              <div style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '0.12em', color: '#9A7010', textTransform: 'uppercase' }}>
                Essential Ilonggo Dishes
              </div>
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 3.5vw, 44px)', color: 'var(--color-dark)', margin: 0 }}>
              Must-Try Dishes
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '28px' }}>
            {mustTry.map(food => {
              const colors = categoryColors[food.category]
              return (
                <article key={food.id} className="card-hover" style={{
                  background: 'white', borderRadius: '24px', overflow: 'hidden',
                  boxShadow: '0 4px 24px rgba(26, 18, 9, 0.08)',
                  border: '2px solid rgba(212, 160, 23, 0.15)',
                }}>
                  {/* Header */}
                  <div style={{
                    background: 'linear-gradient(135deg, var(--color-dark), #2C1810)',
                    padding: '32px 28px',
                    position: 'relative',
                  }}>
                    <div style={{
                      position: 'absolute', top: '16px', right: '16px',
                      background: '#D4A017', borderRadius: '100px',
                      padding: '5px 12px', fontSize: '11px', fontWeight: '700', color: 'rgba(0,0,0,0.8)',
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                    }}>
                      ★ Must Try
                    </div>
                    <div style={{ fontSize: '64px', marginBottom: '12px' }}>{food.emoji}</div>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '26px', color: 'white', fontWeight: '700', marginBottom: '6px' }}>
                      {food.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        padding: '4px 12px', borderRadius: '100px',
                        fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em',
                        background: colors.bg, color: colors.text,
                      }}>
                        {categoryLabels[food.category]}
                      </span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#D4A017' }}>
                        {food.priceRange}
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: '28px' }}>
                    <p style={{ fontSize: '14px', color: 'rgba(26, 18, 9, 0.7)', lineHeight: '1.7', marginBottom: '20px' }}>
                      {food.description}
                    </p>

                    {/* Story */}
                    <div style={{
                      background: 'rgba(107, 68, 35, 0.06)',
                      border: '1px solid rgba(107, 68, 35, 0.12)',
                      borderRadius: '12px', padding: '16px', marginBottom: '20px',
                    }}>
                      <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--color-brown)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                        📖 The Story
                      </div>
                      <p style={{ fontSize: '13px', color: 'rgba(26, 18, 9, 0.65)', lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>
                        {food.story}
                      </p>
                    </div>

                    {/* Where to find */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: 'var(--color-dark)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                        <MapPin size={12} color="var(--color-red)" />
                        Where to Find It
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {food.whereToFind.map(place => (
                          <span key={place} style={{
                            padding: '5px 12px', borderRadius: '100px', fontSize: '12px',
                            background: 'var(--color-cream)',
                            color: 'rgba(26, 18, 9, 0.7)',
                            border: '1px solid rgba(26, 18, 9, 0.1)',
                          }}>
                            {place}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Other dishes */}
      <section style={{ padding: '64px 24px', background: 'white' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 3.5vw, 40px)', color: 'var(--color-dark)', marginBottom: '40px' }}>
            Also Worth Trying
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {others.map(food => {
              const colors = categoryColors[food.category]
              return (
                <article key={food.id} className="card-hover" style={{
                  background: 'var(--color-cream)', borderRadius: '20px',
                  padding: '28px',
                  border: '1px solid rgba(26, 18, 9, 0.07)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ fontSize: '48px' }}>{food.emoji}</div>
                    <span style={{
                      padding: '5px 12px', borderRadius: '100px',
                      fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em',
                      background: colors.bg, color: colors.text,
                    }}>
                      {categoryLabels[food.category]}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', color: 'var(--color-dark)', marginBottom: '8px' }}>
                    {food.name}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'rgba(26, 18, 9, 0.65)', lineHeight: '1.65', marginBottom: '16px' }}>
                    {food.description.slice(0, 120)}...
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-red)' }}>
                      {food.priceRange}
                    </span>
                    <span style={{ fontSize: '12px', color: 'rgba(26, 18, 9, 0.45)' }}>
                      {food.whereToFind[0]}
                    </span>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Food Culture Banner */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(135deg, #D4A017, #B8860B)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🥘</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '40px', color: 'white', marginBottom: '16px' }}>
            Food Capital of the Philippines
          </h2>
          <p style={{
            fontFamily: 'Source Serif 4, serif',
            fontSize: '18px', color: 'rgba(0,0,0,0.75)',
            lineHeight: '1.7', marginBottom: '32px',
          }}>
            Iloilo&apos;s cuisine reflects its diverse heritage — Spanish colonial influence, Chinese trading post culture, and indigenous Visayan traditions — all simmered together over centuries.
          </p>
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { num: '50+', label: 'Local Dishes' },
              { num: '1930s', label: 'Batchoy Origins' },
              { num: '5+', label: 'UNESCO Heritage Links' },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', fontWeight: '700', color: 'white' }}>{stat.num}</div>
                <div style={{ fontSize: '13px', color: 'rgba(0,0,0,0.6)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
