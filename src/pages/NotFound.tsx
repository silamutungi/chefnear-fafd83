import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-background">
      <p className="text-6xl mb-6" aria-hidden="true">🍽️</p>
      <h1 className="text-4xl font-bold mb-3">Page not found</h1>
      <p className="text-muted-foreground mb-8 max-w-sm leading-relaxed">The page you are looking for does not exist. Perhaps you were searching for a chef?</p>
      <Button onClick={() => navigate('/')} className="min-w-[160px]">Back to home</Button>
    </div>
  )
}
