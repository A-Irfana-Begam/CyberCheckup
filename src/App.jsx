import { useState, useCallback } from 'react';
import SparkleBackground from './components/SparkleBackground';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import FeatureCards from './components/FeatureCards';
import HowItWorks from './components/HowItWorks';
import About from './components/About';
import CTASection from './components/CTASection';
import ScanResults from './components/ScanResults';
import { generateDemoResults, validateUrl } from './data/demoResults';

const SCAN_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  ERROR: 'error',
  RESULTS: 'results',
};

export default function App() {
  const [url, setUrl] = useState('');
  const [scanState, setScanState] = useState(SCAN_STATES.IDLE);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const [activeSection, setActiveSection] = useState('#home');

  const handleNavigate = useCallback((href) => {
    setActiveSection(href);
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleUrlChange = (value) => {
    setUrl(value);
    if (error) setError('');
    if (scanState === SCAN_STATES.ERROR) setScanState(SCAN_STATES.IDLE);
  };

  const handleScan = () => {
    const validation = validateUrl(url);
    if (!validation.valid) {
      setError(validation.message);
      setScanState(SCAN_STATES.ERROR);
      return;
    }

    setError('');
    setScanState(SCAN_STATES.LOADING);

    setTimeout(() => {
      const demoResults = generateDemoResults(validation.normalized);
      setResults(demoResults);
      setScanState(SCAN_STATES.RESULTS);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2200);
  };

  const handleNewScan = () => {
    setScanState(SCAN_STATES.IDLE);
    setResults(null);
    setError('');
    setUrl('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showHome = scanState !== SCAN_STATES.RESULTS;

  return (
    <>
      <SparkleBackground />
      <Navbar onNavigate={handleNavigate} activeSection={activeSection} />

      <main>
        {scanState === SCAN_STATES.RESULTS && results ? (
          <ScanResults results={results} onNewScan={handleNewScan} />
        ) : (
          <>
            <Hero
              url={url}
              onUrlChange={handleUrlChange}
              onScan={handleScan}
              scanState={scanState}
              error={error}
            />
            {showHome && (
              <>
                <FeatureCards />
                <HowItWorks />
                <About />
                <CTASection onStartScan={() => document.getElementById('website-url')?.focus()} />
              </>
            )}
          </>
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
    </>
  );
}
