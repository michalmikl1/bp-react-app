import { Injectable } from '@angular/core';
import * as bcrypt from 'bcryptjs';

const USERS_KEY = 'task_manager_users';
const TOKEN_KEY = 'task_manager_token';

@Injectable({ providedIn: 'root' })
export class UserService {
  private getUsers(): any[] {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  }

  private saveUsers(users: any[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  register(payload: { username: string; password: string }): any {
    const users = this.getUsers();

    if (users.find((u) => u.username.toLowerCase() === payload.username.toLowerCase())) {
      throw new Error('Uživatel s tímto jménem již existuje.');
    }

    const hashedPassword = bcrypt.hashSync(payload.password, 10);
    const newUser = { id: Date.now(), username: payload.username, password: hashedPassword };

    users.push(newUser);
    this.saveUsers(users);

    localStorage.setItem(TOKEN_KEY, JSON.stringify({ id: newUser.id, username: newUser.username }));
    return newUser;
  }

  login(payload: { username: string; password: string }): any {
    const users = this.getUsers();
    const user = users.find((u) => u.username === payload.username);

    if (!user || !bcrypt.compareSync(payload.password, user.password)) {
      throw new Error('Špatné uživatelské jméno nebo heslo.');
    }

    localStorage.setItem(TOKEN_KEY, JSON.stringify({ id: user.id, username: user.username }));
    return user;
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  getCurrentUser(): any {
    return JSON.parse(localStorage.getItem(TOKEN_KEY) || 'null');
  }
}
