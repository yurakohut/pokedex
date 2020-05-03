import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, mergeMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { IPokemonMain, IPokemonTop } from '../interfaces/pokemon.interface';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private mainUrl = 'https://pokeapi.co/api/v2/pokemon';
  private typesUrl = 'https://pokeapi.co/api/v2/type/';
  isDetailsOpen: boolean = false;
  isModalShown: boolean = false;

  constructor(private http: HttpClient) { }

  getData(params) {
    return this.http.get(this.mainUrl, {
      params: new HttpParams({
        fromObject: params
      })
    })
      .pipe(
        map(data => data['results'].map(pokemonData => pokemonData.url)),
        mergeMap(pokemonUrls => {
          pokemonUrls = pokemonUrls.map(url => this.getPokemonsDescription(url));
          return forkJoin([...pokemonUrls]);
        })
      );
  };

  getPokemonsByType(type: string) {
    return this.http.get(this.typesUrl + type)
      .pipe(
        map(data => {
          if (data['pokemon'].length) {
            return data['pokemon'].map(pokemonData => pokemonData.pokemon.url);
          }
          return;
        }),
        mergeMap(pokemonUrls => {
          if (pokemonUrls) {
            pokemonUrls = pokemonUrls.map(url => this.getPokemonsDescription(url));
            return forkJoin([...pokemonUrls]);
          }
            return [false];
        })
      );
  };

  getAllTypes() {
    return this.http.get(this.typesUrl);
  }

  getPokemonsDescription(url: string) {
    return this.http.get<IPokemonMain[]>(url);
  };

  extractData(pokemon): IPokemonMain {
    return {
      id: pokemon.id,
      name: pokemon.name,
      image: pokemon.sprites['front_default'],
      types: pokemon.types,
      stats: [
        { name: 'Attack', score: this.extractStat('attack', pokemon.stats) },
        { name: 'Defense', score: this.extractStat('defense', pokemon.stats) },
        { name: 'HP', score: this.extractStat('hp', pokemon.stats) },
        { name: 'SP Attack', score: this.extractStat('special-attack', pokemon.stats) },
        { name: 'SP Defence', score: this.extractStat('special-defense', pokemon.stats) },
        { name: 'Speed', score: this.extractStat('speed', pokemon.stats) },
      ],
      weight: pokemon.weight,
      totalMoves: pokemon.moves.length
    };
  };

  extractStat(statName, array) {
    return array.filter(stat => stat.stat.name === statName)[0].base_stat;
  };

  extractDataForTop(pokemon): IPokemonTop {
    return {
      id: pokemon.id,
      name: pokemon.name,
      attack: this.extractStat('attack', pokemon.stats),
      defense: this.extractStat('defense', pokemon.stats),
      hp: this.extractStat('hp', pokemon.stats),
      spAttack: this.extractStat('special-attack', pokemon.stats),
      spDefense: this.extractStat('special-defense', pokemon.stats),
      speed: this.extractStat('speed', pokemon.stats),
      weight: pokemon.weight,
      totalMoves: pokemon.moves.length
    };
  };

}

