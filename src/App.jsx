import { BrowserRouter } from 'react-router-dom'
import { About, Contact, Experience, Feedbacks, Hero, Navbar ,Tech,Works, StarsCanvas, AdminPanel } from './components'
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext'
import { LanguageProvider } from './context/LanguageContext'

const LoadingScreen = () => (
  <div className="h-screen w-screen bg-primary flex flex-col items-center justify-center gap-6">
    <div className="canvas-loader" />
    <p className="text-secondary text-lg">Cargando...</p>
  </div>
);

function Page() {
  const { loading } = usePortfolio();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
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
  )
}

function App() {

  return (
    <LanguageProvider>
    <PortfolioProvider>
      <BrowserRouter>
        <Page />
      </BrowserRouter>
    </PortfolioProvider>
    </LanguageProvider>
  )
}

export default App

