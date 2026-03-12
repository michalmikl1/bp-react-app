import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { exportData } from '../../utils/export/export-data';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-export-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './export-modal.component.html',
  styleUrl: './export-modal.component.css',
})
export class ExportModalComponent {
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  includeProjects = true;
  includeTasks = true;
  includeUser = false;
  format = 'json';
  warning = '';

  constructor(private userService: UserService) {}

  handleExport() {
    if (!this.includeProjects && !this.includeTasks && !this.includeUser) {
      this.warning = 'Musíte zvolit alespoň jednu možnost pro export.';
      setTimeout(() => (this.warning = ''), 5000);
      return;
    }
    exportData({
      includeProjects: this.includeProjects,
      includeTasks: this.includeTasks,
      includeUser: this.includeUser,
      format: this.format,
    }, this.userService);
    this.closed.emit();
  }
}
