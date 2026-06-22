import React from "react";
import { Tilt } from 'react-tilt';
import { motion } from "framer-motion";

import { usePortfolio } from "../context/PortfolioContext";
import { getAsset } from "../utils/assetMapper";
import EditableText from "./EditableText";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const ServiceCard = ({ index, title, icon }) => (
  <Tilt className='xs:w-[250px] w-full'>
    <motion.div
      variants={fadeIn("right", "spring", index * 0.5, 0.75)}
      className='w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card'
    >
      <div
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className='bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col'
      >
        <img
          src={getAsset(icon)}
          alt={title}
          className='w-16 h-16 object-contain'
        />

        <h3 className='text-white text-[20px] font-bold text-center'>
          {title}
        </h3>
      </div>
    </motion.div>
  </Tilt>
);

const About = () => {
  const { portfolioData, isAdminMode, updateText } = usePortfolio();

  return (
    <>
      <motion.div variants={textVariant()}>
        <div className="flex flex-col">
          <EditableText
            value={portfolioData.about.sub}
            onChange={(val) => updateText("about.sub", val)}
            isAdminMode={isAdminMode}
            className={styles.sectionSubText}
          />
          <EditableText
            value={portfolioData.about.title}
            onChange={(val) => updateText("about.title", val)}
            isAdminMode={isAdminMode}
            className={styles.sectionHeadText}
          />
        </div>
      </motion.div>

      <div className="mt-4 max-w-3xl">
        <EditableText
          value={portfolioData.about.description}
          onChange={(val) => updateText("about.description", val)}
          isAdminMode={isAdminMode}
          type="textarea"
          className="text-secondary text-[17px] leading-[30px] block"
        />
      </div>

      <div className='mt-20 flex flex-wrap gap-10'>
        {portfolioData.services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "resumen");
