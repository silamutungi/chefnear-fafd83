import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export default function Signup() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    })
    setLoading(false)
    if (authError) {
      setError('Something went wrong. Please try again or use a different email.')
      return
    }
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <p className="text-muted-foreground text-sm mt-1">Book local chefs for your next dinner.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" type="text" autoComplete="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1" placeholder="Jane Smith" />
            </div>
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1" placeholder="you@example.com" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1" placeholder="Min. 8 characters" />
            </div>
            {error && (
              <div role="alert" aria-live="polite" className="text-destructive text-sm">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
