import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
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
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <ContentProvider>
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/"
          element={
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
              <div className="fixed inset-0 pointer-events-none opacity-[0.08] z-[999] [background-image:radial-gradient(rgba(255,255,255,0.08)_0.5px,transparent_0.5px)] [background-size:3px_3px] mix-blend-overlay"></div>
            </div>
          }
        />
        <Route path="/admin/*" element={<AdminPanel />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ContentProvider>
  );
};

export default App;
