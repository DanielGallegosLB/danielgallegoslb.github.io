import React, { useState } from "react";

import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { styles } from "../styles";
import { usePortfolio } from "../context/PortfolioContext";
import { useLanguage } from "../context/LanguageContext";
import { getAsset } from "../utils/assetMapper";
import SafeImage from "./SafeImage";
import { CertificationsEditorModal } from "./ModalEditors";

const CertificationCard = ({ certification }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-tertiary rounded-2xl p-6 border border-[#915EFF]/10 hover:border-[#915EFF]/40 transition-colors flex flex-col gap-2 w-full xs:w-[320px]">
      <div className="flex items-center gap-3">
        {certification.icon ? (
          <SafeImage
            src={getAsset(certification.icon)}
            alt={certification.title}
            className="w-10 h-10 object-contain shrink-0"
          />
        ) : (
          <span className="text-2xl">🎓</span>
        )}
        <h3 className="text-white font-bold text-[18px] leading-snug">
          {certification.title}
        </h3>
      </div>
      {certification.issuer && (
        <p className="text-secondary text-[14px]">{certification.issuer}</p>
      )}
      {certification.date && (
        <p className="text-[#915EFF] text-[13px] font-medium">
          {certification.date}
        </p>
      )}
      {certification.link && (
        <a
          href={certification.link}
          target="_blank"
          rel="noreferrer"
          className="text-[#915EFF] hover:text-white text-[13px] font-medium mt-auto pt-2 inline-flex items-center gap-1 transition-colors"
        >
          {t("certifications.view", "Ver certificado")} ↗
        </a>
      )}
    </div>
  );
};

const Tech = () => {
  const { portfolioData, isAdminMode, updateField } = usePortfolio();
  const { localizeData, t } = useLanguage();
  const data = localizeData(portfolioData, isAdminMode);
  const technologies = data.technologies || [];
  const certifications = data.certifications || [];
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  return (
    <>
      <div className='flex flex-row flex-wrap justify-center gap-10'>
        {technologies.map((technology) => (
          <div className='w-28 h-28' key={technology.name}>
            <BallCanvas icon={getAsset(technology.icon)} name={technology.name} />
          </div>
        ))}
      </div>

      {certifications.length > 0 || isAdminMode ? (
        <div className="mt-20">
          <div className="flex flex-col text-center">
            <p className={styles.sectionSubText}>
              {t("certifications.sub", "Educación y Certificaciones")}
            </p>
            <h2 className={styles.sectionHeadText}>
              {t("certifications.title", "Cursos y Logros.")}
            </h2>
          </div>

          {isAdminMode && (
            <div className="flex justify-center mt-4 mb-8">
              <button
                onClick={() => setIsCertModalOpen(true)}
                className="bg-[#915EFF] hover:bg-[#7e4ee0] text-white font-bold py-2 px-4 rounded-xl cursor-pointer transition-colors shadow-lg"
              >
                🛠️ {t("certifications.manage", "Gestionar Certificaciones")}
              </button>
            </div>
          )}

          {certifications.length === 0 ? (
            <p className="text-secondary text-center mt-8">
              {t("certifications.empty", "Aún no hay certificaciones añadidas.")}
            </p>
          ) : (
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              {certifications.map((cert, index) => (
                <CertificationCard key={`cert-${index}`} certification={cert} />
              ))}
            </div>
          )}
        </div>
      ) : null}

      <CertificationsEditorModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        data={certifications}
        onSave={(updated) => updateField("certifications", updated)}
      />
    </>
  );
};

export default SectionWrapper(Tech, "");
