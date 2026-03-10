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

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTask, setEditingTask] = useState({});
  const [editingDesc, setEditingDesc] = useState(false);
  const [descValue, setDescValue] = useState("");

  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [dueSoonOnly, setDueSoonOnly] = useState(false);

  useEffect(() => {
    const found = projectService.getProjectById(projectId);
    setProject(found);
    setTasks(taskService.getTasksByProjectId(projectId));
    setDescValue(found?.description || "");
  }, [projectId]);

  if (!project) {
    return (
      <div className="project-detail-container">
        <h2>Projekt nebyl nalezen</h2>
        <button className="back-btn" onClick={() => navigate("/")}>
          Zpět na projekty
        </button>
      </div>
    );
  }

  const refreshTasks = () => {
    setTasks(taskService.getTasksByProjectId(projectId));
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    taskService.createTask({ ...newTask, projectId });
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
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const confirmDelete = window.confirm(
      `Opravdu chcete smazat úkol "${task.title}"? Tuto akci nelze vrátit.`,
    );

    if (confirmDelete) {
      taskService.deleteTask(taskId);
      refreshTasks();
    }
  };

  const startEditingTask = (task) => {
    setEditingTaskId(task.id);
    setEditingTask({ ...task });
  };

  const saveTaskEdit = () => {
    if (!editingTask.title.trim()) return;
    taskService.updateTask(editingTask);
    refreshTasks();
    setEditingTaskId(null);
    setEditingTask({});
  };

  const statusCz = {
    [TaskStatus.TODO]: "Zpracovat",
    [TaskStatus.IN_PROGRESS]: "Probíhá",
    [TaskStatus.DONE]: "Hotovo",
  };

  const priorityCz = {
    [TaskPriority.LOW]: "Nízká",
    [TaskPriority.MEDIUM]: "Střední",
    [TaskPriority.HIGH]: "Vysoká",
  };

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === TaskStatus.TODO).length,
    inProgress: tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length,
    done: tasks.filter((t) => t.status === TaskStatus.DONE).length,
    high: tasks.filter((t) => t.priority === TaskPriority.HIGH).length,
  };

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter && t.status !== statusFilter) return false;
    if (priorityFilter && t.priority !== priorityFilter) return false;
    if (dueSoonOnly) {
      if (!t.dueDate) return false;
      const now = new Date();
      const due = new Date(t.dueDate);
      const diff = (due - now) / (1000 * 60 * 60 * 24);
      if (diff < 0 || diff > 1) return false;
    }
    return true;
  });

  const saveProjectDesc = () => {
    projectService.updateProject({ ...project, description: descValue });
    setProject({ ...project, description: descValue });
    setEditingDesc(false);
  };

  const cancelProjectDesc = () => {
    setDescValue(project.description || "");
    setEditingDesc(false);
  };

  return (
    <div className="project-detail-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Zpět
      </button>

      <div className="project-header" style={{ background: project.gradient }}>
        <h1 className="project-header-title">{project.name}</h1>

        {editingDesc ? (
          <div className="project-desc-edit-wrap">
            <textarea
              className="project-desc-input"
              value={descValue}
              onChange={(e) => setDescValue(e.target.value)}
            />
            <div className="project-desc-buttons">
              <button className="task-save-btn" onClick={saveProjectDesc}>
                Uložit
              </button>
              <button
                className="task-delete-button"
                onClick={cancelProjectDesc}
              >
                Zrušit
              </button>
            </div>
          </div>
        ) : (
          <p className="project-header-desc">
            {project.description || "Bez popisu"}{" "}
            <i
              className="fa-solid fa-pen-to-square edit-desc-icon"
              onClick={() => setEditingDesc(true)}
              title="Upravit popis"
            ></i>
          </p>
        )}

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
          <p>Probíhá</p>
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
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            />
            <select
              value={newTask.status}
              onChange={(e) =>
                setNewTask({ ...newTask, status: e.target.value })
              }
            >
              {Object.values(TaskStatus).map((s) => (
                <option key={s} value={s}>
                  {statusCz[s]}
                </option>
              ))}
            </select>
            <select
              value={newTask.priority}
              onChange={(e) =>
                setNewTask({ ...newTask, priority: e.target.value })
              }
            >
              {Object.values(TaskPriority).map((p) => (
                <option key={p} value={p}>
                  {priorityCz[p]}
                </option>
              ))}
            </select>
            <input
              type="date"
              required
              value={newTask.dueDate}
              onChange={(e) =>
                setNewTask({ ...newTask, dueDate: e.target.value })
              }
            />
            <button className="task-save-btn" type="submit">
              Uložit
            </button>
          </form>
        )}

        <div className="task-filters">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Všechny stavy</option>
            {Object.values(TaskStatus).map((s) => (
              <option key={s} value={s}>
                {statusCz[s]}
              </option>
            ))}
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">Všechny priority</option>
            {Object.values(TaskPriority).map((p) => (
              <option key={p} value={p}>
                {priorityCz[p]}
              </option>
            ))}
          </select>
          <label className="due-soon-label">
            <input
              type="checkbox"
              checked={dueSoonOnly}
              onChange={() => setDueSoonOnly(!dueSoonOnly)}
            />
            Úkoly do 1 dne
          </label>
        </div>

        <div className="task-grid">
          {filteredTasks.map((task) => {
            const isDueSoon = task.dueDate
              ? (new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24) <=
                1
              : false;

            return (
              <div
                key={task.id}
                className={`task-card ${isDueSoon ? "task-due-soon" : ""}`}
              >
                <div className="task-inner-card">
                  {editingTaskId === task.id ? (
                    <>
                      <input
                        className="task-card-title-input"
                        value={editingTask.title}
                        onChange={(e) =>
                          setEditingTask({
                            ...editingTask,
                            title: e.target.value,
                          })
                        }
                      />
                      <textarea
                        className="task-card-desc-input"
                        value={editingTask.description}
                        onChange={(e) =>
                          setEditingTask({
                            ...editingTask,
                            description: e.target.value,
                          })
                        }
                      />
                      <select
                        value={editingTask.status}
                        onChange={(e) =>
                          setEditingTask({
                            ...editingTask,
                            status: e.target.value,
                          })
                        }
                      >
                        {Object.values(TaskStatus).map((s) => (
                          <option key={s} value={s}>
                            {statusCz[s]}
                          </option>
                        ))}
                      </select>
                      <select
                        value={editingTask.priority}
                        onChange={(e) =>
                          setEditingTask({
                            ...editingTask,
                            priority: e.target.value,
                          })
                        }
                      >
                        {Object.values(TaskPriority).map((p) => (
                          <option key={p} value={p}>
                            {priorityCz[p]}
                          </option>
                        ))}
                      </select>
                      <input
                        type="date"
                        value={editingTask.dueDate}
                        onChange={(e) =>
                          setEditingTask({
                            ...editingTask,
                            dueDate: e.target.value,
                          })
                        }
                      />
                    </>
                  ) : (
                    <>
                      <h3 className="task-card-title">{task.title}</h3>
                      <p className="task-card-desc">{task.description}</p>
                      <p className="task-card-status">
                        Status: {statusCz[task.status]}
                      </p>
                      <p className="task-card-priority">
                        Priorita: {priorityCz[task.priority]}
                      </p>
                      {task.dueDate && (
                        <p className="task-card-enddate">
                          Termín dokončení:{" "}
                          {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </>
                  )}
                </div>

                <div className="task-card-buttons">
                  {editingTaskId === task.id ? (
                    <button className="task-save-btn" onClick={saveTaskEdit}>
                      Uložit změny
                    </button>
                  ) : (
                    <>
                      <button
                        className="task-button task-edit-btn"
                        onClick={() => startEditingTask(task)}
                      >
                        Upravit
                      </button>
                      <button
                        className="task-delete-button"
                        onClick={() => handleDelete(task.id)}
                      >
                        Smazat
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
