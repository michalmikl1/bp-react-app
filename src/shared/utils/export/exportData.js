import { exportJSON } from "./jsonExporter";
import { exportCSV } from "./csvExporter";
import { exportMarkdown } from "./markdownExporter";
import { downloadFile } from "./downloadFile";

import userService from "../../../app/services/userService";

function loadLocalStorageData() {
  const projects = JSON.parse(localStorage.getItem("projects") || "[]");
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

  const currentUser = userService.getCurrentUser();

  return {
    projects,
    tasks,
    user: currentUser,
  };
}

export function exportData(options) {
  const { includeProjects, includeTasks, includeUser, format } = options;

  const storageData = loadLocalStorageData();

  const exportObject = {
    app: "task-manager",
    version: "1.0",
    exportedAt: new Date().toISOString(),
  };

  if (includeProjects) exportObject.projects = storageData.projects;
  if (includeTasks) exportObject.tasks = storageData.tasks;

  if (includeUser && storageData.user) {
    exportObject.user = {
      id: storageData.user.id,
      username: storageData.user.username,
    };
  }

  let content = "";
  let extension = "txt";
  let type = "text/plain";

  if (format === "json") {
    content = exportJSON(exportObject);
    extension = "json";
    type = "application/json";
  }

  if (format === "csv") {
    content = exportCSV(exportObject);
    extension = "csv";
    type = "text/csv";
  }

  if (format === "md") {
    content = exportMarkdown(exportObject);
    extension = "md";
    type = "text/markdown";
  }

  const username = storageData.user?.username || "user";

  const filename = `task-manager-${username}-${Date.now()}.${extension}`;

  downloadFile(content, filename, type);
}
