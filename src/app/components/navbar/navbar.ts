import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <a
        routerLink="/"
        routerLinkActive="active"
        [routerLinkActiveOptions]="{ exact: true }"
      >
        Pokédex
      </a>

      <a
        routerLink="/forms"
        routerLinkActive="active"
      >
        Forms
      </a>

      <a
        routerLink="/todos"
        routerLinkActive="active"
      >
        Todos
      </a>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      gap: 1rem;
      padding: 0.75rem 1.5rem;
      background: #948f89ff;
      border-bottom: 1px solid rgba(148, 163, 184, 0.3);
    }

    .navbar a {
      color: #e5e7eb;
      text-decoration: none;
      font-size: 0.95rem;
      font-weight: 500;
      padding: 0.3rem 0.7rem;
      border-radius: 999px;
      transition: background-color 0.15s ease, color 0.15s ease;
    }

    .navbar a:hover {
      background: rgba(148, 163, 184, 0.15);
    }

    .navbar a.active {
      background: #6f6b67;
      color: #0b1120;
    }
  `],
})
export class NavbarComponent {}
