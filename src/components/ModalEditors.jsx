import React, { useState } from "react";
import { getAsset } from "../utils/assetMapper";

// Helper to convert file to Base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const ModalWrapper = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#151030] border border-[#915EFF]/30 w-full max-w-3xl rounded-2xl shadow-2xl p-6 text-white max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center border-b border-[#915EFF]/20 pb-4 mb-4">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-secondary hover:text-white text-2xl font-bold cursor-pointer transition-colors"
          >
            &times;
          </button>
        </div>
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

// 1. PROJECT EDITOR MODAL
export const ProjectEditorModal = ({ isOpen, onClose, data, onSave }) => {
  const [projects, setProjects] = useState(data || []);
  const [editingIndex, setEditingIndex] = useState(null);
  
  // Form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [sourceCodeLink, setSourceCodeLink] = useState("");
  const [pageLink, setPageLink] = useState("");
  const [image, setImage] = useState("");

  const startEdit = (index) => {
    setEditingIndex(index);
    const p = projects[index];
    setName(p.name || "");
    setDescription(p.description || "");
    setTagsInput((p.tags || []).map(t => t.name).join(", "));
    setSourceCodeLink(p.source_code_link || "");
    setPageLink(p.page_link || "");
    setImage(p.image || "");
  };

  const startAdd = () => {
    setEditingIndex(-1); // -1 means new project
    setName("");
    setDescription("");
    setTagsInput("");
    setSourceCodeLink("");
    setPageLink("");
    setImage("");
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setImage(base64);
      } catch (err) {
        alert("Error al procesar la imagen: " + err.message);
      }
    }
  };

  const saveItem = () => {
    if (!name.trim()) {
      alert("El nombre del proyecto es requerido");
      return;
    }

    const availableColors = [
      "blue-text-gradient",
      "green-text-gradient",
      "pink-text-gradient",
      "purple-text-gradient",
      "orange-text-gradient"
    ];

    const tags = tagsInput
      .split(",")
      .map((t, idx) => ({
        name: t.trim().toLowerCase(),
        color: availableColors[idx % availableColors.length]
      }))
      .filter(t => t.name !== "");

    const updatedProject = {
      name,
      description,
      tags,
      image,
      source_code_link: sourceCodeLink || undefined,
      page_link: pageLink || undefined
    };

    let updatedProjects = [...projects];
    if (editingIndex === -1) {
      updatedProjects.push(updatedProject);
    } else {
      updatedProjects[editingIndex] = updatedProject;
    }

    setProjects(updatedProjects);
    setEditingIndex(null);
  };

  const deleteItem = (index) => {
    if (window.confirm("¿Estás seguro de eliminar este proyecto?")) {
      const updated = projects.filter((_, idx) => idx !== index);
      setProjects(updated);
      if (editingIndex === index) {
        setEditingIndex(null);
      }
    }
  };

  const moveItem = (index, direction) => {
    const updated = [...projects];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setProjects(updated);
  };

  const handleFinalSave = () => {
    onSave(projects);
    onClose();
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Gestionar Proyectos">
      {editingIndex === null ? (
        <div className="flex flex-col gap-4">
          <button
            onClick={startAdd}
            className="bg-[#915EFF] hover:bg-[#7e4ee0] text-white px-4 py-2 rounded-lg font-semibold transition-colors w-full cursor-pointer"
          >
            + Añadir Nuevo Proyecto
          </button>
          
          <div className="space-y-3 mt-2">
            {projects.length === 0 ? (
              <p className="text-secondary text-center py-4">No hay proyectos añadidos.</p>
            ) : (
              projects.map((proj, idx) => (
                <div key={idx} className="flex items-center justify-between bg-[#1d1836] p-4 rounded-xl border border-[#915EFF]/10">
                  <div className="flex items-center gap-3">
                    {proj.image && (
                      <img
                        src={getAsset(proj.image)}
                        alt={proj.name}
                        className="w-12 h-12 object-cover rounded-lg bg-tertiary"
                      />
                    )}
                    <div>
                      <h4 className="font-bold text-[16px]">{proj.name}</h4>
                      <p className="text-[12px] text-secondary line-clamp-1 max-w-[300px]">
                        {proj.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => moveItem(idx, -1)}
                      disabled={idx === 0}
                      className="px-2 py-1 text-sm bg-tertiary rounded hover:bg-secondary/20 disabled:opacity-30 cursor-pointer"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveItem(idx, 1)}
                      disabled={idx === projects.length - 1}
                      className="px-2 py-1 text-sm bg-tertiary rounded hover:bg-secondary/20 disabled:opacity-30 cursor-pointer"
                    >
                      ▼
                    </button>
                    <button
                      onClick={() => startEdit(idx)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded cursor-pointer transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deleteItem(idx)}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded cursor-pointer transition-colors"
                    >
                      Borrar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-[#915EFF]/20 pt-4 mt-4 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="bg-tertiary hover:bg-tertiary/75 px-4 py-2 rounded-lg cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleFinalSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-bold cursor-pointer transition-colors"
            >
              Guardar Cambios en Portafolio
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-lg text-[#915EFF]">
            {editingIndex === -1 ? "Añadir Nuevo Proyecto" : `Editar Proyecto: ${name}`}
          </h4>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Nombre del Proyecto</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: E-Commerce React"
              className="bg-[#1d1836] border border-[#915EFF]/30 rounded-lg p-2.5 outline-none focus:border-[#915EFF]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe detalladamente el proyecto..."
              className="bg-[#1d1836] border border-[#915EFF]/30 rounded-lg p-2.5 outline-none focus:border-[#915EFF] h-28 resize-y"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Enlace del Código (GitHub)</label>
              <input
                type="text"
                value={sourceCodeLink}
                onChange={(e) => setSourceCodeLink(e.target.value)}
                placeholder="https://github.com/..."
                className="bg-[#1d1836] border border-[#915EFF]/30 rounded-lg p-2.5 outline-none focus:border-[#915EFF]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Enlace de Demo / Web</label>
              <input
                type="text"
                value={pageLink}
                onChange={(e) => setPageLink(e.target.value)}
                placeholder="https://..."
                className="bg-[#1d1836] border border-[#915EFF]/30 rounded-lg p-2.5 outline-none focus:border-[#915EFF]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Etiquetas / Tags (separados por comas)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="react, tailwind, nodejs, mongodb"
              className="bg-[#1d1836] border border-[#915EFF]/30 rounded-lg p-2.5 outline-none focus:border-[#915EFF]"
            />
            <p className="text-[11px] text-secondary">
              Escribe las tecnologías separadas por comas. Las clases de colores se asignarán automáticamente.
            </p>
          </div>

          <div className="border border-[#915EFF]/20 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <label className="text-sm font-semibold block mb-1">Imagen del Proyecto</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#915EFF]/20 file:text-[#915EFF] hover:file:bg-[#915EFF]/30 file:cursor-pointer"
              />
              <p className="text-[11px] text-secondary mt-1">O escribe una URL de imagen a continuación:</p>
              <input
                type="text"
                value={image.startsWith("data:image") ? "" : image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="bg-[#1d1836] border border-[#915EFF]/30 rounded-lg p-2 mt-1.5 outline-none focus:border-[#915EFF] w-full text-xs"
              />
            </div>
            
            {image && (
              <div className="flex flex-col items-center">
                <p className="text-xs text-secondary mb-1">Vista Previa:</p>
                <img
                  src={getAsset(image)}
                  alt="preview"
                  className="w-28 h-20 object-cover rounded-lg border border-[#915EFF]/30"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setEditingIndex(null)}
              className="bg-tertiary hover:bg-tertiary/75 px-4 py-2 rounded-lg cursor-pointer"
            >
              Atrás
            </button>
            <button
              onClick={saveItem}
              className="bg-[#915EFF] hover:bg-[#7e4ee0] text-white px-5 py-2 rounded-lg font-bold cursor-pointer"
            >
              Aplicar Cambios
            </button>
          </div>
        </div>
      )}
    </ModalWrapper>
  );
};


// 2. EXPERIENCE EDITOR MODAL
export const ExperienceEditorModal = ({ isOpen, onClose, data, onSave }) => {
  const [experiences, setExperiences] = useState(data || []);
  const [editingIndex, setEditingIndex] = useState(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [date, setDate] = useState("");
  const [icon, setIcon] = useState("");
  const [iconBg, setIconBg] = useState("#1d1836");
  const [pointsText, setPointsText] = useState("");

  // Built-in company icons suggestions
  const iconSuggestions = [
    { name: "UDLA", key: "udla" },
    { name: "FID", key: "fid" },
    { name: "Whale Cloud", key: "whalecloud" },
    { name: "Starbucks", key: "starbucks" },
    { name: "Tesla", key: "tesla" },
    { name: "Shopify", key: "shopify" },
    { name: "Meta", key: "meta" }
  ];

  const startEdit = (index) => {
    setEditingIndex(index);
    const exp = experiences[index];
    setTitle(exp.title || "");
    setCompanyName(exp.company_name || "");
    setDate(exp.date || "");
    setIcon(exp.icon || "");
    setIconBg(exp.iconBg || "#1d1836");
    setPointsText((exp.points || []).join("\n"));
  };

  const startAdd = () => {
    setEditingIndex(-1);
    setTitle("");
    setCompanyName("");
    setDate("");
    setIcon("web");
    setIconBg("#1d1836");
    setPointsText("");
  };

  const handleIconUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setIcon(base64);
      } catch (err) {
        alert("Error al procesar el ícono: " + err.message);
      }
    }
  };

  const saveItem = () => {
    if (!title.trim() || !companyName.trim()) {
      alert("El cargo y la empresa son obligatorios");
      return;
    }

    const points = pointsText
      .split("\n")
      .map(p => p.trim())
      .filter(p => p !== "");

    const updatedExp = {
      title,
      company_name: companyName,
      date,
      icon,
      iconBg,
      points
    };

    let updatedExperiences = [...experiences];
    if (editingIndex === -1) {
      updatedExperiences.push(updatedExp);
    } else {
      updatedExperiences[editingIndex] = updatedExp;
    }

    setExperiences(updatedExperiences);
    setEditingIndex(null);
  };

  const deleteItem = (index) => {
    if (window.confirm("¿Estás seguro de eliminar esta experiencia?")) {
      const updated = experiences.filter((_, idx) => idx !== index);
      setExperiences(updated);
      if (editingIndex === index) {
        setEditingIndex(null);
      }
    }
  };

  const moveItem = (index, direction) => {
    const updated = [...experiences];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setExperiences(updated);
  };

  const handleFinalSave = () => {
    onSave(experiences);
    onClose();
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Gestionar Experiencia Laboral">
      {editingIndex === null ? (
        <div className="flex flex-col gap-4">
          <button
            onClick={startAdd}
            className="bg-[#915EFF] hover:bg-[#7e4ee0] text-white px-4 py-2 rounded-lg font-semibold transition-colors w-full cursor-pointer"
          >
            + Añadir Nueva Experiencia
          </button>

          <div className="space-y-3 mt-2">
            {experiences.length === 0 ? (
              <p className="text-secondary text-center py-4">No hay experiencias añadidas.</p>
            ) : (
              experiences.map((exp, idx) => (
                <div key={idx} className="flex items-center justify-between bg-[#1d1836] p-4 rounded-xl border border-[#915EFF]/10">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
                      style={{ backgroundColor: exp.iconBg || "#1d1836" }}
                    >
                      {exp.icon && (
                        <img
                          src={getAsset(exp.icon)}
                          alt={exp.company_name}
                          className="w-[60%] h-[60%] object-contain"
                        />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-[16px]">{exp.title}</h4>
                      <p className="text-[13px] text-[#915EFF]">{exp.company_name} | <span className="text-secondary">{exp.date}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => moveItem(idx, -1)}
                      disabled={idx === 0}
                      className="px-2 py-1 text-sm bg-tertiary rounded hover:bg-secondary/20 disabled:opacity-30 cursor-pointer"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveItem(idx, 1)}
                      disabled={idx === experiences.length - 1}
                      className="px-2 py-1 text-sm bg-tertiary rounded hover:bg-secondary/20 disabled:opacity-30 cursor-pointer"
                    >
                      ▼
                    </button>
                    <button
                      onClick={() => startEdit(idx)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded cursor-pointer transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deleteItem(idx)}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded cursor-pointer transition-colors"
                    >
                      Borrar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-[#915EFF]/20 pt-4 mt-4 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="bg-tertiary hover:bg-tertiary/75 px-4 py-2 rounded-lg cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleFinalSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-bold cursor-pointer transition-colors"
            >
              Guardar Cambios en Portafolio
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-lg text-[#915EFF]">
            {editingIndex === -1 ? "Añadir Nueva Experiencia" : `Editar Experiencia`}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Cargo / Rol</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Full-stack Developer"
                className="bg-[#1d1836] border border-[#915EFF]/30 rounded-lg p-2.5 outline-none focus:border-[#915EFF]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Empresa / Institución</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Ej: Google"
                className="bg-[#1d1836] border border-[#915EFF]/30 rounded-lg p-2.5 outline-none focus:border-[#915EFF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Fechas / Rango de tiempo</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Ej: Enero 2023 - Presente"
                className="bg-[#1d1836] border border-[#915EFF]/30 rounded-lg p-2.5 outline-none focus:border-[#915EFF]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Fondo del Ícono (Hex Color)</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={iconBg}
                  onChange={(e) => setIconBg(e.target.value)}
                  className="w-10 h-10 bg-transparent border-0 cursor-pointer rounded-lg overflow-hidden"
                />
                <input
                  type="text"
                  value={iconBg}
                  onChange={(e) => setIconBg(e.target.value)}
                  className="bg-[#1d1836] border border-[#915EFF]/30 rounded-lg p-2 outline-none w-full"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Puntos de Logro / Viñetas (uno por línea)</label>
            <textarea
              value={pointsText}
              onChange={(e) => setPointsText(e.target.value)}
              placeholder="Desarrollé la arquitectura del frontend.&#10;Implementé Docker para despliegues fluidos.&#10;Lideré un equipo de 3 desarrolladores."
              className="bg-[#1d1836] border border-[#915EFF]/30 rounded-lg p-2.5 outline-none focus:border-[#915EFF] h-28 resize-y"
            />
          </div>

          <div className="border border-[#915EFF]/20 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <label className="text-sm font-semibold block mb-1">Ícono de la Empresa</label>
              
              {/* Dropdown with predefined icon keys */}
              <div className="flex flex-col gap-2 mb-3">
                <p className="text-xs text-secondary">Elige un logo existente:</p>
                <select
                  value={iconSuggestions.some(s => s.key === icon) ? icon : ""}
                  onChange={(e) => e.target.value && setIcon(e.target.value)}
                  className="bg-[#1d1836] border border-[#915EFF]/30 rounded-lg p-2 outline-none w-full text-sm focus:border-[#915EFF]"
                >
                  <option value="">-- Personalizado / Otro --</option>
                  {iconSuggestions.map((s) => (
                    <option key={s.key} value={s.key}>{s.name}</option>
                  ))}
                </select>
              </div>

              <p className="text-xs text-secondary">O sube un archivo nuevo:</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleIconUpload}
                className="text-sm text-secondary file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#915EFF]/20 file:text-[#915EFF] hover:file:bg-[#915EFF]/30 file:cursor-pointer"
              />
              <p className="text-[11px] text-secondary mt-1.5">O introduce la URL del ícono:</p>
              <input
                type="text"
                value={icon.startsWith("data:image") ? "" : icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="https://..."
                className="bg-[#1d1836] border border-[#915EFF]/30 rounded-lg p-2 mt-1 outline-none focus:border-[#915EFF] w-full text-xs"
              />
            </div>

            {icon && (
              <div className="flex flex-col items-center">
                <p className="text-xs text-secondary mb-1">Fondo & Ícono:</p>
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center border border-[#915EFF]/20 overflow-hidden"
                  style={{ backgroundColor: iconBg }}
                >
                  <img
                    src={getAsset(icon)}
                    alt="preview"
                    className="w-[60%] h-[60%] object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setEditingIndex(null)}
              className="bg-tertiary hover:bg-tertiary/75 px-4 py-2 rounded-lg cursor-pointer"
            >
              Atrás
            </button>
            <button
              onClick={saveItem}
              className="bg-[#915EFF] hover:bg-[#7e4ee0] text-white px-5 py-2 rounded-lg font-bold cursor-pointer"
            >
              Aplicar Cambios
            </button>
          </div>
        </div>
      )}
    </ModalWrapper>
  );
};


// 3. TESTIMONIAL EDITOR MODAL
export const TestimonialEditorModal = ({ isOpen, onClose, data, onSave }) => {
  // existing TestimonialEditorModal code remains unchanged
  const [testimonials, setTestimonials] = useState(data || []);

  const [editingIndex, setEditingIndex] = useState(null);

  // Form fields
  const [testimonial, setTestimonial] = useState("");
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [company, setCompany] = useState("");
  const [image, setImage] = useState("");

  const startEdit = (index) => {
    setEditingIndex(index);
    const t = testimonials[index];
    setTestimonial(t.testimonial || "");
    setName(t.name || "");
    setDesignation(t.designation || "");
    setCompany(t.company || "");
    setImage(t.image || "");
  };

  const startAdd = () => {
    setEditingIndex(-1);
    setTestimonial("");
    setName("");
    setDesignation("");
    setCompany("");
    setImage("https://randomuser.me/api/portraits/men/1.jpg");
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setImage(base64);
      } catch (err) {
        alert("Error al procesar la imagen: " + err.message);
      }
    }
  };

  const saveItem = () => {
    if (!testimonial.trim() || !name.trim()) {
      alert("El testimonio y el nombre de la persona son requeridos");
      return;
    }

    const updatedTestimonial = {
      testimonial,
      name,
      designation,
      company,
      image
    };

    let updatedList = [...testimonials];
    if (editingIndex === -1) {
      updatedList.push(updatedTestimonial);
    } else {
      updatedList[editingIndex] = updatedTestimonial;
    }

    setTestimonials(updatedList);
    setEditingIndex(null);
  };

  const deleteItem = (index) => {
    if (window.confirm("¿Estás seguro de eliminar este testimonio?")) {
      const updated = testimonials.filter((_, idx) => idx !== index);
      setTestimonials(updated);
      if (editingIndex === index) {
        setEditingIndex(null);
      }
    }
  };

  const moveItem = (index, direction) => {
    const updated = [...testimonials];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setTestimonials(updated);
  };

  const handleFinalSave = () => {
    onSave(testimonials);
    onClose();
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Gestionar Testimonios">
      {editingIndex === null ? (
        <div className="flex flex-col gap-4">
          <button
            onClick={startAdd}
            className="bg-[#915EFF] hover:bg-[#7e4ee0] text-white px-4 py-2 rounded-lg font-semibold transition-colors w-full cursor-pointer"
          >
            + Añadir Nuevo Testimonio
          </button>

          <div className="space-y-3 mt-2">
            {testimonials.length === 0 ? (
              <p className="text-secondary text-center py-4">No hay testimonios añadidos.</p>
            ) : (
              testimonials.map((t, idx) => (
                <div key={idx} className="flex items-center justify-between bg-[#1d1836] p-4 rounded-xl border border-[#915EFF]/10">
                  <div className="flex items-center gap-3">
                    <img
                      src={getAsset(t.image)}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover bg-tertiary"
                    />
                    <div>
                      <h4 className="font-bold text-[15px]">{t.name}</h4>
                      <p className="text-[12px] text-secondary">{t.designation} de {t.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => moveItem(idx, -1)}
                      disabled={idx === 0}
                      className="px-2 py-1 text-sm bg-tertiary rounded hover:bg-secondary/20 disabled:opacity-30 cursor-pointer"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveItem(idx, 1)}
                      disabled={idx === testimonials.length - 1}
                      className="px-2 py-1 text-sm bg-tertiary rounded hover:bg-secondary/20 disabled:opacity-30 cursor-pointer"
                    >
                      ▼
                    </button>
                    <button
                      onClick={() => startEdit(idx)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded cursor-pointer transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deleteItem(idx)}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded cursor-pointer transition-colors"
                    >
                      Borrar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-[#915EFF]/20 pt-4 mt-4 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="bg-tertiary hover:bg-tertiary/75 px-4 py-2 rounded-lg cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleFinalSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-bold cursor-pointer transition-colors"
            >
              Guardar Cambios en Portafolio
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-lg text-[#915EFF]">
            {editingIndex === -1 ? "Añadir Nuevo Testimonio" : `Editar Testimonio`}
          </h4>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Testimonio / Opinión</label>
            <textarea
              value={testimonial}
              onChange={(e) => setTestimonial(e.target.value)}
              placeholder="Escribe la recomendación o testimonio de la persona..."
              className="bg-[#1d1836] border border-[#915EFF]/30 rounded-lg p-2.5 outline-none focus:border-[#915EFF] h-28 resize-y"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Nombre de la persona</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Juan Pérez"
                className="bg-[#1d1836] border border-[#915EFF]/30 rounded-lg p-2.5 outline-none focus:border-[#915EFF]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Cargo / Rol</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="Ej: CEO"
                className="bg-[#1d1836] border border-[#915EFF]/30 rounded-lg p-2.5 outline-none focus:border-[#915EFF]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Empresa</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Ej: Tech Innovators"
                className="bg-[#1d1836] border border-[#915EFF]/30 rounded-lg p-2.5 outline-none focus:border-[#915EFF]"
              />
            </div>
          </div>

          <div className="border border-[#915EFF]/20 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <label className="text-sm font-semibold block mb-1">Imagen de Perfil</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm text-secondary file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#915EFF]/20 file:text-[#915EFF] hover:file:bg-[#915EFF]/30 file:cursor-pointer"
              />
              <p className="text-[11px] text-secondary mt-1">O escribe una URL de imagen de perfil:</p>
              <input
                type="text"
                value={image.startsWith("data:image") ? "" : image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://randomuser.me/api/portraits/men/1.jpg"
                className="bg-[#1d1836] border border-[#915EFF]/30 rounded-lg p-2 mt-1.5 outline-none focus:border-[#915EFF] w-full text-xs"
              />
            </div>

            {image && (
              <div className="flex flex-col items-center">
                <p className="text-xs text-secondary mb-1">Avatar:</p>
                <img
                  src={getAsset(image)}
                  alt="preview"
                  className="w-16 h-16 object-cover rounded-full border border-[#915EFF]/30"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setEditingIndex(null)}
              className="bg-tertiary hover:bg-tertiary/75 px-4 py-2 rounded-lg cursor-pointer"
            >
              Atrás
            </button>
            <button
              onClick={saveItem}
              className="bg-[#915EFF] hover:bg-[#7e4ee0] text-white px-5 py-2 rounded-lg font-bold cursor-pointer"
            >
              Aplicar Cambios
            </button>
          </div>
        </div>
      )}
    </ModalWrapper>
  );
};
