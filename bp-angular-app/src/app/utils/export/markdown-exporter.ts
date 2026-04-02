export function exportMarkdown(data: any) {
  let md = '# Task Manager Export\n\n';
  md += 'App: Task Manager  \nVersion: 1.0  \n';
  const formattedDate = new Date(data.exportedAt).toLocaleString('cs-CZ', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  md += `Exported: ${formattedDate}\n\n`;
  if (data.user) md += `## User\n- ID: ${data.user.id}\n- Username: ${data.user.username}\n\n`;
  if (data.projects?.length) {
    md += '## Projects\n\n';
    data.projects.forEach((project: any) => {
      md += `### ${project.name}\n`;
      const relatedTasks = data.tasks ? data.tasks.filter((t: any) => t.projectId === project.id) : [];
      if (relatedTasks.length) relatedTasks.forEach((task: any) => (md += `- [ ] ${task.title}\n`));
      else md += '_No tasks_\n';
      md += '\n';
    });
  }
  md += `## Summary\n\nProjects: ${data.projects ? data.projects.length : 0}  \nTasks: ${data.tasks ? data.tasks.length : 0}\n`;
  return md;
}
