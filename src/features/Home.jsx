import { useState, useEffect } from "react";
import Dashboard from "./dashboard/Dashboard";
import projectService from "../app/services/project.service";
import "./home.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [error, setError] = useState("");
  const [filterText, setFilterText] = useState("");
  const [deleteModal, setDeleteModal] = useState(null);
  const [confirmName, setConfirmName] = useState("");

  const navigate = useNavigate();

  // načtení projektů
  useEffect(() => {
    setProjects(projectService.getProjects());
  }, []);

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(""), 5000);
    return () => clearTimeout(timer);
  }, [error]);

  const projectNameExists = (name, ignoreId = null) =>
    projects.some(
      (p) => p.name.toLowerCase() === name.toLowerCase() && p.id !== ignoreId,
    );

  const handleAddProject = (e) => {
    e.preventDefault();
    const trimmedName = newProjectName.trim();
    const trimmedDescription = newProjectDescription.trim();

    if (!trimmedName) {
      setError("Název projektu nesmí být prázdný.");
      return;
    }

    if (projectNameExists(trimmedName)) {
      setError("Projekt s tímto názvem již existuje.");
      return;
    }

    projectService.createProject({
      name: trimmedName,
      description: trimmedDescription,
    });

    setProjects(projectService.getProjects());
    setNewProjectName("");
    setNewProjectDescription("");
    setError("");
  };

  const handleDelete = () => {
    if (!deleteModal) return;

    projectService.deleteProject(deleteModal.id);
    setProjects(projectService.getProjects());

    setDeleteModal(null);
    setConfirmName("");
  };

  const startEditing = (project) => {
    setEditingId(project.id);
    setEditName(project.name);
  };

  const saveEdit = (id) => {
    const project = projectService.getProjectById(id);
    const trimmedName = editName.trim();

    if (!trimmedName || projectNameExists(trimmedName, id)) {
      setEditingId(null);
      return;
    }

    projectService.updateProject({
      ...project,
      name: trimmedName,
    });

    setProjects(projectService.getProjects());
    setEditingId(null);
  };

  const truncateDescription = (desc) =>
    desc.length > 30 ? desc.slice(0, 30) + "..." : desc;

  // filtrování projektů podle názvu
  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(filterText.toLowerCase()),
  );

  return (
    <div className="home-container">
      <h1 className="home-title">Vítejte v Task Manageru</h1>
      <hr />

      <h2 className="home-projects-title" id="home-projects-dashboard-title">
        Dashboard
      </h2>
      <Dashboard projects={projects} />

      <h2 className="home-projects-title">Vaše projekty</h2>

      <div className="project-create-wrap">
        <h3>Vytvořte projekt</h3>
        <form onSubmit={handleAddProject} className="project-create-form">
          <input
            type="text"
            placeholder="Název projektu"
            value={newProjectName}
            onChange={(e) => {
              setNewProjectName(e.target.value);
              if (error) setError("");
            }}
          />
          <textarea
            placeholder="Popis projektu (nepovinné)"
            value={newProjectDescription}
            onChange={(e) => setNewProjectDescription(e.target.value)}
          />
          <button type="submit">Vytvořit</button>
        </form>
        {error && <p className="project-create-error">{error}</p>}
      </div>

      {projects.length > 0 && (
        <div className="project-filter">
          <h3>Vyhledejte konkrétní projekt</h3>
          <input
            type="text"
            placeholder="Filtrovat projekty podle názvu ..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
      )}

      {filteredProjects.length === 0 ? (
        <p className="home-empty">Žádné projekty nenalezeny.</p>
      ) : (
        <div className="home-project-grid">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="project-card"
              style={{ background: project.gradient }}
              onClick={() => {
                if (!editingId) navigate(`/projects/${project.id}`);
              }}
            >
              {editingId === project.id ? (
                <input
                  className="project-name-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={() => saveEdit(project.id)}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit(project.id)}
                  autoFocus
                />
              ) : (
                <>
                  <h3 className="project-name">{project.name}</h3>
                  {project.description && (
                    <p className="project-description">
                      {truncateDescription(project.description)}
                    </p>
                  )}
                </>
              )}
              <p className="project-date">
                Vytvořeno: {new Date(project.createdAt).toLocaleDateString()}
              </p>

              <div className="project-btns">
                <button
                  className="project-edit-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    startEditing(project);
                  }}
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
                <button
                  className="project-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteModal(project);
                  }}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {deleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h3>Smazat projekt</h3>

            <p>
              Opravdu chcete smazat projekt <b>{deleteModal.name}</b>?
            </p>

            <p>Pro potvrzení napište název projektu:</p>

            <input
              type="text"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              placeholder="Název projektu"
            />

            <div className="delete-modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => {
                  setDeleteModal(null);
                  setConfirmName("");
                }}
              >
                Zrušit
              </button>

              <button
                className="confirm-btn"
                disabled={confirmName !== deleteModal.name}
                onClick={handleDelete}
              >
                Smazat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
