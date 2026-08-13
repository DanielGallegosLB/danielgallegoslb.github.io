import { motion } from "framer-motion";

import { styles } from "../styles";
import { ComputersCanvas } from "./canvas";

import { usePortfolio } from "../context/PortfolioContext";
import { useLanguage } from "../context/LanguageContext";
import EditableText from "./EditableText";

const Hero = () => {
  const { portfolioData, isAdminMode, updateText } = usePortfolio();
  const { localizeData } = useLanguage();
  const data = localizeData(portfolioData, isAdminMode);

  return (
    <section className={`relative w-full min-h-[70vh] mx-auto flex flex-col`}>
      {/* PC canvas - rectangular container at top */}
      <div className={`w-full h-[30vh] md:h-[28vh] ${isAdminMode ? "pointer-events-none" : ""}`}>
        <ComputersCanvas />
      </div>

      {/* Text content below */}
      <div className={`flex-0 flex items-center ${styles.paddingX} max-w-7xl mx-auto w-full pt-2 md:pt-4`}>
        <div className='flex flex-col justify-start items-center mt-2 mr-5'>
          <div className='w-5 h-5 rounded-full bg-[#915EFF]' />
          <div className='w-1 sm:h-28 h-20 violet-gradient' />
        </div>

        <div className="w-full">
          <h1 className={`${styles.heroHeadText} text-white flex flex-wrap items-center gap-x-2`}>
            <EditableText
              value={data.hero.greeting || "Hola, Soy"}
              onChange={(val) => updateText("hero.greeting", val)}
              isAdminMode={isAdminMode}
              style={{ display: "inline", width: isAdminMode ? "auto" : "auto", minWidth: isAdminMode ? "160px" : "auto" }}
            />
            <EditableText
              value={data.hero.name}
              onChange={(val) => updateText("hero.name", val)}
              isAdminMode={isAdminMode}
              className="text-[#915EFF] font-bold"
              style={{ display: "inline-block", width: isAdminMode ? "auto" : "auto", minWidth: isAdminMode ? "180px" : "auto" }}
            />
          </h1>
          <div className="mt-2 w-full max-w-xl">
            <EditableText
              value={data.hero.subtitle}
              onChange={(val) => updateText("hero.subtitle", val)}
              isAdminMode={isAdminMode}
              type="textarea"
              className={`${styles.heroSubText} text-white-100`}
            />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
    </section>
  );
};

export default Hero;
