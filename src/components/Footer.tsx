import { Link } from 'react-router-dom'
import { ChefHat } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-background border-t border-border" role="contentinfo">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-foreground mb-2">
              <ChefHat className="h-4 w-4 text-primary" aria-hidden="true" />
              ChefNear
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">Book a professional local chef for a private dining experience at home.</p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <Link to="/browse" className="hover:text-foreground transition-colors">Browse Chefs</Link>
            <Link to="/signup" className="hover:text-foreground transition-colors">Become a Chef</Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border text-xs text-muted-foreground">
          &copy; {year} ChefNear. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
