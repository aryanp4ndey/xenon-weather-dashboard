import { createRoot } from 'react-dom/client'
import Lenis from 'lenis'
import App from './App.tsx'
import './index.css'

// Initialize Lenis smooth scrolling
const initLenis = () => {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    syncTouch: true,
    touchMultiplier: 2,
    infinite: false,
  })

  function raf(time: number) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf)
  
  return lenis
}

// Initialize Lenis when DOM is ready
if (typeof window !== 'undefined') {
  initLenis()
}

createRoot(document.getElementById("root")!).render(<App />);
