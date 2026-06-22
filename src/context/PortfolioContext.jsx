import React, { createContext, useContext, useState, useEffect } from "react";
import * as constants from "../constants";

// Create Context
const PortfolioContext = createContext();
export const usePortfolio = () => useContext(PortfolioContext);

export const PortfolioProvider = ({ children }) => {
  // Default data (fallback when JSON missing)
  const defaultData = {
    hero: {
      name: "Daniel",
      subtitle: "Desarrollo aplicaciones web completas,\nincluyendo interfaces de usuario, APIs y bases de datos.",
    },
    about: {
      sub: "Introducción",
      title: "Resumen.",
      description: "Soy un desarrollador de software cualificado con experiencia en tecnologías full-stack. Disfruto colaborar estrechamente con clientes y equipos para enfrentar desafíos emergentes, utilizando buenas prácticas y tecnologías adecuadas a cada necesidad. Me especializo en crear soluciones eficientes, escalables y amigables con el usuario en entornos reales.",
    },
    services: constants.services || [],
    experiences: constants.experiences || [],
    technologies: constants.technologies || [],
    projects: constants.projects || [],
    testimonials: constants.testimonials || [],
  };

  // State
  const [portfolioData, setPortfolioData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [githubToken, setGithubToken] = useState(localStorage.getItem("portfolio_gh_token") || "");
  const [githubOwner, setGithubOwner] = useState(localStorage.getItem("portfolio_gh_owner") || "DanielGallegosLB");
  const [githubRepo, setGithubRepo] = useState(localStorage.getItem("portfolio_gh_repo") || "danielgallegoslb.github.io");
  const [githubBranch, setGithubBranch] = useState(localStorage.getItem("portfolio_gh_branch") || "main");
  const [saveStatus, setSaveStatus] = useState({ loading: false, error: null, success: false });

  // Load data from public JSON (dev)
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("./portfolio-data.json?t=" + new Date().getTime());
        if (response.ok) {
          const data = await response.json();
          // Merge with defaults to keep new fields safe
          setPortfolioData({
            ...defaultData,
            ...data,
            hero: { ...defaultData.hero, ...data.hero },
            about: { ...defaultData.about, ...data.about },
          });
        }
      } catch (err) {
        console.warn("Could not load portfolio-data.json, using defaults.", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Persist token/config to localStorage
  useEffect(() => {
    if (githubToken) localStorage.setItem("portfolio_gh_token", githubToken);
    else localStorage.removeItem("portfolio_gh_token");
  }, [githubToken]);

  useEffect(() => {
    localStorage.setItem("portfolio_gh_owner", githubOwner);
    localStorage.setItem("portfolio_gh_repo", githubRepo);
    localStorage.setItem("portfolio_gh_branch", githubBranch);
  }, [githubOwner, githubRepo, githubBranch]);

  // Detect development mode: Vite's env flag (preferred) or fallback to hostname check
  const isDev = (import.meta && import.meta.env && import.meta.env.DEV) ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  // Auth handlers
  const login = (token, owner, repo, branch = "main") => {
    setGithubToken(token);
    setGithubOwner(owner || "DanielGallegosLB");
    setGithubRepo(repo || "danielgallegoslb.github.io");
    setGithubBranch(branch || "main");
    setIsAdminMode(true);
  };

  const logout = () => {
    setGithubToken("");
    setIsAdminMode(false);
  };

  // Simple text updater (nested path like "hero.name" or "about.description")
  const updateText = (path, value) => {
    setPortfolioData((prev) => {
      const keys = path.split(".");
      if (keys.length === 1) {
        return { ...prev, [keys[0]]: value };
      }
      if (keys.length === 2) {
        return {
          ...prev,
          [keys[0]]: {
            ...prev[keys[0]],
            [keys[1]]: value,
          },
        };
      }
      return prev; // fallback for deeper paths (not used currently)
    });
  };

  // Direct field updater (e.g., replace entire array)
  const updateField = (field, value) => {
    setPortfolioData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Generic array CRUD helpers (field must be an array in portfolioData)
  const addItem = (field, item) => {
    setPortfolioData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), item],
    }));
  };

  const updateItem = (field, index, newItem) => {
    setPortfolioData((prev) => {
      const arr = prev[field] ? [...prev[field]] : [];
      if (index >= 0 && index < arr.length) {
        arr[index] = newItem;
      }
      return { ...prev, [field]: arr };
    });
  };

  const removeItem = (field, index) => {
    setPortfolioData((prev) => {
      const arr = prev[field] ? [...prev[field]] : [];
      if (index >= 0 && index < arr.length) {
        arr.splice(index, 1);
      }
      return { ...prev, [field]: arr };
    });
  };

  // Save portfolio (dev = local middleware, prod = GitHub API)
  const savePortfolio = async (customData) => {
    const dataToSave = customData || portfolioData;
    setSaveStatus({ loading: true, error: null, success: false });
    try {
      if (isDev && !githubToken) {
        // Local dev save via Vite middleware
        const response = await fetch("/api/save-portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSave),
        });
        const resData = await response.json();
        if (resData.success) {
          setPortfolioData(dataToSave);
          setSaveStatus({ loading: false, error: null, success: true });
          setTimeout(() => setSaveStatus((p) => ({ ...p, success: false })), 4000);
          return true;
        }
        throw new Error(resData.error || "Server error saving data");
      } else {
        // Production save via GitHub API
        if (!githubToken) {
          throw new Error("Se requiere un token de GitHub para guardar en producción.");
        }
        const filePath = "public/portfolio-data.json";
        const url = `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${filePath}`;
        // Get current SHA
        const getResp = await fetch(`${url}?ref=${githubBranch}`, {
          headers: {
            Authorization: `token ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        });
        let sha = null;
        if (getResp.ok) {
          const fileData = await getResp.json();
          sha = fileData.sha;
        } else if (getResp.status !== 404) {
          throw new Error(`Error obteniendo metadatos del archivo de GitHub (status ${getResp.status})`);
        }
        // Encode content to base64 handling Unicode
        const utf8 = encodeURIComponent(JSON.stringify(dataToSave, null, 2));
        const base64 = btoa(unescape(utf8));
        const putResp = await fetch(url, {
          method: "PUT",
          headers: {
            Authorization: `token ${githubToken}`,
            "Content-Type": "application/json",
            Accept: "application/vnd.github.v3+json",
          },
          body: JSON.stringify({
            message: "Actualización del portafolio desde el panel web de administrador",
            content: base64,
            sha: sha || undefined,
            branch: githubBranch,
          }),
        });
        if (putResp.ok) {
          setPortfolioData(dataToSave);
          setSaveStatus({ loading: false, error: null, success: true });
          setTimeout(() => setSaveStatus((p) => ({ ...p, success: false })), 4000);
          return true;
        }
        const errData = await putResp.json();
        throw new Error(errData.message || "Error al realizar commit en GitHub");
      }
    } catch (err) {
      setSaveStatus({ loading: false, error: err.message, success: false });
      return false;
    }
  };

  // Context value
  const contextValue = {
    portfolioData,
    loading,
    isAdminMode,
    isDev,
    login,
    logout,
    updateText,
    updateField,
    addItem,
    updateItem,
    removeItem,
    savePortfolio,
    saveStatus,
    setGithubToken,
    githubToken,
    githubOwner,
    githubRepo,
    githubBranch,
  };

  return (
    <PortfolioContext.Provider value={contextValue}>
      {children}
    </PortfolioContext.Provider>
  );
};
