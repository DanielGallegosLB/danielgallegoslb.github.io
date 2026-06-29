import React, { useState } from "react";
import { Tilt } from 'react-tilt';
import { motion } from "framer-motion";

import { styles } from "../styles";
import { github, link } from "../assets";
import { getAsset } from "../utils/assetMapper";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { usePortfolio } from "../context/PortfolioContext";
import EditableText from "./EditableText";
import { ProjectEditorModal } from "./ModalEditors";

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
  page_link,
}) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        options={{ max: 45, scale: 1, speed: 450 }}
        className='bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full'
      >
        <div className='relative w-full h-[230px]'>
          <img
            src={getAsset(image)}
            alt='project_image'
            className='w-full h-full object-cover rounded-2xl'
          />

          {source_code_link && (
            <div className='absolute inset-0 flex justify-end m-3 card-img_hover'>
              <div
                onClick={() => window.open(source_code_link, "_blank")}
                className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
              >
                <img src={github} alt='source code' className='w-1/2 h-1/2 object-contain' />
              </div>
            </div>
          )}

          {page_link && (
            <div className='absolute inset-0 flex right-11 justify-end m-3 card-img_hover'>
              <div
                onClick={() => window.open(page_link, "_blank")}
                className='white-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
              >
                <img src={link} alt='page link' className='w-1/2 h-1/2 object-contain' />
              </div>
            </div>
          )}
        </div>

        <div className='mt-5'>
          <h3 className='text-white font-bold text-[24px]'>{name}</h3>
          <p className='mt-2 text-secondary text-[14px]'>{description}</p>
        </div>

        <div className='mt-4 flex flex-wrap gap-2'>
          {(tags || []).map((tag) => (
            <p key={`${name}-${tag.name}`} className={`text-[14px] ${tag.color}`}>
              #{tag.name}
            </p>
          ))}
        </div>
      </Tilt>
    </motion.div>
  );
};

const Works = () => {
  const { portfolioData, isAdminMode, updateText, updateField } = usePortfolio();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const projects = portfolioData.projects || [];
  const worksData = portfolioData.works || {};

  return (
    <>
      <motion.div variants={textVariant()}>
        <div className="flex flex-col">
          <EditableText
            value={worksData.sub || "Mi Experiencia"}
            onChange={(val) => updateText("works.sub", val)}
            isAdminMode={isAdminMode}
            className={styles.sectionSubText}
          />
          <EditableText
            value={worksData.title || "Proyectos."}
            onChange={(val) => updateText("works.title", val)}
            isAdminMode={isAdminMode}
            className={styles.sectionHeadText}
          />
        </div>
      </motion.div>

      <div className='w-full flex'>
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className='mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]'
        >
          <EditableText
            value={worksData.description || ""}
            onChange={(val) => updateText("works.description", val)}
            isAdminMode={isAdminMode}
            type="textarea"
            className="text-secondary text-[17px] leading-[30px] block"
          />
        </motion.p>
      </div>

      {isAdminMode && (
        <div className="flex justify-center mt-6 mb-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#915EFF] hover:bg-[#7e4ee0] text-white font-bold py-2 px-6 rounded-xl cursor-pointer transition-colors shadow-lg"
          >
            🛠️ Gestionar Proyectos
          </button>
        </div>
      )}

      <div className='mt-12 flex flex-wrap gap-7'>
        {projects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>

      <ProjectEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={projects}
        onSave={(updated) => updateField("projects", updated)}
      />
    </>
  );
};

export default SectionWrapper(Works, "");
