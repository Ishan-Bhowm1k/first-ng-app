import { Component, OnInit } from '@angular/core';
import { Data } from '../services/data';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './pokemon-list.html',
  styleUrls: ['./pokemon-list.scss'],
})
export class PokemonList implements OnInit {

  allPokemonNames: any[] = [];   // ALL names
  filteredNames: any[] = [];     // Names after search
  pokemons: any[] = [];          // Full details (current page)
  page = 1;
  limit = 12;
  totalPages = 0;                // Total pages for pagination

  constructor(private data: Data) {}

  ngOnInit() {
    this.loadAllNames();
  }

  // Load all Pokémon names once
  loadAllNames() {
    this.data.getAllPokemonNames().subscribe((res: any) => {
      this.allPokemonNames = res.results;
      this.filteredNames = [...this.allPokemonNames];
      this.calculateTotalPages();
      this.loadPageData();
    });
  }

  // Calculate total pages
  calculateTotalPages() {
    this.totalPages = Math.ceil(this.filteredNames.length / this.limit);
  }

  // Load Pokémon for the current page
  loadPageData() {
    const start = (this.page - 1) * this.limit;
    const end = start + this.limit;
    const pageSlice = this.filteredNames.slice(start, end);

    if (pageSlice.length === 0) {
      this.pokemons = [];
      return;
    }

    const requests = pageSlice.map(p => this.data.getMoreData(p.name));
    forkJoin<any[]>(requests).subscribe(list => {
      this.pokemons = list;
    });
  }

  // Change page
  changePage(newPage: number) {
    if (newPage < 1 || newPage > this.totalPages) return; // prevent overflow
    this.page = newPage;
    this.loadPageData();
  }

  
  onPageClick(p: number | string) {
    if (typeof p === 'number') {
      this.changePage(p);
    }
  }

  // Search all Pokémon
  search(value: string) {
    const term = value.toLowerCase();
    this.filteredNames = this.allPokemonNames.filter(p =>
      p.name.toLowerCase().includes(term)
    );
    this.page = 1; // reset to first page
    this.calculateTotalPages();
    this.loadPageData();
  }

  // Generate an array for page buttons (all pages)
  getPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x,i) => i+1);
  }

  // Generate an array of page numbers with ellipsis
  getVisiblePages(): (number | string)[] {
    const total = this.totalPages;
    const current = this.page;
    const maxVisible = 5; // max page buttons before ellipsis

    if (total <= maxVisible) {
      return Array.from({length: total}, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    pages.push(1); // first page

    let start = Math.max(2, current - 1);
    let end = Math.min(total - 1, current + 1);

    if (current > total - 3) {
      start = total - 3;
      end = total - 1;
    } else if (current < 3) {
      start = 2;
      end = 4;
    }

    if (start > 2) {
      pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < total - 1) {
      pages.push('...');
    }

    pages.push(total); // last page

    return pages;
  }
}