import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => {
      return import('./pokemon/pokemon-list').then((m) => m.PokemonList);
    },
  },
  {
    path: 'details/:name',
    loadComponent: () =>
      import('./pdp/pdp').then(c => c.Details),
    data: { prerender: false } 
  },
  {
    path: 'pokemon',
    loadComponent: () => {
      return import('./pokemon/pokemon-list').then((m) => m.PokemonList);
    },
  },
];