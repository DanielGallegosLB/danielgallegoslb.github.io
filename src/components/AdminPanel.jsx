import React, { useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";

const AdminPanel = () => {
  const {
    portfolioData,
    isAdminMode,
    setIsAdminMode,
    githubToken,
    githubOwner,
    githubRepo,
    githubBranch,
    saveStatus,
    login,
    logout,
    savePortfolio,
    isDev,
  } = usePortfolio();

  const [isOpen, setIsOpen] = useState(false); // Controls the login/settings modal
  const [tokenInput, setTokenInput] = useState(githubToken);
  const [ownerInput, setOwnerInput] = useState(githubOwner);
  const [repoInput, setRepoInput] = useState(githubRepo);
  const [branchInput, setBranchInput] = useState(githubBranch);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!isDev && !tokenInput.trim()) {
      alert("En producción, se requiere un Token de Acceso Personal (PAT) de GitHub.");
      return;
    }
    login(tokenInput.trim(), ownerInput.trim(), repoInput.trim(), branchInput.trim());
    setIsOpen(false);
  };

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(portfolioData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "portfolio-data.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Toggle global edit mode
  const handleToggleAdmin = () => {
    if (isAdminMode) {
      logout();
    } else {
      setIsOpen(true);
    }
  };

  // Trigger from the floating button or lock in Navbar
  React.useEffect(() => {
    const handleOpenAdmin = () => setIsOpen(true);
    window.addEventListener("open-admin-panel", handleOpenAdmin);
    return () => window.removeEventListener("open-admin-panel", handleOpenAdmin);
  }, []);

  return (
    <>
      {/* 1. FLOATING CONTROLLER FOR LOGGED IN ADMIN */}
      {isAdminMode && (
        <div
          className={`fixed z-[9999] transition-all duration-300 ${
            isMinimized
              ? "bottom-5 right-5 w-12 h-12"
              : "bottom-5 left-5 right-5 md:left-auto md:right-5 md:w-[480px]"
          }`}
        >
          {isMinimized ? (
            <button
              onClick={() => setIsMinimized(false)}
              className="w-12 h-12 rounded-full bg-[#915EFF] hover:bg-[#7e4ee0] text-white flex items-center justify-center shadow-xl cursor-pointer transition-colors"
              title="Abrir Panel de Control"
            >
              🛠️
            </button>
          ) : (
            <div className="bg-[#151030]/90 backdrop-blur-md border border-[#915EFF] p-4 rounded-2xl shadow-2xl text-white flex flex-col gap-3">
              <div className="flex justify-between items-center border-b border-[#915EFF]/20 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <h4 className="font-bold text-sm text-white">Panel de Administrador</h4>
                  <span className="text-[10px] bg-[#915EFF]/20 text-[#915EFF] px-1.5 py-0.5 rounded">
                    {isDev && !githubToken ? "Local (Dev)" : "GitHub"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="text-secondary hover:text-white text-xs cursor-pointer px-1.5 py-0.5 rounded bg-tertiary"
                  >
                    Minimizar
                  </button>
                </div>
              </div>

              <p className="text-[12px] text-secondary">
                Estás en <strong>Modo Edición</strong>. Puedes hacer clic en los textos marcados con bordes punteados violetas para editarlos directamente.
              </p>

              {/* Status Indicator */}
              {saveStatus.loading && (
                <div className="text-[12px] text-[#915EFF] font-semibold flex items-center gap-1.5">
                  <span className="w-3 h-3 border-2 border-[#915EFF] border-t-transparent rounded-full animate-spin"></span>
                  Guardando cambios en {isDev && !githubToken ? "el servidor local..." : "GitHub..."}
                </div>
              )}
              {saveStatus.success && (
                <div className="text-[12px] text-emerald-400 font-semibold">
                  ✓ ¡Cambios guardados con éxito!
                </div>
              )}
              {saveStatus.error && (
                <div className="text-[12px] text-red-400 font-semibold max-h-16 overflow-y-auto">
                  ⚠ Error: {saveStatus.error}
                </div>
              )}

              {/* Actions Grid */}
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={() => savePortfolio()}
                  disabled={saveStatus.loading}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-55 text-white py-2 px-3 rounded-lg font-bold text-xs cursor-pointer transition-colors"
                >
                  {isDev && !githubToken ? "Guardar en Local" : "Guardar en GitHub"}
                </button>
                <button
                  onClick={handleDownloadJson}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg font-bold text-xs cursor-pointer transition-colors"
                >
                  Descargar JSON
                </button>
              </div>

              <div className="flex justify-between items-center border-t border-[#915EFF]/20 pt-2 mt-1">
                <button
                  onClick={() => setIsOpen(true)}
                  className="text-[11px] text-secondary hover:text-[#915EFF] underline cursor-pointer"
                >
                  Ajustes de GitHub
                </button>
                <button
                  onClick={logout}
                  className="text-[11px] text-red-400 hover:text-red-300 font-bold cursor-pointer"
                >
                  Salir Modo Editor
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. LOGIN / SETTINGS MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#151030] border border-[#915EFF] w-full max-w-md rounded-2xl shadow-2xl p-6 text-white">
            <h3 className="text-xl font-bold mb-2 text-[#915EFF] flex items-center gap-2">
              🔒 Acceso de Administrador
            </h3>
            <p className="text-xs text-secondary mb-4 leading-relaxed">
              Inicia sesión como administrador para habilitar la edición de tu portafolio. 
              {isDev ? (
                <span className="text-emerald-400 block mt-1 font-semibold">
                  💡 Estás ejecutando el proyecto en Local. Puedes entrar sin token de GitHub para guardar directamente en tu disco duro.
                </span>
              ) : (
                <span className="text-amber-400 block mt-1 font-semibold">
                  💡 Estás en producción. Se requiere un Token de Acceso Personal (PAT) de GitHub con permisos de escritura de repositorio para poder guardar y desplegar automáticamente en GitHub Pages.
                </span>
              )}
            </p>

            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-white-100">
                  GitHub Personal Access Token (PAT)
                </label>
                <input
                  type="password"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder={isDev ? "Opcional en local..." : "ghp_xxxxxxxxxxxxxxxxxxxx"}
                  className="bg-[#1d1836] border border-[#915EFF]/30 rounded-lg p-2.5 outline-none focus:border-[#915EFF] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-white-100">Usuario GitHub</label>
                  <input
                    type="text"
                    value={ownerInput}
                    onChange={(e) => setOwnerInput(e.target.value)}
                    placeholder="DanielGallegosLB"
                    className="bg-[#1d1836] border border-[#915EFF]/30 rounded-lg p-2.5 outline-none focus:border-[#915EFF] text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-white-100">Repositorio</label>
                  <input
                    type="text"
                    value={repoInput}
                    onChange={(e) => setRepoInput(e.target.value)}
                    placeholder="danielgallegoslb.github.io"
                    className="bg-[#1d1836] border border-[#915EFF]/30 rounded-lg p-2.5 outline-none focus:border-[#915EFF] text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-white-100">Rama (Branch)</label>
                <input
                  type="text"
                  value={branchInput}
                  onChange={(e) => setBranchInput(e.target.value)}
                  placeholder="main"
                  className="bg-[#1d1836] border border-[#915EFF]/30 rounded-lg p-2.5 outline-none focus:border-[#915EFF] text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-[#915EFF]/20">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="bg-tertiary hover:bg-tertiary/70 text-white text-xs px-4 py-2.5 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#915EFF] hover:bg-[#7e4ee0] text-white text-xs px-4 py-2.5 rounded-lg font-bold cursor-pointer transition-colors"
                >
                  {isAdminMode ? "Guardar Ajustes" : "Iniciar Sesión"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPanel;
