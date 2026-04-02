export function exportCSV(data: any) {
  let csv = '';
  if (data.user) {
    csv += 'USER\n';
    csv += 'id,username\n';
    csv += `${data.user.id},${data.user.username}\n\n`;
  }
  if (data.projects?.length) {
    csv += 'PROJECTS\n';
    csv += Object.keys(data.projects[0]).join(',') + '\n';
    data.projects.forEach((p: any) => (csv += Object.values(p).join(',') + '\n'));
    csv += '\n';
  }
  if (data.tasks?.length) {
    csv += 'TASKS\n';
    csv += Object.keys(data.tasks[0]).join(',') + '\n';
    data.tasks.forEach((t: any) => (csv += Object.values(t).join(',') + '\n'));
  }
  return csv;
}
