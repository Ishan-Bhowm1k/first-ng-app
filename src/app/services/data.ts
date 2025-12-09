import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Data {

  private baseURL = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) {}

  // ✔ Fetch Pokémon with pagination
  getPokemons(limit: number, offset: number): Observable<any> {
    return this.http.get(`${this.baseURL}?limit=${limit}&offset=${offset}`);
  }

  // ✔ Fetch single Pokémon details
  getMoreData(name: string): Observable<any> {
    return this.http.get(`${this.baseURL}/${name}`);
  }

  // ✔ Fetch all Pokémon names (for prerendering / search)
  getAllPokemonNames(): Observable<any> {
    return this.http.get(`${this.baseURL}?limit=1300&offset=0`);
  }
}