import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './upcoming.component.html',
  styleUrl: './upcoming.component.css',
})
export class UpcomingComponent implements OnInit {
  Object = Object;
  upcomingTasks: Record<string, any[]> = {};
  constructor(private projectService: ProjectService, private taskService: TaskService) {}
  ngOnInit() { const projects = this.projectService.getProjects(); const tasks = this.taskService.getTasks(); const today = new Date(); for (let i = 0; i <= 90; i++) { const day = new Date(); day.setDate(today.getDate() + i); const key = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`; this.upcomingTasks[key] = tasks.filter((task) => task.dueDate === key).map((task) => { const project = projects.find((p) => p.id === task.projectId); return { ...task, projectName: project ? project.name : 'Bez projektu', projectId: project ? project.id : null }; }).sort((a, b) => (a.projectName < b.projectName ? -1 : a.projectName > b.projectName ? 1 : 0)); } }
  formatDate(dateString: string) { return new Date(dateString).toLocaleDateString('cs-CZ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); }
}
