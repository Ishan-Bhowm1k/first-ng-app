import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Data {

  private baseURL = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) {}


  getPokemons(limit: number, offset: number): Observable<any> {
    return this.http.get(`${this.baseURL}?limit=${limit}&offset=${offset}`);
  }


  getPokemonDetails(name: string): Observable<any> {
    return this.http.get(`${this.baseURL}/${name}`);
  }


  getAllPokemonNames(): Observable<any> {
    return this.http.get(`${this.baseURL}?limit=500&offset=0`);
  }
}