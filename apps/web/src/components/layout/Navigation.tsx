'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Compass } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/attractions', label: 'Attractions' },
  { href: '/jeepney', label: 'Jeepney Routes' },
  { href: '/food', label: 'Food Guide' },
  { href: '/about', label: 'About Iloilo' },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.3s ease',
        backgroundColor: scrolled ? 'rgba(250, 243, 224, 0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(212, 160, 23, 0.2)' : 'none',
      }}
    >
      <nav style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '40px', height: '40px',
              background: 'linear-gradient(135deg, #C41E3A, #D4A017)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Compass size={22} color="white" />
            </div>
            <span style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '20px',
              fontWeight: '700',
              color: 'var(--color-dark)',
            }}>
              Iloilo<span style={{ color: 'var(--color-red)' }}>Explorer</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul style={{ display: 'flex', alignItems: 'center', gap: '4px', listStyle: 'none', margin: 0, padding: 0 }}
            className="hidden md:flex">
            {navLinks.map(link => (
              <li key={link.href}>
                <Link href={link.href} style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                  color: pathname === link.href ? 'var(--color-red)' : 'var(--color-dark)',
                  backgroundColor: pathname === link.href ? 'rgba(196, 30, 58, 0.08)' : 'transparent',
                }}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '8px', color: 'var(--color-dark)',
            }}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div style={{
            padding: '16px 0 24px',
            borderTop: '1px solid rgba(212, 160, 23, 0.2)',
          }} className="md:hidden">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                style={{
                  display: 'block',
                  padding: '12px 8px',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: pathname === link.href ? '600' : '400',
                  color: pathname === link.href ? 'var(--color-red)' : 'var(--color-dark)',
                  borderBottom: '1px solid rgba(212, 160, 23, 0.1)',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  )
}
