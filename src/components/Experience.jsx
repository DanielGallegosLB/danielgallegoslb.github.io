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
import { useLanguage } from "../context/LanguageContext";
import { getAsset } from "../utils/assetMapper";
import EditableText from "./EditableText";
import SafeImage from "./SafeImage";
import { ExperienceEditorModal, SkillsEditorModal } from "./ModalEditors";

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
          <SafeImage
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

const SkillBar = ({ skill, maxYears }) => {
  const { t } = useLanguage();
  const years = Math.max(0, Number(skill.years) || 0);
  const pct = maxYears > 0 ? Math.round((years / maxYears) * 100) : 0;

  return (
    <div className="flex items-center gap-4 w-full">
      {skill.icon && (
        <SafeImage
          src={getAsset(skill.icon)}
          alt={skill.name}
          className="w-8 h-8 object-contain shrink-0"
        />
      )}
      <div className="flex-1 bg-tertiary rounded-full h-[34px] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#915EFF] to-[#7e4ee0] flex items-center justify-between px-4 min-w-[110px]"
          style={{ width: `${Math.max(pct, 8)}%` }}
        >
          <span className="text-white text-[14px] font-semibold truncate">
            {skill.name}
          </span>
          <span className="text-white/90 text-[13px] font-medium whitespace-nowrap ml-2">
            {years}{" "}
            {years === 1
              ? t("skills.years.singular", "año")
              : t("skills.years", "años")}
          </span>
        </div>
      </div>
    </div>
  );
};

const Experience = () => {
  const { portfolioData, isAdminMode, updateText, updateField } = usePortfolio();
  const { localizeData, t } = useLanguage();
  const data = localizeData(portfolioData, isAdminMode);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);

  const { experiences, skills } = data;
  const maxYears = Math.max(
    1,
    ...(skills || []).map((s) => Number(s.years) || 0)
  );

  return (
    <>
      <motion.div variants={textVariant()}>
        <div className="flex flex-col text-center">
          <EditableText
            value={data.about.expSub || "Mi recorrido profesional hasta ahora"}
            onChange={(val) => updateText("about.expSub", val)}
            isAdminMode={isAdminMode}
            className={styles.sectionSubText}
          />
          <EditableText
            value={data.about.expTitle || "Experiencia Laboral"}
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

      <div className='mt-12 flex flex-col'>
        <VerticalTimeline>
          {experiences.map((experience, index) => (
            <ExperienceCard
              key={`experience-${index}`}
              experience={experience}
            />
          ))}
        </VerticalTimeline>
      </div>

      {(skills && skills.length > 0) || isAdminMode ? (
        <div className="mt-20">
          <div className="flex flex-col text-center">
            <p className={styles.sectionSubText}>
              {t("skills.sub", "Nivel de Tecnologías")}
            </p>
            <h2 className={styles.sectionHeadText}>
              {t("skills.title", "Años de Experiencia")}
            </h2>
          </div>

          {isAdminMode && (
            <div className="flex justify-center mt-4 mb-8">
              <button
                onClick={() => setIsSkillsModalOpen(true)}
                className="bg-[#915EFF] hover:bg-[#7e4ee0] text-white font-bold py-2 px-4 rounded-xl cursor-pointer transition-colors shadow-lg"
              >
                🛠️ {t("skills.manage", "Gestionar Tecnologías")}
              </button>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-5">
            {skills.length === 0 ? (
              <p className="text-secondary text-center">
                {t("skills.empty", "Aún no hay tecnologías añadidas.")}
              </p>
            ) : (
              skills.map((skill, index) => (
                <SkillBar key={`skill-${index}`} skill={skill} maxYears={maxYears} />
              ))
            )}
          </div>
        </div>
      ) : null}

      <ExperienceEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={experiences}
        onSave={(updatedExp) => updateField("experiences", updatedExp)}
      />

      <SkillsEditorModal
        isOpen={isSkillsModalOpen}
        onClose={() => setIsSkillsModalOpen(false)}
        data={skills}
        onSave={(updatedSkills) => updateField("skills", updatedSkills)}
      />
    </>
  );
};

export default SectionWrapper(Experience, "experiencia");
