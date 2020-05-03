import { Component, OnInit, Input } from '@angular/core';
import { IPokemonMain } from '../shared/interfaces/pokemon.interface';
import { PokemonService } from './../shared/services/pokemon.service';

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.scss']
})
export class PokemonDetailsComponent implements OnInit {
  @Input() pokemon: IPokemonMain;

  constructor(public pokemonService: PokemonService) { }

  ngOnInit() {

  }

  getType(): string {
    if (this.pokemon) {
      return this.pokemon.types.map(el => el.type.name).join(', ');
    }
  };

  closeDetails(): void {
    this.pokemonService.isDetailsOpen = false;
    this.pokemonService.isModalShown = false;
  };

}
