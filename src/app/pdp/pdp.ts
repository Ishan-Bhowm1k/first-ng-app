import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TitleCasePipe, CommonModule } from '@angular/common';
import { Data } from '../services/data';

interface PokemonMoveEntry {
  move: { name: string; url: string };
  version_group_details: any[];
}

interface PokemonDetails {
  height: number;
  weight: number;
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
export class Details implements OnInit {
  pokemonDetails: any = null;
  heroImage: string = '';

  constructor(private route: ActivatedRoute, private dataService: Data,private router: Router) {}

  ngOnInit() {
    const name = this.route.snapshot.paramMap.get('name');
    if (!name) return;

    this.dataService.getPokemonDetails(name).subscribe((response: any) => {
      this.pokemonDetails = response;
      this.heroImage =
        this.pokemonDetails.sprites?.other?.home?.front_default ||
        this.pokemonDetails.sprites?.front_default;
    });
  }

}