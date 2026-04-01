export interface Chef {
  id: string
  user_id: string
  name: string
  bio: string
  specialty: string
  cuisine_types: string[]
  price_per_person: number
  min_guests: number
  max_guests: number
  city: string
  rating: number
  review_count: number
  years_experience: number
  is_available: boolean
  deleted_at: string | null
  created_at: string
}

export interface Booking {
  id: string
  user_id: string
  chef_id: string
  event_date: string
  guest_count: number
  total_price: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes: string
  deleted_at: string | null
  created_at: string
  chef?: Chef
}

export interface Review {
  id: string
  user_id: string
  chef_id: string
  booking_id: string
  rating: number
  comment: string
  reviewer_name: string
  deleted_at: string | null
  created_at: string
}

export interface MenuItem {
  id: string
  chef_id: string
  name: string
  description: string
  dietary_tags: string[]
  course: 'starter' | 'main' | 'dessert'
  created_at: string
}
