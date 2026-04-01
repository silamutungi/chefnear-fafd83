import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Menu, X, ChefHat } from 'lucide-react'
import { Button } from './ui/button'

export default function Navbar() {
  const navigate = useNavigate()
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border" role="navigation" aria-label="Main navigation">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded-sm">
          <ChefHat className="h-5 w-5 text-primary" aria-hidden="true" />
          ChefNear
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link to="/browse" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Browse Chefs</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">My Bookings</Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>Sign out</Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign in</Link>
              <Button size="sm" asChild><Link to="/signup">Book a Chef</Link></Button>
            </>
          )}
        </div>
        <button className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background px-6 py-4 space-y-3">
          <Link to="/browse" className="block text-sm py-2" onClick={() => setOpen(false)}>Browse Chefs</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="block text-sm py-2" onClick={() => setOpen(false)}>My Bookings</Link>
              <Button variant="outline" size="sm" className="w-full" onClick={() => { handleLogout(); setOpen(false) }}>Sign out</Button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-sm py-2" onClick={() => setOpen(false)}>Sign in</Link>
              <Button size="sm" className="w-full" asChild><Link to="/signup" onClick={() => setOpen(false)}>Book a Chef</Link></Button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
