import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TitleCasePipe, CommonModule } from '@angular/common';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { Data } from '../services/data';

interface PokemonMoveEntry {
  move: { name: string; url: string };
  version_group_details: any[];
}

interface PokemonDetails {
  name: string;
  height: number;
  weight: number;
  types: { type: { name: string } }[];
  stats: { base_stat: number }[];
  moves: PokemonMoveEntry[];
  sprites?: any;
}

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [RouterLink, CommonModule, TitleCasePipe],
  templateUrl: './pdp.html',
  styleUrls: ['./pdp.scss'],
})
export class DetailsComponent implements OnDestroy {
  pokemonDetails: PokemonDetails | null = null;
  heroImage = '';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly dataService: Data,
    private readonly router: Router
  ) {
    this.initPokemonDetailsStream();
  }

  private initPokemonDetailsStream(): void {
    this.route.paramMap
      .pipe(
        switchMap(paramMap => {
          const name = paramMap.get('name');
          if (!name) {
            this.router.navigate(['/']);
            throw new Error('Pokemon name is required in route');
          }
          return this.dataService.getPokemonDetails(name);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response: PokemonDetails) => {
          this.pokemonDetails = response;
          this.heroImage =
            this.pokemonDetails?.sprites?.other?.home?.front_default ||
            this.pokemonDetails?.sprites?.front_default ||
            '';
        },
        error: err => {
          console.error('Failed to load Pokémon details', err);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
