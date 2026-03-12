import { Component, Input } from '@angular/core';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  @Input() projects: any[] = [];
  constructor(private taskService: TaskService) {}
  get tasks() { return this.taskService.getTasks(); }
  countByStatus(status: string) { return this.tasks.filter((t) => t.status === status).length; }
  countByPriority(priority: string) { return this.tasks.filter((t) => t.priority === priority).length; }
  get dueSoonCount() { return this.tasks.filter((t) => t.dueDate && ((new Date(t.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24) >= 0) && ((new Date(t.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24) <= 1)).length; }
}
