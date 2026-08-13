import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { styles } from "../styles";
import { logo,logo2, menu, close } from "../assets";
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
  const { lang, setLang, localizeData } = useLanguage();
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

          <div
            className={`${
              !toggle ? "hidden" : "flex"
            } p-6 redpower-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}
          >
            <ul className='list-none flex justify-end items-start flex-1 flex-col gap-4'>
              {(data.navLinks || []).map((nav) => (
                <li
                  key={nav.id}
                  className={`font-poppins font-medium cursor-pointer text-[16px] ${
                    active === nav.title ? "text-white" : "text-secondary"
                  }`}
                  onClick={() => {
                    setToggle(!toggle);
                    setActive(nav.title);
                  }}
                >
                  <a href={`#${nav.id}`}>{nav.title}</a>
                </li>
              ))}
              <li
                className="font-poppins font-medium cursor-pointer text-[16px] text-secondary hover:text-[#915EFF]"
                onClick={() => {
                  setToggle(!toggle);
                  window.dispatchEvent(new CustomEvent("open-admin-panel"));
                }}
              >
                🔑 Admin
              </li>
              <li className="text-secondary">
                <LanguageToggle lang={lang} setLang={setLang} />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
