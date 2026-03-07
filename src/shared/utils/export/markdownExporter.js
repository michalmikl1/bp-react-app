export function exportMarkdown(data) {
  let md = "";

  // Metadata
  md += `# Task Manager Export\n\n`;
  md += `App: Task Manager  \n`;
  md += `Version: 1.0  \n`;

  const exportedDate = new Date(data.exportedAt);
  const formattedDate = exportedDate.toLocaleString("cs-CZ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  md += `Exported: ${formattedDate}\n\n`;

  // User
  if (data.user) {
    md += `## User\n`;
    md += `- ID: ${data.user.id}\n`;
    md += `- Username: ${data.user.username}\n\n`;
  }

  // Projects + Tasks
  if (data.projects && data.projects.length) {
    md += `## Projects\n\n`;

    data.projects.forEach((project) => {
      md += `### ${project.name}\n`;

      let relatedTasks = [];
      if (data.tasks) {
        relatedTasks = data.tasks.filter((t) => t.projectId === project.id);
      }

      if (relatedTasks.length) {
        relatedTasks.forEach((task) => {
          md += `- [ ] ${task.title}\n`;
        });
      } else {
        md += `_No tasks_\n`;
      }

      md += "\n";
    });
  }

  // Shrnutí
  const projectCount = data.projects ? data.projects.length : 0;
  const taskCount = data.tasks ? data.tasks.length : 0;

  md += `## Summary\n\n`;
  md += `Projects: ${projectCount}  \n`;
  md += `Tasks: ${taskCount}\n`;

  return md;
}
