import HeroSection from '@/components/landing/HeroSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import TrackPreviewSection from '@/components/landing/TrackPreviewSection'
import ManifestoSection from '@/components/landing/ManifestoSection'
import CtaSection from '@/components/landing/CtaSection'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <HowItWorksSection />
      <TrackPreviewSection />
      <ManifestoSection />
      <CtaSection />
    </main>
  )
}
