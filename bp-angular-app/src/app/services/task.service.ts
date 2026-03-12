import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

const KEY = 'tasks';

@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(private storage: StorageService) {}

  getTasks(): any[] { return this.storage.get<any>(KEY) || []; }
  getTasksByProjectId(projectId: number): any[] { return this.getTasks().filter((t) => t.projectId === projectId); }
  getTaskById(taskId: number): any { return this.getTasks().find((t) => t.id === taskId); }

  createTask(task: any): any {
    const tasks = this.getTasks();
    const newTask = { ...task, id: Date.now(), createdAt: new Date().toISOString() };
    tasks.push(newTask);
    this.storage.set(KEY, tasks);
    return newTask;
  }

  updateTask(updatedTask: any): void {
    const tasks = this.getTasks().map((t) => (t.id === updatedTask.id ? { ...t, ...updatedTask } : t));
    this.storage.set(KEY, tasks);
  }

  deleteTask(taskId: number): void { this.storage.set(KEY, this.getTasks().filter((t) => t.id !== taskId)); }
  deleteTasksByProjectId(projectId: number): void { this.storage.set(KEY, this.getTasks().filter((t) => t.projectId !== projectId)); }
}
