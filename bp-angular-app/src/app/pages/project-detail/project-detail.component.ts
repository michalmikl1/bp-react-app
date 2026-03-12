import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { TaskPriority, TaskStatus } from '../../constants/task.constants';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css',
})
export class ProjectDetailComponent implements OnInit {
  projectId = 0;
  project: any = null;
  tasks: any[] = [];
  formVisible = false;
  newTask: any = { title: '', description: '', status: TaskStatus.TODO, priority: TaskPriority.MEDIUM, dueDate: '' };
  editingTaskId: number | null = null;
  editingTask: any = {};
  editingDesc = false;
  descValue = '';
  statusFilter = '';
  priorityFilter = '';
  dueSoonOnly = false;
  statusValues = Object.values(TaskStatus);
  priorityValues = Object.values(TaskPriority);
  statusCz: any = { TODO: 'Zpracovat', IN_PROGRESS: 'Probíhá', DONE: 'Hotovo' };
  priorityCz: any = { LOW: 'Nízká', MEDIUM: 'Střední', HIGH: 'Vysoká' };

  constructor(private route: ActivatedRoute, public router: Router, private projectService: ProjectService, private taskService: TaskService) {}

  ngOnInit() {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.project = this.projectService.getProjectById(this.projectId);
    this.tasks = this.taskService.getTasksByProjectId(this.projectId);
    this.descValue = this.project?.description || '';
  }

  refreshTasks() { this.tasks = this.taskService.getTasksByProjectId(this.projectId); }
  createTask(event: Event) { event.preventDefault(); if (!this.newTask.title.trim()) return; this.taskService.createTask({ ...this.newTask, projectId: this.projectId }); this.refreshTasks(); this.formVisible = false; this.newTask = { title: '', description: '', status: TaskStatus.TODO, priority: TaskPriority.MEDIUM, dueDate: '' }; }
  deleteTask(id: number) { const task = this.tasks.find((t) => t.id === id); if (task && window.confirm(`Opravdu chcete smazat úkol "${task.title}"? Tuto akci nelze vrátit.`)) { this.taskService.deleteTask(id); this.refreshTasks(); } }
  startEdit(task: any) { this.editingTaskId = task.id; this.editingTask = { ...task }; }
  saveTaskEdit() { if (!this.editingTask.title.trim()) return; this.taskService.updateTask(this.editingTask); this.editingTaskId = null; this.editingTask = {}; this.refreshTasks(); }
  saveProjectDesc() { this.projectService.updateProject({ ...this.project, description: this.descValue }); this.project = { ...this.project, description: this.descValue }; this.editingDesc = false; }

  get filteredTasks() {
    return this.tasks.filter((t) => {
      if (this.statusFilter && t.status !== this.statusFilter) return false;
      if (this.priorityFilter && t.priority !== this.priorityFilter) return false;
      if (this.dueSoonOnly) { if (!t.dueDate) return false; const diff = (new Date(t.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24); if (diff < 0 || diff > 1) return false; }
      return true;
    });
  }
}
