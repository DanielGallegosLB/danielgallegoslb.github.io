import { motion } from "framer-motion";

import { styles } from "../styles";
import { ComputersCanvas } from "./canvas";

import { usePortfolio } from "../context/PortfolioContext";
import EditableText from "./EditableText";

const Hero = () => {
  const { portfolioData, isAdminMode, updateText } = usePortfolio();

  return (
    <section className={`relative w-full h-screen mx-auto`}>
      <div
        className={`absolute inset-0 top-[120px]  max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5`}
      >
        <div className='flex flex-col justify-center items-center mt-5'>
          <div className='w-5 h-5 rounded-full bg-[#915EFF]' />
          <div className='w-1 sm:h-80 h-40 violet-gradient' />
        </div>

        <div className="w-full">
          <h1 className={`${styles.heroHeadText} text-white flex flex-wrap items-center gap-x-2`}>
            <span>Hola, Soy</span>
            <EditableText
              value={portfolioData.hero.name}
              onChange={(val) => updateText("hero.name", val)}
              isAdminMode={isAdminMode}
              className="text-[#915EFF] font-bold"
              style={{ display: "inline-block", width: isAdminMode ? "200px" : "auto" }}
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

      <ComputersCanvas />

      <div className='absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center'>
        <a href='#about'>
          <div className='w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2'>
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className='w-3 h-3 rounded-full bg-secondary mb-1'
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
