import { Injectable } from '@angular/core';
import { getRandomGradient } from '../constants/project-gradient-colors';
import { StorageService } from './storage.service';
import { TaskService } from './task.service';

const KEY = 'projects';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  constructor(private storage: StorageService, private taskService: TaskService) {}

  getProjects(): any[] { return this.storage.get<any>(KEY) || []; }
  getProjectById(id: number): any { return this.getProjects().find((p) => p.id === id); }

  createProject(project: any): any {
    const projects = this.getProjects();
    const newProject = { ...project, id: Date.now(), createdAt: new Date().toISOString(), gradient: getRandomGradient() };
    projects.push(newProject);
    this.storage.set(KEY, projects);
    return newProject;
  }

  updateProject(updated: any): void {
    this.storage.set(KEY, this.getProjects().map((p) => (p.id === updated.id ? { ...p, ...updated } : p)));
  }

  deleteProject(id: number): void {
    this.storage.set(KEY, this.getProjects().filter((p) => p.id !== id));
    this.taskService.deleteTasksByProjectId(id);
  }
}
