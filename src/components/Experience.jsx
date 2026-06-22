import React, { useState } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";

import "react-vertical-timeline-component/style.min.css";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";
import { usePortfolio } from "../context/PortfolioContext";
import { getAsset } from "../utils/assetMapper";
import EditableText from "./EditableText";
import { ExperienceEditorModal } from "./ModalEditors";

const ExperienceCard = ({ experience }) => {
  return (
    <VerticalTimelineElement
      contentStyle={{
        background: "#1d1836",
        color: "#fff",
      }}
      contentArrowStyle={{ borderRight: "7px solid  #232631" }}
      date={experience.date}
      iconStyle={{ background: experience.iconBg }}
      icon={
        <div className='flex justify-center items-center w-full h-full'>
          <img
            src={getAsset(experience.icon)}
            alt={experience.company_name}
            className='w-[60%] h-[60%] object-contain'
          />
        </div>
      }
    >
      <div>
        <h3 className='text-white text-[24px] font-bold'>{experience.title}</h3>
        <p
          className='text-secondary text-[16px] font-semibold'
          style={{ margin: 0 }}
        >
          {experience.company_name}
        </p>
      </div>

      <ul className='mt-5 list-disc ml-5 space-y-2'>
        {experience.points.map((point, index) => (
          <li
            key={`experience-point-${index}`}
            className='text-white-100 text-[14px] pl-1 tracking-wider'
          >
            {point}
          </li>
        ))}
      </ul>
    </VerticalTimelineElement>
  );
};

const Experience = () => {
  const { portfolioData, isAdminMode, updateText, updateField } = usePortfolio();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { experiences } = portfolioData;

  return (
    <>
      <motion.div variants={textVariant()}>
        <div className="flex flex-col text-center">
          <EditableText
            value={portfolioData.about.expSub || "Mi recorrido profesional hasta ahora"}
            onChange={(val) => updateText("about.expSub", val)}
            isAdminMode={isAdminMode}
            className={styles.sectionSubText}
          />
          <EditableText
            value={portfolioData.about.expTitle || "Experiencia Laboral"}
            onChange={(val) => updateText("about.expTitle", val)}
            isAdminMode={isAdminMode}
            className={styles.sectionHeadText}
          />
        </div>
      </motion.div>

      {isAdminMode && (
        <div className="flex justify-center mt-4 mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#915EFF] hover:bg-[#7e4ee0] text-white font-bold py-2 px-4 rounded-xl cursor-pointer transition-colors shadow-lg"
          >
            🛠️ Gestionar Experiencias
          </button>
        </div>
      )}

      <div className='mt-20 flex flex-col'>
        <VerticalTimeline>
          {experiences.map((experience, index) => (
            <ExperienceCard
              key={`experience-${index}`}
              experience={experience}
            />
          ))}
        </VerticalTimeline>
      </div>

      <ExperienceEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={experiences}
        onSave={(updatedExp) => updateField("experiences", updatedExp)}
      />
    </>
  );
};

export default SectionWrapper(Experience, "trabajo");
