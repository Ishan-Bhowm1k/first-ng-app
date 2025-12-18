import { Component, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { Data } from '../services/data';

interface NamedApiResource {
  name: string;
  url: string;
}

interface PokemonListResponse {
  count: number;
  results: NamedApiResource[];
}

interface PokemonSummary {
  name: string;
  id: number;
  sprites?: {
    front_default?: string;
    other?: {
      home?: {
        front_default?: string;
      };
    };
  };
}

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './pokemon-list.html',
  styleUrls: ['./pokemon-list.scss'],
})
export class PokemonListComponent implements OnDestroy {
  // All names from API
  allPokemonNames: NamedApiResource[] = [];

  // Filtered by search
  filteredNames: NamedApiResource[] = [];

  // Full details for current page
  pokemons: PokemonSummary[] = [];

  // Pagination state
  page = 1;
  limit = 12;
  totalPages = 0;

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly data: Data) {
    this.initAllNames();
  }

  /**
   * Load all Pokémon names once and keep them in memory.
   */
  private initAllNames(): void {
    this.data
      .getAllPokemonNames()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: PokemonListResponse) => {
          this.allPokemonNames = res.results;
          this.filteredNames = [...this.allPokemonNames];
          this.updatePagination();
        },
        error: err => {
          console.error('Failed to load Pokémon names', err);
        },
      });
  }

  private updatePagination(): void {
    this.calculateTotalPages();
    this.loadPageData();
  }

  /**
   * Calculate how many pages exist based on filtered names and limit.
   */
  private calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredNames.length / this.limit);
  }

  /**
   * Load Pokémon details for the current page using forkJoin.
   */
  private loadPageData(): void {
    const start = (this.page - 1) * this.limit;
    const end = start + this.limit;
    const pageSlice = this.filteredNames.slice(start, end);

    if (pageSlice.length === 0) {
      this.pokemons = [];
      return;
    }

    const requests = pageSlice.map(p =>
      this.data.getPokemonDetails(p.name)
    );

    forkJoin<PokemonSummary[]>(requests)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: list => {
          this.pokemons = list;
        },
        error: err => {
          console.error('Failed to load Pokémon details', err);
          this.pokemons = [];
        },
      });
  }

  /**
   * Change current page if within valid bounds.
   */
  changePage(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages || newPage === this.page) {
      return;
    }
    this.page = newPage;
    this.loadPageData();
  }

  onPageClick(p: number | string): void {
    if (typeof p === 'number') {
      this.changePage(p);
    }
  }

  /**
   * Search across all Pokémon names, reset to first page, and update.
   */
  search(value: string): void {
    const term = value.trim().toLowerCase();

    if (!term) {
      this.filteredNames = [...this.allPokemonNames];
    } else {
      this.filteredNames = this.allPokemonNames.filter(p =>
        p.name.toLowerCase().includes(term)
      );
    }

    this.page = 1;
    this.updatePagination();
  }

  /**
   * Generate a simple array of page numbers (1..totalPages).
   * If you still use this in template, it's available.
   */
  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  /**
   * Generate visible page numbers with ellipsis for compact pagination.
   */
  getVisiblePages(): (number | string)[] {
  const total = this.totalPages;
  const current = this.page;
  const delta = 1; // how many pages around current

  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const range: number[] = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  range.push(1);
  for (let i = left; i <= right; i++) {
    range.push(i);
  }
  range.push(total);

  const pages: (number | string)[] = [];
  let prev: number | undefined;

  for (const page of range) {
    if (prev !== undefined) {
      if (page - prev === 2) {
        pages.push(prev + 1);
      } else if (page - prev > 2) {
        pages.push('...');
      }
    }
    pages.push(page);
    prev = page;
  }

  return pages;
}


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
