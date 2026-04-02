import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Menu, X, ChefHat } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '../lib/utils'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [open, setOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Close drawer on route change
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  // Close on outside click/tap
  useEffect(() => {
    if (!open) return
    function handleOutside(e: MouseEvent | TouchEvent) {
      const target = e.target as Node
      if (
        drawerRef.current &&
        !drawerRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
    }
  }, [open])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  async function handleLogout() {
    await supabase.auth.signOut()
    setOpen(false)
    navigate('/')
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      <nav
        className="sticky top-0 z-50 bg-background border-b border-border"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded-sm"
          >
            <ChefHat className="h-5 w-5 text-primary" aria-hidden="true" />
            ChefNear
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/browse"
              className={cn(
                'text-sm transition-colors',
                isActive('/browse')
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Browse Chefs
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={cn(
                    'text-sm transition-colors',
                    isActive('/dashboard')
                      ? 'text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  My Bookings
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>Sign out</Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={cn(
                    'text-sm transition-colors',
                    isActive('/login')
                      ? 'text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  Sign in
                </Link>
                <Button size="sm" asChild>
                  <Link to="/signup">Book a Chef</Link>
                </Button>
              </>
            )}
          </div>

          {/* Hamburger trigger — mobile only */}
          <button
            ref={triggerRef}
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md text-foreground hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            onClick={() => setOpen(prev => !prev)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-drawer"
          >
            {open
              ? <X className="h-5 w-5" aria-hidden="true" />
              : (
                <span className="flex flex-col gap-[5px] w-5" aria-hidden="true">
                  <span className="block h-[2px] w-full bg-current rounded-full" />
                  <span className="block h-[2px] w-full bg-current rounded-full" />
                  <span className="block h-[2px] w-full bg-current rounded-full" />
                </span>
              )
            }
          </button>
        </div>
      </nav>

      {/* Mobile drawer backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        aria-hidden="true"
      />

      {/* Mobile slide-in drawer */}
      <div
        id="mobile-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-72 max-w-[85vw] bg-card border-l border-border shadow-2xl',
          'flex flex-col',
          'transition-transform duration-300 ease-in-out md:hidden',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-border flex-shrink-0">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded-sm"
            onClick={() => setOpen(false)}
          >
            <ChefHat className="h-4 w-4 text-primary" aria-hidden="true" />
            ChefNear
          </Link>
          <button
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Drawer links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          <DrawerLink
            to="/browse"
            active={isActive('/browse')}
            onClick={() => setOpen(false)}
          >
            Browse Chefs
          </DrawerLink>

          {user ? (
            <>
              <DrawerLink
                to="/dashboard"
                active={isActive('/dashboard')}
                onClick={() => setOpen(false)}
              >
                My Bookings
              </DrawerLink>
            </>
          ) : (
            <>
              <DrawerLink
                to="/login"
                active={isActive('/login')}
                onClick={() => setOpen(false)}
              >
                Sign in
              </DrawerLink>
            </>
          )}
        </nav>

        {/* Drawer footer CTA */}
        <div className="flex-shrink-0 px-4 py-6 border-t border-border space-y-3">
          {user ? (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleLogout}
            >
              Sign out
            </Button>
          ) : (
            <Button size="sm" className="w-full" asChild>
              <Link to="/signup" onClick={() => setOpen(false)}>Book a Chef</Link>
            </Button>
          )}
        </div>
      </div>
    </>
  )
}

function DrawerLink({
  to,
  active,
  onClick,
  children,
}: {
  to: string
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        'flex items-center px-3 py-3 rounded-md text-sm font-medium transition-colors min-h-[44px]',
        active
          ? 'bg-primary/10 text-primary'
          : 'text-foreground hover:bg-accent hover:text-accent-foreground'
      )}
    >
      {children}
    </Link>
  )
}
