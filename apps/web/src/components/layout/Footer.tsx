import Link from 'next/link'
import { Compass, MapPin, Mail, Phone } from 'lucide-react'

export function Footer() {
  return (
    <footer style={{
      background: 'var(--color-dark)',
      color: 'var(--color-sand)',
      paddingTop: '64px',
      paddingBottom: '32px',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '48px',
          marginBottom: '48px',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '40px', height: '40px',
                background: 'linear-gradient(135deg, #C41E3A, #D4A017)',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Compass size={22} color="white" />
              </div>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: '700', color: 'white' }}>
                Iloilo<span style={{ color: '#D4A017' }}>Explorer</span>
              </span>
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: 'rgba(232, 220, 200, 0.7)', maxWidth: '280px' }}>
              Your comprehensive guide to discovering the Heart of the Philippines — rich in culture, heritage, and flavor.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', color: '#D4A017', marginBottom: '20px' }}>
              Explore
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { href: '/attractions', label: 'Tourist Attractions' },
                { href: '/jeepney', label: 'Jeepney Routes' },
                { href: '/food', label: 'Food Guide' },
                { href: '/about', label: 'About Iloilo' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} style={{
                    color: 'rgba(232, 220, 200, 0.7)',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'color 0.2s',
                  }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', color: '#D4A017', marginBottom: '20px' }}>
              Contact
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: MapPin, text: 'Iloilo City, Philippines' },
                { icon: Mail, text: 'hello@iloiloexplorer.ph' },
                { icon: Phone, text: '+63 33 123 4567' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={16} color="#D4A017" />
                  <span style={{ fontSize: '14px', color: 'rgba(232, 220, 200, 0.7)' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Festival Info */}
          <div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', color: '#D4A017', marginBottom: '20px' }}>
              Upcoming
            </h3>
            <div style={{
              background: 'rgba(212, 160, 23, 0.1)',
              border: '1px solid rgba(212, 160, 23, 0.2)',
              borderRadius: '12px',
              padding: '16px',
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🥁</div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'white', marginBottom: '4px' }}>
                Dinagyang Festival 2026
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(232, 220, 200, 0.6)' }}>
                January 24–25, 2026 • Iloilo City
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr style={{ border: 'none', borderTop: '1px solid rgba(212, 160, 23, 0.15)', marginBottom: '24px' }} />

        {/* Bottom */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <p style={{ fontSize: '13px', color: 'rgba(232, 220, 200, 0.5)', margin: 0 }}>
            © 2026 Iloilo Explorer. Made with ❤️ for Iloilo City.
          </p>
          <p style={{ fontSize: '13px', color: 'rgba(232, 220, 200, 0.5)', margin: 0 }}>
            &quot;Ang Iloilo, Puso sang Pilipinas&quot;
          </p>
        </div>
      </div>
    </footer>
  )
}
