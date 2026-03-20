import taskService from "../../app/services/task.service";
import "./dashboard.css";

export default function Dashboard({ projects }) {
  const tasks = taskService.getTasks();

  const totalProjects = projects.length;
  const totalTasks = tasks.length;

  const tasksByStatus = {
    TODO: tasks.filter((t) => t.status === "TODO").length,
    IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    DONE: tasks.filter((t) => t.status === "DONE").length,
  };

  const tasksByPriority = {
    LOW: tasks.filter((t) => t.priority === "LOW").length,
    MEDIUM: tasks.filter((t) => t.priority === "MEDIUM").length,
    HIGH: tasks.filter((t) => t.priority === "HIGH").length,
  };

  const tasksDueSoon = tasks.filter((t) => {
    if (!t.dueDate) return false;
    const now = new Date();
    const due = new Date(t.dueDate);
    const diff = (due - now) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 1;
  }).length;

  return (
    <div className="db-container">
      <div className="db-stats-grid">
        <div className="db-stat-box">
          <h3>Projekty celkem</h3>
          <p>{totalProjects}</p>
        </div>
        <div className="db-stat-box">
          <h3>Úkoly celkem</h3>
          <p>{totalTasks}</p>
        </div>
        <div className="db-stat-box">
          <h3>Úkoly podle stavu</h3>
          <p>Zpracovat: {tasksByStatus.TODO}</p>
          <p>Probíhá: {tasksByStatus.IN_PROGRESS}</p>
          <p>Hotovo: {tasksByStatus.DONE}</p>
        </div>
        <div className="db-stat-box">
          <h3>Úkoly podle priority</h3>
          <p>Nízká: {tasksByPriority.LOW}</p>
          <p>Střední: {tasksByPriority.MEDIUM}</p>
          <p>Vysoká: {tasksByPriority.HIGH}</p>
        </div>
        <div className="db-stat-box">
          <h3>Úkoly s termínem do 1 dne</h3>
          <p>{tasksDueSoon}</p>
        </div>
      </div>
    </div>
  );
}
