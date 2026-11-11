import type { Metadata } from 'next'
import GalleryClient from './PageClient'

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'Explore the spaces, equipment, programs, and community categories at Premium Fitness Gym.',
}

export default function GalleryPage() {
  return <GalleryClient />
}
