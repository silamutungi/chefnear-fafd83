import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { CalendarCheck, Clock, ChefHat, Star, Search } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { formatCurrency, formatDate } from '../lib/utils'
import type { Booking } from '../types/index'

const isSupabaseConfigured = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)

const SEED_BOOKINGS: Booking[] = [
  { id: 'b1', user_id: 'seed', chef_id: '1', event_date: '2025-02-14', guest_count: 4, total_price: 380, status: 'confirmed', notes: 'Anniversary dinner', deleted_at: null, created_at: '', chef: { id: '1', user_id: 'seed', name: 'Marco Bellini', bio: '', specialty: 'Tuscan pasta', cuisine_types: ['Italian'], price_per_person: 95, min_guests: 2, max_guests: 12, city: 'New York', rating: 4.9, review_count: 134, years_experience: 18, is_available: true, deleted_at: null, created_at: '' } },
  { id: 'b2', user_id: 'seed', chef_id: '4', event_date: '2025-03-01', guest_count: 8, total_price: 600, status: 'pending', notes: 'Birthday party', deleted_at: null, created_at: '', chef: { id: '4', user_id: 'seed', name: 'Carlos Reyes', bio: '', specialty: 'Mexican', cuisine_types: ['Mexican'], price_per_person: 75, min_guests: 4, max_guests: 20, city: 'Austin', rating: 4.9, review_count: 201, years_experience: 10, is_available: true, deleted_at: null, created_at: '' } },
  { id: 'b3', user_id: 'seed', chef_id: '3', event_date: '2025-01-20', guest_count: 6, total_price: 660, status: 'completed', notes: '', deleted_at: null, created_at: '', chef: { id: '3', user_id: 'seed', name: 'Sophie Laurent', bio: '', specialty: 'French bistro', cuisine_types: ['French'], price_per_person: 110, min_guests: 4, max_guests: 16, city: 'Chicago', rating: 4.7, review_count: 62, years_experience: 15, is_available: true, deleted_at: null, created_at: '' } }
]

const STATUS_COLORS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'secondary',
  confirmed: 'default',
  completed: 'outline',
  cancelled: 'destructive'
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState<Booking[]>(isSupabaseConfigured ? [] : SEED_BOOKINGS)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState('')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    if (!isSupabaseConfigured) return
    async function load() {
      setLoading(true)
      setError('')
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) setUserEmail(user.email)
      const { data, error: dbError } = await supabase
        .from('bookings')
        .select('*, chef:chefs(*)')
        .is('deleted_at', null)
        .order('event_date', { ascending: true })
      setLoading(false)
      if (dbError) { setError('Could not load your bookings. Please refresh.'); return }
      setBookings(data ?? [])
    }
    load()
  }, [])

  const upcoming = bookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled')
  const past = bookings.filter(b => b.status === 'completed')

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {!isSupabaseConfigured && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm px-4 py-3 rounded-md mb-6">
          Viewing sample data — connect your database to go live.
        </div>
      )}
      <div className="mb-10">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        {userEmail && <p className="text-muted-foreground mt-1">{userEmail}</p>}
      </div>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />)}
        </div>
      )}

      {error && (
        <div role="alert" className="text-destructive text-sm border border-destructive/30 rounded-md p-4 mb-6">
          {error}
          <Button variant="outline" size="sm" className="ml-4" onClick={() => window.location.reload()}>Retry</Button>
        </div>
      )}

      {!loading && !error && (
        <>
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-primary" aria-hidden="true" />
              Upcoming Events
            </h2>
            {upcoming.length === 0 ? (
              <div className="text-center py-16 border border-border rounded-lg">
                <ChefHat className="h-10 w-10 text-muted-foreground mx-auto mb-3" aria-hidden="true" />
                <p className="font-medium mb-2">No upcoming bookings</p>
                <p className="text-muted-foreground text-sm mb-6">Find your next chef and book an unforgettable dinner.</p>
                <Button onClick={() => navigate('/browse')}>
                  <Search className="h-4 w-4 mr-2" aria-hidden="true" />
                  Browse chefs
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcoming.map(b => (
                  <Card key={b.id}>
                    <CardContent className="p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">{b.chef?.name ?? 'Chef'}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden="true" />{formatDate(b.event_date)}</span>
                            <span>{b.guest_count} guests</span>
                          </div>
                          {b.notes && <p className="text-sm text-muted-foreground mt-1">{b.notes}</p>}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold">{formatCurrency(b.total_price)}</span>
                          <Badge variant={STATUS_COLORS[b.status] ?? 'secondary'}>{b.status}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {past.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" aria-hidden="true" />
                Past Events
              </h2>
              <div className="space-y-4">
                {past.map(b => (
                  <Card key={b.id} className="opacity-75">
                    <CardContent className="p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">{b.chef?.name ?? 'Chef'}</p>
                          <p className="text-sm text-muted-foreground mt-1">{formatDate(b.event_date)} — {b.guest_count} guests</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold">{formatCurrency(b.total_price)}</span>
                          <Badge variant="outline">Completed</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <Card className="mt-12">
        <CardHeader>
          <CardTitle className="text-base">Are you a chef?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">List your services and start accepting bookings from local clients.</p>
          <Button variant="outline" size="sm">Apply to join as a chef</Button>
        </CardContent>
      </Card>
    </div>
  )
}
