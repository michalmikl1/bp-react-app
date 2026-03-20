import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import taskService from "../../app/services/task.service.js";
import projectService from "../../app/services/project.service.js";
import "./upcoming.css";

export default function Upcoming() {
  const [upcomingTasks, setUpcomingTasks] = useState({});

  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const refreshTasks = () => {
    const projects = projectService.getProjects();
    const tasks = taskService.getTasks();

    const daysAhead = 90; // 3 měsíce
    const today = new Date();
    const upcoming = {};

    for (let i = 0; i <= daysAhead; i++) {
      const day = new Date();
      day.setDate(today.getDate() + i);

      const key = formatLocalDate(day);

      let tasksForDay = tasks
        .filter((task) => task.dueDate === key)
        .map((task) => {
          const project = projects.find((p) => p.id === task.projectId);
          return {
            ...task,
            projectName: project ? project.name : "Bez projektu",
            projectGradient: project ? project.gradient : null,
            projectId: project ? project.id : null,
          };
        });

      // Seřadíme podle projectName
      tasksForDay.sort((a, b) => {
        if (a.projectName < b.projectName) return -1;
        if (a.projectName > b.projectName) return 1;
        return 0;
      });

      upcoming[key] = tasksForDay;
    }

    setUpcomingTasks(upcoming);
  };

  useEffect(() => {
    refreshTasks();
    // Aktualizuj zadávky každých 30 sekund, aby se dynamicky aktualizovaly
    const interval = setInterval(refreshTasks, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("cs-CZ", options);
  };

  return (
    <div className="upcoming-container">
      <h2>Nadcházející úkoly</h2>

      {Object.keys(upcomingTasks).map((date) => (
        <div
          key={date}
          className={`day-block ${upcomingTasks[date].length > 0 ? "has-tasks" : ""}`}
        >
          <h3>{formatDate(date)}</h3>

          {upcomingTasks[date].length > 0 ? (
            <ul>
              {upcomingTasks[date].map((task) => (
                <li key={task.id} className={task.completed ? "completed" : ""}>
                  <Link
                    to={task.projectId ? `/projects/${task.projectId}` : "#"}
                    className={`task-link ${task.completed ? "task-completed" : ""}`}
                    title={`[${task.projectName}] ${task.title}`}
                  >
                    <span className="task-project">[{task.projectName}]</span>{" "}
                    <span className="task-title">{task.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-tasks">Žádné úkoly</p>
          )}
        </div>
      ))}
    </div>
  );
}
