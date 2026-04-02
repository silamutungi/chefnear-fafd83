import { useState, type FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star, MapPin, Clock, ChefHat, ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { formatCurrency, formatDate } from '../lib/utils'
import type { Chef } from '../types/index'

const SEED_CHEFS: Chef[] = [
  { id: '1', user_id: 'seed', name: 'Marco Bellini', bio: 'Trained in Florence, Marco brings 18 years of Tuscan kitchen mastery to your dining room. Every dish tells the story of the Italian countryside — from hand-rolled pappardelle to slow-braised wild boar ragu. Marco sources ingredients from local farmers markets and tailors every menu to the season.', specialty: 'Tuscan pasta & risotto', cuisine_types: ['Italian'], price_per_person: 95, min_guests: 2, max_guests: 12, city: 'New York', rating: 4.9, review_count: 134, years_experience: 18, is_available: true, deleted_at: null, created_at: '' },
  { id: '2', user_id: 'seed', name: 'Yuki Tanaka', bio: 'Former sous chef at a Michelin-starred Tokyo restaurant. Omakase experiences tailored to your palate.', specialty: 'Omakase & sushi', cuisine_types: ['Japanese'], price_per_person: 140, min_guests: 2, max_guests: 8, city: 'Los Angeles', rating: 4.8, review_count: 89, years_experience: 12, is_available: true, deleted_at: null, created_at: '' },
  { id: '3', user_id: 'seed', name: 'Sophie Laurent', bio: 'Classically trained in Lyon. Brings the soul of French bistro cooking to intimate dinner parties.', specialty: 'French bistro classics', cuisine_types: ['French'], price_per_person: 110, min_guests: 4, max_guests: 16, city: 'Chicago', rating: 4.7, review_count: 62, years_experience: 15, is_available: true, deleted_at: null, created_at: '' },
  { id: '4', user_id: 'seed', name: 'Carlos Reyes', bio: 'Born in Oaxaca, Carlos cooks vibrant regional Mexican cuisine using heritage recipes and local market finds.', specialty: 'Regional Mexican & mole', cuisine_types: ['Mexican'], price_per_person: 75, min_guests: 4, max_guests: 20, city: 'Austin', rating: 4.9, review_count: 201, years_experience: 10, is_available: true, deleted_at: null, created_at: '' },
  { id: '5', user_id: 'seed', name: 'Priya Nair', bio: 'Priya elevates home dining with aromatic spice blends and seasonal tasting menus rooted in South Indian tradition.', specialty: 'South Indian tasting menus', cuisine_types: ['Indian'], price_per_person: 80, min_guests: 2, max_guests: 14, city: 'San Francisco', rating: 4.8, review_count: 77, years_experience: 9, is_available: false, deleted_at: null, created_at: '' },
  { id: '6', user_id: 'seed', name: 'Nikos Papadopoulos', bio: 'A lifetime of Greek island summers informs every dish: fresh seafood, olive oil, and wood-fire technique.', specialty: 'Aegean seafood & mezze', cuisine_types: ['Mediterranean'], price_per_person: 90, min_guests: 4, max_guests: 18, city: 'Miami', rating: 4.6, review_count: 43, years_experience: 14, is_available: true, deleted_at: null, created_at: '' }
]

const SAMPLE_MENUS: Record<string, { course: string; name: string; description: string; dietary: string[] }[]> = {
  '1': [
    { course: 'Starter', name: 'Burrata with Heirloom Tomatoes', description: 'House-made burrata, slow-roasted tomatoes, basil oil', dietary: ['Vegetarian', 'Gluten-free'] },
    { course: 'Main', name: 'Pappardelle al Cinghiale', description: 'Hand-rolled pasta, wild boar ragu, aged pecorino', dietary: [] },
    { course: 'Dessert', name: 'Panna Cotta', description: 'Vanilla bean panna cotta, seasonal berry compote', dietary: ['Vegetarian', 'Gluten-free'] }
  ]
}

const SAMPLE_REVIEWS = [
  { reviewer_name: 'Sarah M.', rating: 5, comment: 'Marco turned our anniversary dinner into something we will talk about for years. Flawless.', created_at: '2024-11-15' },
  { reviewer_name: 'James T.', rating: 5, comment: 'The pasta was transcendent. Our guests were blown away. Worth every penny.', created_at: '2024-10-28' },
  { reviewer_name: 'Elena R.', rating: 5, comment: 'Accommodated two dietary restrictions without a single complaint. The food was outstanding.', created_at: '2024-10-03' }
]

export default function ChefProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [guests, setGuests] = useState('4')
  const [date, setDate] = useState('')
  const [bookingError, setBookingError] = useState('')

  const chef = SEED_CHEFS.find(c => c.id === id)

  if (!chef) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="text-5xl mb-4" aria-hidden="true">🍽️</p>
        <h1 className="text-2xl font-bold mb-2">Chef not found</h1>
        <p className="text-muted-foreground mb-6">This chef profile does not exist or has been removed.</p>
        <Button onClick={() => navigate('/browse')}>Browse all chefs</Button>
      </div>
    )
  }

  const guestCount = parseInt(guests) || 0
  const total = guestCount * chef.price_per_person

  function handleBook(e: FormEvent) {
    e.preventDefault()
    if (!chef) return
    setBookingError('')
    if (!date) { setBookingError('Please select an event date.'); return }
    if (guestCount < chef.min_guests || guestCount > chef.max_guests) {
      setBookingError(`Guest count must be between ${chef.min_guests} and ${chef.max_guests}.`)
      return
    }
    navigate('/login?redirect=/dashboard')
  }

  const menu = SAMPLE_MENUS[id ?? '1'] ?? SAMPLE_MENUS['1']

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <button onClick={() => navigate('/browse')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors min-h-[44px]" aria-label="Back to browse">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to browse
      </button>
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{chef.name}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" aria-hidden="true" />{chef.city}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden="true" />{chef.years_experience} years exp.</span>
                <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-primary text-primary" aria-hidden="true" />{chef.rating} ({chef.review_count} reviews)</span>
              </div>
            </div>
            <Badge variant={chef.is_available ? 'default' : 'secondary'} className="mt-1">{chef.is_available ? 'Available' : 'Currently booked'}</Badge>
          </div>
          <div className="flex flex-wrap gap-2 my-4">
            {chef.cuisine_types.map(ct => <Badge key={ct} variant="outline">{ct}</Badge>)}
            <Badge variant="outline"><ChefHat className="h-3 w-3 mr-1" aria-hidden="true" />{chef.specialty}</Badge>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-8">{chef.bio}</p>

          <h2 className="text-xl font-bold mb-4">Sample Menu</h2>
          <div className="space-y-4 mb-10">
            {menu.map(item => (
              <div key={item.name} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{item.name}</span>
                  <Badge variant="secondary" className="text-xs">{item.course}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                {item.dietary.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {item.dietary.map(d => <Badge key={d} variant="outline" className="text-xs">{d}</Badge>)}
                  </div>
                )}
              </div>
            ))}
          </div>

          <h2 className="text-xl font-bold mb-4">Guest Reviews</h2>
          <div className="space-y-4">
            {SAMPLE_REVIEWS.map(r => (
              <div key={r.reviewer_name} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{r.reviewer_name}</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" aria-hidden="true" />)}
                    <span className="text-xs text-muted-foreground ml-1">{formatDate(r.created_at)}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-xl">{formatCurrency(chef.price_per_person)}<span className="text-base font-normal text-muted-foreground">/person</span></CardTitle>
              <p className="text-sm text-muted-foreground">{chef.min_guests}–{chef.max_guests} guests</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBook} className="space-y-4">
                <div>
                  <Label htmlFor="event-date">Event date</Label>
                  <Input id="event-date" type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1" min={new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <Label htmlFor="guest-count">Number of guests</Label>
                  <Input id="guest-count" type="number" value={guests} onChange={e => setGuests(e.target.value)} min={chef.min_guests} max={chef.max_guests} className="mt-1" />
                </div>
                {guestCount > 0 && date && (
                  <div className="bg-secondary rounded-md p-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{formatCurrency(chef.price_per_person)} x {guestCount} guests</span>
                      <span className="font-semibold">{formatCurrency(total)}</span>
                    </div>
                  </div>
                )}
                {bookingError && (
                  <div role="alert" aria-live="polite" className="text-destructive text-sm">{bookingError}</div>
                )}
                <Button type="submit" className="w-full" disabled={!chef.is_available}>
                  {chef.is_available ? 'Request to Book' : 'Currently Unavailable'}
                </Button>
                <p className="text-xs text-muted-foreground text-center">You will not be charged until the chef confirms.</p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
