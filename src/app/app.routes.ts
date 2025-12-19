import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => {
      return import('./pokemon/pokemon-list').then((m) => m.PokemonListComponent);
    },
  },
  {
    path: 'details/:name',
    loadComponent: () =>
      import('./pdp/pdp').then(c => c.DetailsComponent),
    data: { prerender: false } 
  },
  {
    path: 'forms',
    loadComponent: () =>
      import('./forms/forms').then(c => c.DynamicFormComponent),
    data: { prerender: false } 
  },
  {
    path: 'todos',
    loadComponent: () =>
      import('./todos/todos').then(c => c.Todos),
    data: { prerender: false } 
  },
];