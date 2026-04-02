import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  username = '';
  password = '';
  error = '';
  constructor(private userService: UserService, private router: Router) {}

  handleRegister(event: Event) {
    event.preventDefault();
    try {
      this.userService.register({ username: this.username, password: this.password });
      this.router.navigate(['/']).then(() => window.location.reload());
    } catch (err: any) { this.error = err.message; }
  }
}
