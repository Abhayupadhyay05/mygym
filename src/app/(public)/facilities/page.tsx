import { Metadata } from 'next'
import FacilitiesClient from './FacilitiesClient'

export const metadata: Metadata = {
  title: 'Facilities',
  description: 'Explore Premium Fitness Gym facilities - premium equipment, dedicated training zones, recovery areas, and modern amenities.',
}

export default function FacilitiesPage() {
  return <FacilitiesClient />
}
