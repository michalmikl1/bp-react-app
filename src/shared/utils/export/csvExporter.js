export function exportCSV(data) {
  let csv = "";

  if (data.user) {
    csv += "USER\n";
    csv += "id,username\n";
    csv += `${data.user.id},${data.user.username}\n\n`;
  }

  if (data.projects && data.projects.length) {
    csv += "PROJECTS\n";

    const headers = Object.keys(data.projects[0]).join(",");
    csv += headers + "\n";

    data.projects.forEach((p) => {
      csv += Object.values(p).join(",") + "\n";
    });

    csv += "\n";
  }

  if (data.tasks && data.tasks.length) {
    csv += "TASKS\n";

    const headers = Object.keys(data.tasks[0]).join(",");
    csv += headers + "\n";

    data.tasks.forEach((t) => {
      csv += Object.values(t).join(",") + "\n";
    });
  }

  return csv;
}
