import { useCallback, useEffect, useState } from 'react'
import { MotionConfig } from 'motion/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initSmoothScroll } from './lib/motion'
import Loader from './components/Loader'
import Nav from './components/Nav'
import Cursor from './components/Cursor'
import { Toast } from './components/ui'
import Marquee from './sections/Marquee'
import Hero from './sections/Hero'
import Works from './sections/Works'
import Services from './sections/Services'
import Process from './sections/Process'
import Pricing from './sections/Pricing'
import Why from './sections/Why'
import CTA from './sections/CTA'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
import CaseStudy from './components/CaseStudy'

export default function App() {
  const [ready, setReady] = useState(false)
  const onDone = useCallback(() => setReady(true), [])
  useEffect(() => {
    initSmoothScroll()
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    const onLoad = () => ScrollTrigger.refresh()
    addEventListener('load', onLoad); return () => removeEventListener('load', onLoad)
  }, [])
  return (
    <MotionConfig reducedMotion="user">
      <Loader onDone={onDone} />
      <Cursor />
      <Nav />
      <main>
        <Hero ready={ready} />
        <Marquee />
        <Works />
        <Services />
        <Process />
        <Pricing />
        <Why />
        <CTA />
        <Contact />
      </main>
      <Footer />
      <CaseStudy />
      <Toast />
      <div aria-hidden className="grain" />
    </MotionConfig>
  )
}
