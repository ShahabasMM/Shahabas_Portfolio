import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Cpu } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      if (window.scrollY < 120) {
        setActiveSection("home");
        return;
      }
      const ids = ["about", "skills", "projects", "contact"];
      for (const id of ids) {
        const node = document.getElementById(id);
        if (!node) continue;
        const rect = node.getBoundingClientRect();
        if (rect.top <= 160 && rect.bottom >= 160) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  const scrollToId = (id) => {
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const target = document.querySelector(`#${id}`);
    if (!target) return;
    const offset = 96;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const handleNavClick = (href) => {
    const id = href.replace("#", "");
    const closeMenu = () => setIsMobileMenuOpen(false);

    if (id === "home") {
      setActiveSection("home");
      closeMenu();
      requestAnimationFrame(() => {
        window.setTimeout(() => scrollToId("home"), 80);
      });
      return;
    }
    if (!document.querySelector(`#${id}`)) return;
    setActiveSection(id);
    closeMenu();
    requestAnimationFrame(() => {
      window.setTimeout(() => scrollToId(id), 80);
    });
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-black/55 backdrop-blur-lg py-4" : "bg-transparent py-6"}`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => handleNavClick("#home")}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shadow-[0_0_15px_rgba(254,31,25,0.5)]">
            <Cpu className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-poppins font-bold tracking-tighter">
            SHAHABAS
          </span>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6" style={{ fontSize: "14px" }}>
          {navLinks.map((link, i) => (
            <motion.button
              key={link.name}
              type="button"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleNavClick(link.href)}
              className={`leading-none font-poppins font-medium uppercase tracking-[0.06em] transition-colors relative group ${
                activeSection === link.href.slice(1)
                  ? "text-primary"
                  : "hover:text-primary"
              }`}
            >
              {link.name}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all ${
                  activeSection === link.href.slice(1)
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              ></span>
            </motion.button>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/10"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <motion.button
                  key={link.name}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleNavClick(link.href)}
                  style={{ fontSize: "14px" }}
                  className={`text-left leading-none font-poppins font-medium uppercase tracking-[0.06em] transition-colors ${
                    activeSection === link.href.slice(1)
                      ? "text-primary"
                      : "hover:text-primary"
                  }`}
                >
                  {link.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
