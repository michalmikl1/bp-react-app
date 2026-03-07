import { useState, useEffect } from "react";
import { exportData } from "../../utils/export/exportData.js";
import "./exportmodal.css";

export default function ExportModal({ isOpen, onClose }) {
  const [includeProjects, setIncludeProjects] = useState(true);
  const [includeTasks, setIncludeTasks] = useState(true);
  const [includeUser, setIncludeUser] = useState(false);
  const [format, setFormat] = useState("json");
  const [warning, setWarning] = useState("");

  useEffect(() => {
    if (!warning) return;
    const timer = setTimeout(() => setWarning(""), 5000);
    return () => clearTimeout(timer);
  }, [warning]);

  const handleExport = () => {
    if (!includeProjects && !includeTasks && !includeUser) {
      setWarning("Musíte zvolit alespoň jednu možnost pro export!");
      return;
    }

    exportData({
      includeProjects,
      includeTasks,
      includeUser,
      format,
    });

    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="export-overlay" onClick={onClose}>
          <div className="export-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Data pro export</h2>

            {warning && <div className="export-warning">{warning}</div>}

            <div className="export-section">
              <h3>Co exportovat</h3>

              <label className="export-option">
                <input
                  type="checkbox"
                  checked={includeProjects}
                  onChange={(e) => setIncludeProjects(e.target.checked)}
                />
                Projekty
              </label>

              <label className="export-option">
                <input
                  type="checkbox"
                  checked={includeTasks}
                  onChange={(e) => setIncludeTasks(e.target.checked)}
                />
                Úkoly
              </label>

              <label className="export-option">
                <input
                  type="checkbox"
                  checked={includeUser}
                  onChange={(e) => setIncludeUser(e.target.checked)}
                />
                Uživatelské informace
              </label>
            </div>

            <div className="export-section">
              <h3>Formát</h3>

              <label className="export-option">
                <input
                  type="radio"
                  value="json"
                  checked={format === "json"}
                  onChange={(e) => setFormat(e.target.value)}
                />
                JSON
              </label>

              <label className="export-option">
                <input
                  type="radio"
                  value="csv"
                  checked={format === "csv"}
                  onChange={(e) => setFormat(e.target.value)}
                />
                CSV
              </label>

              <label className="export-option">
                <input
                  type="radio"
                  value="md"
                  checked={format === "md"}
                  onChange={(e) => setFormat(e.target.value)}
                />
                Markdown
              </label>
            </div>

            <div className="export-buttons">
              <button
                className="export-btn export-btn-secondary"
                onClick={onClose}
              >
                Zrušit
              </button>

              <button
                className="export-btn export-btn-primary"
                onClick={handleExport}
              >
                Exportovat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
