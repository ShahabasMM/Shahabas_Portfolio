import React from 'react';
import { Cpu } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-12 bg-accent border-t border-white/5 relative">
      <div className="container mx-auto px-6 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-8 group cursor-pointer">
          <div className="w-8 h-8 bg-primary/20 border border-primary/40 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
            <Cpu className="text-primary w-5 h-5 shadow-[0_0_10px_rgba(254,31,25,0.5)]" />
          </div>
          <span className="text-xl font-poppins font-bold tracking-tighter">
            SHAHABAS<span className="text-primary">.</span>
          </span>
        </div>

        <p className="text-gray-400 text-sm font-inter text-center mb-8">
          Built with <span className="text-primary">AI</span> and passion. &copy; {new Date().getFullYear()} Shahabas M. All rights reserved.
        </p>

        <div className="flex gap-8 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
           <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
           <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
        </div>
      </div>
      
      {/* Decorative element */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
    </footer>
  );
};

export default Footer;
