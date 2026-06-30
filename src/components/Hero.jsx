import { motion } from "framer-motion";

import { styles } from "../styles";
import { ComputersCanvas } from "./canvas";

import { usePortfolio } from "../context/PortfolioContext";
import EditableText from "./EditableText";

const Hero = () => {
  const { portfolioData, isAdminMode, updateText } = usePortfolio();

  return (
    <section className={`relative w-full h-screen mx-auto flex flex-col`}>
      {/* PC canvas - rectangular container at top */}
      <div className={`w-full h-[50vh] md:h-[45vh] ${isAdminMode ? "pointer-events-none" : ""}`}>
        <ComputersCanvas />
      </div>

      {/* Text content below */}
      <div className={`flex-1 flex items-start ${styles.paddingX} max-w-7xl mx-auto w-full pt-4 md:pt-8`}>
        <div className='flex flex-col justify-start items-center mt-2 mr-5'>
          <div className='w-5 h-5 rounded-full bg-[#915EFF]' />
          <div className='w-1 sm:h-40 h-20 violet-gradient' />
        </div>

        <div className="w-full">
          <h1 className={`${styles.heroHeadText} text-white flex flex-wrap items-center gap-x-2`}>
            <EditableText
              value={portfolioData.hero.greeting || "Hola, Soy"}
              onChange={(val) => updateText("hero.greeting", val)}
              isAdminMode={isAdminMode}
              style={{ display: "inline", width: isAdminMode ? "auto" : "auto", minWidth: isAdminMode ? "160px" : "auto" }}
            />
            <EditableText
              value={portfolioData.hero.name}
              onChange={(val) => updateText("hero.name", val)}
              isAdminMode={isAdminMode}
              className="text-[#915EFF] font-bold"
              style={{ display: "inline-block", width: isAdminMode ? "auto" : "auto", minWidth: isAdminMode ? "180px" : "auto" }}
            />
          </h1>
          <div className="mt-2 w-full max-w-xl">
            <EditableText
              value={portfolioData.hero.subtitle}
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
