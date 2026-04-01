import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Star, ShieldCheck, Utensils, CalendarCheck } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'

const CUISINES = ['Italian', 'Japanese', 'French', 'Mexican', 'Indian', 'Mediterranean']

const FEATURES = [
  { emoji: '🍽️', title: 'Exclusive Culinary Talent', body: 'Every chef on ChefNear is vetted for professional experience, food safety certification, and guest reviews.' },
  { emoji: '✨', title: 'Personalized Dining Experiences', body: 'From romantic dinners to celebration feasts — your chef designs a menu around your tastes and dietary needs.' },
  { emoji: '📅', title: 'Simple Booking, Zero Hassle', body: 'Browse availability, confirm your date, and pay securely in minutes. Your kitchen transforms into a restaurant.' },
  { emoji: '⭐', title: 'Honest Reviews, Real Guests', body: 'Every rating comes from a verified booking. You know exactly what to expect before you open your door.' }
]

const STATS = [
  { value: '1,200+', label: 'Chefs available' },
  { value: '48,000+', label: 'Dinners served' },
  { value: '4.9', label: 'Average rating' },
  { value: '200+', label: 'Cities covered' }
]

export default function Home() {
  const [city, setCity] = useState('')
  const navigate = useNavigate()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    navigate(`/browse?city=${encodeURIComponent(city)}`)
  }

  return (
    <div>
      <section
        className="relative min-h-[100svh] flex items-end md:items-center overflow-hidden"
        style={{ backgroundImage: 'url(https://gudiuktjzynkjvtqmuvi.supabase.co/storage/v1/object/public/hero-images/45998ed9-2a94-4f23-9a4a-cd89e2b7eec8-hero.png)', backgroundSize: 'cover', backgroundPosition: 'center top' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
        <div className="relative z-10 w-full max-w-3xl mx-auto px-6 pb-16 pt-32 md:py-32">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white mb-4 md:mb-6">
            Your home.<br className="hidden sm:block" /> A chef's kitchen.
          </h1>
          <p className="text-base md:text-lg text-white/80 mb-8 max-w-lg leading-relaxed">
            Book a professional local chef for a private dining experience you will never forget.
          </p>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 pointer-events-none" />
              <Input
                type="text"
                placeholder="Your city..."
                value={city}
                onChange={e => setCity(e.target.value)}
                className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white"
                aria-label="Search by city"
              />
            </div>
            <Button type="submit" className="h-12 px-8 w-full sm:w-auto font-semibold">
              Find a Chef
            </Button>
          </form>
          <div className="flex flex-wrap gap-2 mt-6">
            {CUISINES.map(c => (
              <button
                key={c}
                onClick={() => navigate(`/browse?cuisine=${c}`)}
                className="text-xs text-white/70 border border-white/20 rounded-full px-3 py-1 hover:bg-white/10 transition-colors min-h-[32px]"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-background">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(s => (
              <div key={s.label}>
                <p className="text-3xl md:text-4xl font-bold text-primary">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-secondary">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why ChefNear?</h2>
          <p className="text-muted-foreground mb-16 max-w-xl leading-relaxed">Restaurant-quality dining, on your terms, in your space.</p>
          <div className="grid md:grid-cols-2 gap-10">
            {FEATURES.map(f => (
              <div key={f.title} className="flex gap-5 items-start">
                <span className="text-4xl flex-shrink-0" role="img" aria-hidden="true">{f.emoji}</span>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-background">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
          <p className="text-muted-foreground mb-16 max-w-xl leading-relaxed">From search to dinner in three steps.</p>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: Search, step: '1', title: 'Browse chefs near you', desc: 'Filter by cuisine, price, availability, and guest count. Read chef stories and menus.' },
              { icon: CalendarCheck, step: '2', title: 'Book a date', desc: 'Pick your date, party size, and any dietary preferences. Confirm in under 2 minutes.' },
              { icon: Utensils, step: '3', title: 'Enjoy your evening', desc: 'Your chef arrives, cooks, and cleans up. You just enjoy an extraordinary meal.' }
            ].map(item => (
              <div key={item.step} className="flex gap-5 items-start">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">{item.step}</div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-secondary">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ShieldCheck className="h-10 w-10 text-primary mx-auto mb-6" aria-hidden="true" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Vetted chefs, guaranteed quality</h2>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
            Every chef is identity-verified, food-safety certified, and reviewed by real guests. If your experience falls short of expectations, we make it right.
          </p>
          <Button size="lg" onClick={() => navigate('/browse')} className="min-w-[160px]">
            Browse Chefs
          </Button>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-background">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Are you a chef?</h2>
          <p className="text-muted-foreground mb-10 max-w-xl leading-relaxed">
            Join thousands of culinary professionals earning on their own schedule. Set your prices, choose your clients, and share your craft.
          </p>
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>Avg. $380 per event</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>You set your own hours</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>Instant payout after each event</span>
            </div>
          </div>
          <Button variant="outline" className="mt-8 min-w-[160px]" onClick={() => navigate('/signup')}>
            Apply as a Chef
          </Button>
        </div>
      </section>
    </div>
  )
}
