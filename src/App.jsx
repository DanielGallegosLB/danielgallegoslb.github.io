import { BrowserRouter } from 'react-router-dom'
import { About, Contact, Experience, Feedbacks, Hero, Navbar ,Tech,Works, StarsCanvas, AdminPanel } from './components'
import { PortfolioProvider } from './context/PortfolioContext'

function App() {

  return (
    <PortfolioProvider>
      <BrowserRouter>
        <div className='relative z-0 bg-primary'>
          <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
            <Navbar />
            <Hero />
          </div>
          <About />
          <Experience />
          <Tech />
          <Works />
          <Feedbacks />
          <div className='relative z-0'>
            <Contact />
            <StarsCanvas />
          </div>
          
          <AdminPanel />
        </div>
      </BrowserRouter>
    </PortfolioProvider>
  )
}

export default App

