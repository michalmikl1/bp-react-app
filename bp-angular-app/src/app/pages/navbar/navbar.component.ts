import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { ExportModalComponent } from '../../shared/export-modal/export-modal.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, ExportModalComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  user: any = null;
  menuOpen = false;
  isExportOpen = false;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void { this.user = this.userService.getCurrentUser(); }

  handleLogout() {
    this.userService.logout();
    this.user = null;
    this.menuOpen = false;
    this.router.navigate(['/login']);
  }
}
