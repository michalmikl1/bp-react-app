import { exportJSON } from './json-exporter';
import { exportCSV } from './csv-exporter';
import { exportMarkdown } from './markdown-exporter';
import { downloadFile } from './download-file';
import { UserService } from '../../services/user.service';

function loadLocalStorageData(userService: UserService) {
  const projects = JSON.parse(localStorage.getItem('projects') || '[]');
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  return { projects, tasks, user: userService.getCurrentUser() };
}

export function exportData(options: any, userService: UserService) {
  const { includeProjects, includeTasks, includeUser, format } = options;
  const storageData = loadLocalStorageData(userService);
  const exportObject: any = { app: 'task-manager', version: '1.0', exportedAt: new Date().toISOString() };
  if (includeProjects) exportObject.projects = storageData.projects;
  if (includeTasks) exportObject.tasks = storageData.tasks;
  if (includeUser && storageData.user) exportObject.user = { id: storageData.user.id, username: storageData.user.username };

  let content = ''; let extension = 'txt'; let type = 'text/plain';
  if (format === 'json') { content = exportJSON(exportObject); extension = 'json'; type = 'application/json'; }
  if (format === 'csv') { content = exportCSV(exportObject); extension = 'csv'; type = 'text/csv'; }
  if (format === 'md') { content = exportMarkdown(exportObject); extension = 'md'; type = 'text/markdown'; }

  const filename = `task-manager-${storageData.user?.username || 'user'}-${Date.now()}.${extension}`;
  downloadFile(content, filename, type);
}
