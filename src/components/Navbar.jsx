import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { styles } from "../styles";
import { logo, logo2, menu, close } from "../assets";
import { usePortfolio } from "../context/PortfolioContext";
import { useLanguage } from "../context/LanguageContext";
import EditableText from "./EditableText";

const LanguageToggle = ({ lang, setLang, className = "" }) => {
  const buttonClass = (active) =>
    `cursor-pointer px-2 py-1 rounded-lg text-[16px] font-medium transition-colors ${
      active ? "text-white bg-[#915EFF]" : "text-secondary hover:text-white"
    }`;

  return (
    <div className={`flex items-center gap-1 ${className}`} title="Idioma / Language">
      <button className={buttonClass(lang === "es")} onClick={() => setLang("es")}>
        ES
      </button>
      <span className="text-secondary">/</span>
      <button className={buttonClass(lang === "en")} onClick={() => setLang("en")}>
        EN
      </button>
    </div>
  );
};

LanguageToggle.propTypes = {
  lang: PropTypes.string.isRequired,
  setLang: PropTypes.func.isRequired,
  className: PropTypes.string,
};

const Navbar = () => {
  const { portfolioData, isAdminMode, updateText } = usePortfolio();
  const { lang, setLang, localizeData, t } = useLanguage();
  const data = localizeData(portfolioData, isAdminMode);
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
    <nav
      className={`${
        styles.paddingX
      } w-full flex items-center py-5 fixed top-0 z-20 ${
        scrolled ? "bg-primary" : "bg-transparent"
      }`}
    >
      <div className='w-full flex justify-between items-center max-w-7xl mx-auto'>
        <Link
          to='/'
          className='flex items-center gap-2'
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          <img src={logo2} alt='logo' className='w-8 h-8 object-contain' />
          <p className='text-white text-[16px] font-bold cursor-pointer flex items-center gap-1'>
            <EditableText
              value={data.brandName}
              onChange={(val) => updateText("brandName", val)}
              isAdminMode={isAdminMode}
              className="sm:inline"
              style={{ display: "inline", width: isAdminMode ? "100px" : "auto" }}
            />
            <span className='sm:inline hidden'>|</span>
            <EditableText
              value={data.brandTagline}
              onChange={(val) => updateText("brandTagline", val)}
              isAdminMode={isAdminMode}
              className="sm:inline hidden"
              style={{ display: "inline", width: isAdminMode ? "120px" : "auto" }}
            />
          </p>
        </Link>

        <ul className='list-none hidden lg:flex flex-row gap-6 items-center'>
          {(data.navLinks || []).map((nav) => (
            <li
              key={nav.id}
              className={`${
                active === nav.title ? "text-white" : "text-secondary"
              } hover:text-white text-[15px] font-medium cursor-pointer`}
              onClick={() => setActive(nav.title)}
            >
              <a href={`#${nav.id}`}>{nav.title}</a>
            </li>
          ))}
          <LanguageToggle lang={lang} setLang={setLang} />
          <li
            className="text-secondary hover:text-[#915EFF] text-[15px] font-medium cursor-pointer flex items-center transition-colors"
            onClick={() => window.dispatchEvent(new CustomEvent("open-admin-panel"))}
            title="Panel de Administrador"
          >
            🔑
          </li>
        </ul>

        <div className='lg:hidden flex flex-1 justify-end items-center'>
          <img
            src={toggle ? close : menu}
            alt='menu'
            className='w-[28px] h-[28px] object-contain'
            onClick={() => setToggle(!toggle)}
          />
        </div>
      </div>
    </nav>

      <AnimatePresence>
        {toggle && (
          <motion.div
            key='mobile-backdrop'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className='lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm'
            onClick={() => setToggle(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toggle && (
          <motion.aside
            key='mobile-drawer'
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            className='lg:hidden fixed top-0 left-0 h-full w-[260px] z-40 bg-gradient-to-b from-[#151030] to-[#1d1836] border-r border-[#915EFF]/20 shadow-2xl flex flex-col'
          >
            <div className='flex items-center justify-between p-5 border-b border-[#915EFF]/20'>
              <div className='flex items-center gap-2'>
                <img src={logo2} alt='logo' className='w-8 h-8 object-contain' />
                <p className='text-white text-[16px] font-bold'>{data.brandName}</p>
              </div>
              <img
                src={close}
                alt='close'
                className='w-[24px] h-[24px] object-contain cursor-pointer'
                onClick={() => setToggle(false)}
              />
            </div>

            <ul className='list-none flex flex-col flex-1 p-5 gap-3'>
              {(data.navLinks || []).map((nav) => (
                <li key={nav.id}>
                  <a
                    href={`#${nav.id}`}
                    onClick={() => {
                      setToggle(false);
                      setActive(nav.title);
                    }}
                    className={`block text-[16px] font-medium py-2.5 px-3 rounded-xl transition-colors ${
                      active === nav.title
                        ? 'text-white bg-[#915EFF]/20'
                        : 'text-secondary hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {nav.title}
                  </a>
                </li>
              ))}
            </ul>

            <div className='flex flex-col items-start gap-4 p-5 border-t border-[#915EFF]/20'>
              <LanguageToggle lang={lang} setLang={setLang} />
              <button
                onClick={() => {
                  setToggle(false);
                  window.dispatchEvent(new CustomEvent('open-admin-panel'));
                }}
                className='text-secondary hover:text-[#915EFF] text-[15px] font-medium cursor-pointer flex items-center gap-2 transition-colors'
                title='Panel de Administrador'
              >
                🔑 {t('nav.admin', 'Admin')}
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
