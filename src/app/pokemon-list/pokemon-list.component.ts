import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { PokemonService } from './../shared/services/pokemon.service';
import { Subscription } from 'rxjs';
import { IPokemonMain } from './../shared/interfaces/pokemon.interface';

const RESPONSIVE_LIMIT = 1000;

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnInit, OnDestroy {
  pokemons: Array<IPokemonMain> = [];
  onePokemon: IPokemonMain;
  limit = 12;
  offset = 0;
  noMorePokemons: boolean = false;
  isLoading: boolean = false;
  innerWidth: number;
  subscription: Subscription;

  constructor(public pokemonService: PokemonService) { }

  ngOnInit() {
    this.getData();
    this.innerWidth = window.innerWidth;
  };

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < RESPONSIVE_LIMIT) {
      this.pokemonService.isDetailsOpen = false;
    }
  };

  getData() {
    const params = {
      offset: this.offset,
      limit: this.limit
    };
    this.subscription = this.pokemonService.getData(params).subscribe(pokemons => {
      this.isLoading = false;
      this.noMorePokemons = pokemons.length < this.limit;
      pokemons.map(pokemon => {
        return this.pokemons = this.pokemons.concat(this.pokemonService.extractData(pokemon));
      });
    });
  };

  nextPokemons(): void {
    this.isLoading = true;
    this.offset += this.limit;
    this.getData();
  };

  getPokemonDetails(pokemon: IPokemonMain): void {
    this.checkSize();
    this.onePokemon = pokemon;
  };

  checkSize(): void {
    if (this.innerWidth < RESPONSIVE_LIMIT) {
      this.pokemonService.isDetailsOpen = false;
      this.pokemonService.isModalShown = true;
    }
    else {
      this.pokemonService.isDetailsOpen = true;
      this.pokemonService.isModalShown = false
    }
  };

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  };
}
