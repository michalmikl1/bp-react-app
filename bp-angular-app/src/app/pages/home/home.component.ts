import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ProjectService } from '../../services/project.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, DashboardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  projects: any[] = [];
  editingId: number | null = null;
  editName = '';
  newProjectName = '';
  newProjectDescription = '';
  error = '';
  filterText = '';
  deleteModal: any = null;
  confirmName = '';

  constructor(private projectService: ProjectService, private router: Router) {}
  ngOnInit(): void { this.projects = this.projectService.getProjects(); }
  goToProject(id: number) { this.router.navigate(['/projects', id]); }
  handleAddProject(event: Event) { event.preventDefault(); const trimmedName = this.newProjectName.trim(); if (!trimmedName) return (this.error = 'Název projektu nesmí být prázdný.'); if (this.projects.some((p) => p.name.toLowerCase() === trimmedName.toLowerCase())) return (this.error = 'Projekt s tímto názvem již existuje.'); this.projectService.createProject({ name: trimmedName, description: this.newProjectDescription.trim(), ownerId: 1 }); this.projects = this.projectService.getProjects(); this.newProjectName = ''; this.newProjectDescription = ''; this.error = ''; }
  saveEdit(id: number) { const trimmedName = this.editName.trim(); if (!trimmedName) return (this.editingId = null); if (this.projects.some((p) => p.id !== id && p.name.toLowerCase() === trimmedName.toLowerCase())) return (this.editingId = null); const project = this.projectService.getProjectById(id); this.projectService.updateProject({ ...project, name: trimmedName }); this.projects = this.projectService.getProjects(); this.editingId = null; }
  deleteProject() { this.projectService.deleteProject(this.deleteModal.id); this.projects = this.projectService.getProjects(); this.deleteModal = null; this.confirmName = ''; }
  get filteredProjects() { return this.projects.filter((p) => p.name.toLowerCase().includes(this.filterText.toLowerCase())); }
  truncateDescription(desc: string) { return desc?.length > 30 ? `${desc.slice(0, 30)}...` : desc; }
}
