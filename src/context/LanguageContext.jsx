import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { translations } from "../i18n/translations";

const LanguageContext = createContext();
export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem("portfolio_lang");
    return saved === "en" ? "en" : "es";
  });

  useEffect(() => {
    localStorage.setItem("portfolio_lang", lang);
    if (document.documentElement) {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  // Translate a UI string by key, falling back to the provided default
  const t = useCallback(
    (key, fallback = "") => {
      if (lang === "es") return fallback;
      const value = translations[lang]?.ui?.[key];
      return value != null ? value : fallback;
    },
    [lang]
  );

  // Translate a Spanish date like "Enero 2023 - Marzo 2023" to English
  const translateDate = useCallback(
    (date) => {
      if (!date || lang === "es") return date;
      const months = translations[lang].months || {};
      let result = String(date);
      for (const es of Object.keys(months)) {
        result = result.split(es).join(months[es]);
      }
      return result;
    },
    [lang]
  );

  // Produce a fully localized copy of the portfolio data for display.
  // When lang is "es" or the admin is editing, the raw (Spanish) data is returned
  // so admin edits always write to the source of truth.
  const localizeData = useCallback(
    (data, isAdminMode = false) => {
      if (lang === "es" || isAdminMode || !data) return data;
      const en = translations[lang];

      const pick = (item, key, dict, fields) => {
        const entry = dict && dict[key];
        const out = {};
        for (const field of fields) {
          out[field] = entry?.[field] != null ? entry[field] : item[field];
        }
        return out;
      };

      return {
        ...data,
        brandTagline: en.brandTagline || data.brandTagline,
        navLinks: (data.navLinks || []).map((nav) => ({
          ...nav,
          title: (en.navLinks && en.navLinks[nav.id]) || nav.title,
        })),
        hero: {
          ...data.hero,
          greeting: en.hero?.greeting || data.hero?.greeting,
          subtitle: en.hero?.subtitle || data.hero?.subtitle,
        },
        about: {
          ...data.about,
          sub: en.about?.sub || data.about?.sub,
          title: en.about?.title || data.about?.title,
          description: en.about?.description || data.about?.description,
          expSub: en.about?.expSub || data.about?.expSub,
          expTitle: en.about?.expTitle || data.about?.expTitle,
        },
        services: (data.services || []).map((service) => ({
          ...service,
          title: en.services?.[service.title] || service.title,
        })),
        experiences: (data.experiences || []).map((experience) => ({
          ...experience,
          ...pick(experience, experience.company_name, en.experiences, [
            "title",
            "date",
            "points",
          ]),
          date: translateDate(experience.date),
        })),
        projects: (data.projects || []).map((project) => ({
          ...project,
          ...pick(project, project.name, en.projects, ["name", "description"]),
        })),
        testimonials: (data.testimonials || []).map((testimonial) => ({
          ...testimonial,
          ...pick(testimonial, testimonial.name, en.testimonials, [
            "testimonial",
            "designation",
          ]),
        })),
        skills: (data.skills || []).map((skill) => ({
          ...skill,
          name: en.skills?.[skill.name]?.name || skill.name,
        })),
        certifications: (data.certifications || []).map((cert) => ({
          ...cert,
          title: en.certifications?.[cert.title]?.title || cert.title,
          issuer: en.certifications?.[cert.title]?.issuer || cert.issuer,
          date: translateDate(cert.date),
        })),
        works: {
          ...data.works,
          sub: en.works?.sub || data.works?.sub,
          title: en.works?.title || data.works?.title,
          description: en.works?.description || data.works?.description,
        },
        feedbacks: {
          ...data.feedbacks,
          sub: en.feedbacks?.sub || data.feedbacks?.sub,
          title: en.feedbacks?.title || data.feedbacks?.title,
        },
        contact: {
          ...data.contact,
          sub: en.contact?.sub || data.contact?.sub,
          title: en.contact?.title || data.contact?.title,
        },
      };
    },
    [lang, translateDate]
  );

  const value = useMemo(
    () => ({ lang, setLang, t, translateDate, localizeData }),
    [lang, t, translateDate, localizeData]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
};

LanguageProvider.propTypes = {
  children: PropTypes.node,
};
