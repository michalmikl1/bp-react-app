import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import projectService from "../../app/services/project.service";
import taskService from "../../app/services/task.service";
import {
  TaskStatus,
  TaskPriority,
} from "../../shared/constants/task.constants";
import "./projectDetail.css";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const projectId = Number(id);

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [formVisible, setFormVisible] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    dueDate: "",
  });

  useEffect(() => {
    const found = projectService.getProjectById(projectId);
    setProject(found);
    setTasks(taskService.getTasksByProjectId(projectId));
  }, [projectId]);

  if (!project) {
    return (
      <div className="project-detail-container">
        <h2>Projekt nebyl nalezen</h2>
        <button onClick={() => navigate("/")}>Zpět na projekty</button>
      </div>
    );
  }

  const refreshTasks = () => {
    setTasks(taskService.getTasksByProjectId(projectId));
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    taskService.createTask({
      ...newTask,
      projectId,
    });

    refreshTasks();
    setFormVisible(false);
    setNewTask({
      title: "",
      description: "",
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      dueDate: "",
    });
  };

  const handleDelete = (taskId) => {
    taskService.deleteTask(taskId);
    refreshTasks();
  };

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === TaskStatus.TODO).length,
    inProgress: tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length,
    done: tasks.filter((t) => t.status === TaskStatus.DONE).length,
    high: tasks.filter((t) => t.priority === TaskPriority.HIGH).length,
  };

  return (
    <div className="project-detail-container">
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Zpět
      </button>

      <div className="project-header" style={{ background: project.gradient }}>
        <h1 className="project-header-title">{project.name}</h1>
        <p className="project-header-desc">
          {project.description || "Bez popisu"}
        </p>
        <span className="project-header-date">
          Datum vytvoření: {new Date(project.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <h3>{stats.total}</h3>
          <p>Celkem</p>
        </div>
        <div className="stat-box">
          <h3>{stats.todo}</h3>
          <p>TODO</p>
        </div>
        <div className="stat-box">
          <h3>{stats.inProgress}</h3>
          <p>In Progress</p>
        </div>
        <div className="stat-box">
          <h3>{stats.done}</h3>
          <p>Hotovo</p>
        </div>
        <div className="stat-box">
          <h3>{stats.high}</h3>
          <p>Vysoká priorita</p>
        </div>
      </div>

      <div className="tasks-section">
        <div className="tasks-header">
          <h2 className="tasks-title">Úkoly</h2>
          <button
            className="task-button"
            onClick={() => setFormVisible(!formVisible)}
          >
            {formVisible ? "Zavřít" : "Přidat úkol"}
          </button>
        </div>

        {formVisible && (
          <form className="task-form" onSubmit={handleCreateTask}>
            <input
              type="text"
              placeholder="Název úkolu"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              required
            />

            <textarea
              placeholder="Popis"
              required
              value={newTask.description}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  description: e.target.value,
                })
              }
            />

            <select
              value={newTask.status}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  status: e.target.value,
                })
              }
            >
              {Object.values(TaskStatus).map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <select
              value={newTask.priority}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  priority: e.target.value,
                })
              }
            >
              {Object.values(TaskPriority).map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>

            <input
              type="date"
              required
              value={newTask.dueDate}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  dueDate: e.target.value,
                })
              }
            />

            <button className="task-save-btn" type="submit">
              Uložit
            </button>
          </form>
        )}

        <div className="task-grid">
          {tasks.map((task) => (
            <div key={task.id} className="task-card">
              <h3 className="task-card-title">{task.title}</h3>
              <p className="task-card-desc">{task.description}</p>
              <p className="task-card-status">Status: {task.status}</p>
              <p className="task-card-priority">Priorita: {task.priority}</p>
              {task.dueDate && (
                <p className="task-card-enddate">
                  Termín dokončení:{" "}
                  {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}
              <button
                className="task-delete-button"
                onClick={() => handleDelete(task.id)}
              >
                Smazat
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
