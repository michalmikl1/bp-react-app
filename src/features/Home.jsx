import { useState, useEffect } from "react";
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

  const navigate = useNavigate();

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
      ownerId: 1,
    });

    setProjects(projectService.getProjects());
    setNewProjectName("");
    setNewProjectDescription("");
    setError("");
  };

  const handleDelete = (id) => {
    projectService.deleteProject(id);
    setProjects(projectService.getProjects());
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

  // Zkrácení popisu na max 60 znaků
  const truncateDescription = (desc) =>
    desc.length > 30 ? desc.slice(0, 27) + "..." : desc;

  return (
    <div className="home-container">
      <h1 className="home-title">Vítejte v Task Manageru</h1>
      <hr />

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

      {projects.length === 0 ? (
        <p className="home-empty">Žádné projekty zatím nejsou vytvořené.</p>
      ) : (
        <div className="home-project-grid">
          {projects.map((project) => (
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
                    handleDelete(project.id);
                  }}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
