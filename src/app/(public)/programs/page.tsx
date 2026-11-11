import type { Metadata } from 'next'
import ProgramsClient from './PageClient'

export const metadata: Metadata = {
  title: 'Programs',
  description:
    'Explore fitness program categories at Premium Fitness Gym, including strength, cardio, yoga, and group training.',
}

export default function ProgramsPage() {
  return <ProgramsClient />
}
