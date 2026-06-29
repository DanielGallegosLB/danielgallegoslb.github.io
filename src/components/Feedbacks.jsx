import React, { useState } from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { usePortfolio } from "../context/PortfolioContext";
import EditableText from "./EditableText";
import { TestimonialEditorModal } from "./ModalEditors";

const FeedbackCard = ({
  index,
  testimonial,
  name,
  designation,
  company,
  image,
}) => (
  <motion.div
    variants={fadeIn("", "spring", index * 0.5, 0.75)}
    className='bg-black-200 p-10 rounded-3xl xs:w-[320px] w-full'
  >
    <p className='text-white font-black text-[48px]'>"</p>

    <div className='mt-1'>
      <p className='text-white tracking-wider text-[18px]'>{testimonial}</p>

      <div className='mt-7 flex justify-between items-center gap-1'>
        <div className='flex-1 flex flex-col'>
          <p className='text-white font-medium text-[16px]'>
            <span className='blue-text-gradient'>@</span> {name}
          </p>
          <p className='mt-1 text-secondary text-[12px]'>
            {designation} of {company}
          </p>
        </div>

        <img
          src={image}
          alt={`feedback_by-${name}`}
          className='w-10 h-10 rounded-full object-cover'
        />
      </div>
    </div>
  </motion.div>
);

const Feedbacks = () => {
  const { portfolioData, isAdminMode, updateText, updateField } = usePortfolio();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const testimonials = portfolioData.testimonials || [];
  const feedbacksData = portfolioData.feedbacks || {};

  return (
    <div className={`mt-12 bg-black-100 rounded-[20px]`}>
      <div className={`bg-tertiary rounded-2xl ${styles.padding} min-h-[300px]`}>
        <motion.div variants={textVariant()}>
          <div className="flex flex-col">
            <EditableText
              value={feedbacksData.sub || "Lo que dicen mis clientes"}
              onChange={(val) => updateText("feedbacks.sub", val)}
              isAdminMode={isAdminMode}
              className={styles.sectionSubText}
            />
            <EditableText
              value={feedbacksData.title || "Testimonios."}
              onChange={(val) => updateText("feedbacks.title", val)}
              isAdminMode={isAdminMode}
              className={styles.sectionHeadText}
            />
          </div>
        </motion.div>

        {isAdminMode && (
          <div className="flex mt-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#915EFF] hover:bg-[#7e4ee0] text-white font-bold py-2 px-6 rounded-xl cursor-pointer transition-colors shadow-lg"
            >
              🛠️ Gestionar Testimonios
            </button>
          </div>
        )}
      </div>

      <div className={`-mt-20 pb-14 ${styles.paddingX} flex flex-wrap gap-7`}>
        {testimonials.map((testimonial, index) => (
          <FeedbackCard key={testimonial.name} index={index} {...testimonial} />
        ))}
      </div>

      <TestimonialEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={testimonials}
        onSave={(updated) => updateField("testimonials", updated)}
      />
    </div>
  );
};

export default SectionWrapper(Feedbacks, "");
