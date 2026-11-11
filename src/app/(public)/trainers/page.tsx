import type { Metadata } from 'next'
import TrainersClient from './PageClient'

export const metadata: Metadata = {
  title: 'Our Trainers',
  description:
    'Meet the trainers and coaching specialists at Premium Fitness Gym.',
}

export default function TrainersPage() {
  return <TrainersClient />
}
