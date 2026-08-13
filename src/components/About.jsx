import React, { useState } from "react";
import { Tilt } from 'react-tilt';
import { motion } from "framer-motion";

import { usePortfolio } from "../context/PortfolioContext";
import { useLanguage } from "../context/LanguageContext";
import { getAsset } from "../utils/assetMapper";
import EditableText from "./EditableText";
import { ServiceEditorModal } from "./ModalEditors";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import SafeImage from "./SafeImage";

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
        <SafeImage
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
  const { portfolioData, isAdminMode, updateText, updateField } = usePortfolio();
  const { localizeData } = useLanguage();
  const data = localizeData(portfolioData, isAdminMode);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  return (
    <>
      <motion.div variants={textVariant()}>
        <div className="flex flex-col">
          <EditableText
            value={data.about.sub}
            onChange={(val) => updateText("about.sub", val)}
            isAdminMode={isAdminMode}
            className={styles.sectionSubText}
          />
          <EditableText
            value={data.about.title}
            onChange={(val) => updateText("about.title", val)}
            isAdminMode={isAdminMode}
            className={styles.sectionHeadText}
          />
        </div>
      </motion.div>

      <div className="mt-4 max-w-3xl">
        <EditableText
          value={data.about.description}
          onChange={(val) => updateText("about.description", val)}
          isAdminMode={isAdminMode}
          type="textarea"
          className="text-secondary text-[17px] leading-[30px] block"
        />
      </div>

      {isAdminMode && (
        <div className="flex mt-8 mb-2">
          <button
            onClick={() => setIsServiceModalOpen(true)}
            className="bg-[#915EFF] hover:bg-[#7e4ee0] text-white font-bold py-2 px-6 rounded-xl cursor-pointer transition-colors shadow-lg"
          >
            🛠️ Gestionar Servicios
          </button>
        </div>
      )}

      <div className='mt-20 flex flex-wrap gap-10'>
        {data.services.map((service, index) => (
          <ServiceCard key={`service-${index}`} index={index} {...service} />
        ))}
      </div>

      <ServiceEditorModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        data={data.services || []}
        onSave={(updated) => updateField("services", updated)}
      />
    </>
  );
};

export default SectionWrapper(About, "resumen");
