import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { NavbarComponent } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, NavbarComponent],
  template: `
    <app-header />
    <main>
      <app-navbar></app-navbar>
      <router-outlet />
    </main>
  `,
  styles: [
    `
      main {
        padding: 16px;
        background-color: #6f6b67;
      }
    `,
  ],
})
export class App {
  readonly title = signal('first-ng-app');
}
