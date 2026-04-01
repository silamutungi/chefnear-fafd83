import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, SlidersHorizontal, Star } from 'lucide-react'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card, CardContent } from '../components/ui/card'
import { formatCurrency } from '../lib/utils'
import type { Chef } from '../types/index'

const isSupabaseConfigured = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)

const SEED_CHEFS: Chef[] = [
  { id: '1', user_id: 'seed', name: 'Marco Bellini', bio: 'Trained in Florence, Marco brings 18 years of Tuscan kitchen mastery to your dining room.', specialty: 'Tuscan pasta & risotto', cuisine_types: ['Italian'], price_per_person: 95, min_guests: 2, max_guests: 12, city: 'New York', rating: 4.9, review_count: 134, years_experience: 18, is_available: true, deleted_at: null, created_at: '' },
  { id: '2', user_id: 'seed', name: 'Yuki Tanaka', bio: 'Former sous chef at a Michelin-starred Tokyo restaurant. Omakase experiences tailored to your palate.', specialty: 'Omakase & sushi', cuisine_types: ['Japanese'], price_per_person: 140, min_guests: 2, max_guests: 8, city: 'Los Angeles', rating: 4.8, review_count: 89, years_experience: 12, is_available: true, deleted_at: null, created_at: '' },
  { id: '3', user_id: 'seed', name: 'Sophie Laurent', bio: 'Classically trained in Lyon. Brings the soul of French bistro cooking to intimate dinner parties.', specialty: 'French bistro classics', cuisine_types: ['French'], price_per_person: 110, min_guests: 4, max_guests: 16, city: 'Chicago', rating: 4.7, review_count: 62, years_experience: 15, is_available: true, deleted_at: null, created_at: '' },
  { id: '4', user_id: 'seed', name: 'Carlos Reyes', bio: 'Born in Oaxaca, Carlos cooks vibrant regional Mexican cuisine using heritage recipes and local market finds.', specialty: 'Regional Mexican & mole', cuisine_types: ['Mexican'], price_per_person: 75, min_guests: 4, max_guests: 20, city: 'Austin', rating: 4.9, review_count: 201, years_experience: 10, is_available: true, deleted_at: null, created_at: '' },
  { id: '5', user_id: 'seed', name: 'Priya Nair', bio: 'Priya elevates home dining with aromatic spice blends and seasonal tasting menus rooted in South Indian tradition.', specialty: 'South Indian tasting menus', cuisine_types: ['Indian'], price_per_person: 80, min_guests: 2, max_guests: 14, city: 'San Francisco', rating: 4.8, review_count: 77, years_experience: 9, is_available: false, deleted_at: null, created_at: '' },
  { id: '6', user_id: 'seed', name: 'Nikos Papadopoulos', bio: 'A lifetime of Greek island summers informs every dish: fresh seafood, olive oil, and wood-fire technique.', specialty: 'Aegean seafood & mezze', cuisine_types: ['Mediterranean'], price_per_person: 90, min_guests: 4, max_guests: 18, city: 'Miami', rating: 4.6, review_count: 43, years_experience: 14, is_available: true, deleted_at: null, created_at: '' }
]

const CUISINE_OPTIONS = ['All', 'Italian', 'Japanese', 'French', 'Mexican', 'Indian', 'Mediterranean']

export default function Browse() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('city') ?? '')
  const [cuisine, setCuisine] = useState(searchParams.get('cuisine') ?? 'All')
  const [maxPrice, setMaxPrice] = useState(200)

  const chefs = SEED_CHEFS

  const filtered = chefs.filter(c => {
    const matchCity = !query || c.city.toLowerCase().includes(query.toLowerCase()) || c.name.toLowerCase().includes(query.toLowerCase())
    const matchCuisine = cuisine === 'All' || c.cuisine_types.includes(cuisine)
    const matchPrice = c.price_per_person <= maxPrice
    return matchCity && matchCuisine && matchPrice
  })

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {!isSupabaseConfigured && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm px-4 py-3 rounded-md mb-6 flex items-center justify-between">
          <span>Viewing sample data — <a href="#setup" className="underline font-medium">connect your database</a> to go live.</span>
        </div>
      )}
      <h1 className="text-3xl font-bold mb-2">Browse Chefs</h1>
      <p className="text-muted-foreground mb-8">Find the perfect chef for your next dinner party.</p>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input placeholder="Search by city or name..." value={query} onChange={e => setQuery(e.target.value)} className="pl-9" aria-label="Search chefs" />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
          <span className="text-sm text-muted-foreground whitespace-nowrap">Max {formatCurrency(maxPrice)}/person</span>
          <input type="range" min={40} max={200} step={10} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} className="w-28" aria-label="Maximum price per person" />
        </div>
      </div>
      <div className="flex gap-2 flex-wrap mb-8">
        {CUISINE_OPTIONS.map(c => (
          <button key={c} onClick={() => setCuisine(c)} className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors min-h-[44px] ${ cuisine === c ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-foreground hover:bg-secondary' }`}>
            {c}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-4xl mb-4" aria-hidden="true">🔍</p>
          <h2 className="text-xl font-semibold mb-2">No chefs found</h2>
          <p className="text-muted-foreground mb-6">Try a different city, cuisine, or price range.</p>
          <Button onClick={() => { setQuery(''); setCuisine('All'); setMaxPrice(200) }}>Clear filters</Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(chef => (
            <Link key={chef.id} to={`/chef/${chef.id}`} className="group block focus:outline-none focus:ring-2 focus:ring-ring rounded-lg">
              <Card className="h-full hover:shadow-md transition-shadow border-border">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h2 className="font-semibold text-lg group-hover:text-primary transition-colors">{chef.name}</h2>
                      <p className="text-sm text-muted-foreground">{chef.city}</p>
                    </div>
                    <Badge variant={chef.is_available ? 'default' : 'secondary'}>{chef.is_available ? 'Available' : 'Booked'}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">{chef.bio}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {chef.cuisine_types.map(ct => <Badge key={ct} variant="outline" className="text-xs">{ct}</Badge>)}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-primary fill-primary" aria-hidden="true" />
                      <span className="font-medium">{chef.rating}</span>
                      <span className="text-muted-foreground">({chef.review_count})</span>
                    </div>
                    <span className="font-semibold">{formatCurrency(chef.price_per_person)}<span className="text-muted-foreground font-normal">/person</span></span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
