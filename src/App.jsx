import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminPanel from './components/admin/AdminPanel';
import { ContentProvider } from './context/ContentContext';
import CustomCursor from './components/CustomCursor';

const App = () => {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handleNavigation = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handleNavigation);
    return () => {
      window.removeEventListener('popstate', handleNavigation);
    };
  }, []);

  if (pathname.startsWith('/admin')) {
    return (
      <ContentProvider>
        <AdminPanel />
      </ContentProvider>
    );
  }

  return (
    <ContentProvider>
      <div className="relative min-h-screen">
        <CustomCursor />

        <Navbar />
        
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </main>

        <Footer />

        {/* Grid Pattern Overlay */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[999] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] blend-overlay"></div>
      </div>
    </ContentProvider>
  );
};

export default App;
