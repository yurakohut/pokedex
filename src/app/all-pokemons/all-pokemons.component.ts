import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { PokemonService } from '../shared/services/pokemon.service';
import { IPokemonTop } from '../shared/interfaces/pokemon.interface';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-all-pokemons',
  templateUrl: './all-pokemons.component.html',
  styleUrls: ['./all-pokemons.component.scss'],
})
export class AllPokemonsComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  pokemonsSub: Subscription;
  typesSub: Subscription;
  pokemons: Array<IPokemonTop> = [];
  displayedColumns: string[] = ['id', 'name', 'attack', 'defense', 'hp', 'spAttack', 'spDefense', 'weight', 'speed', 'totalMoves'];
  dataSource: any;
  types: Array<{ name: string, url: string }> = [];
  chosenType = 'fire';
  isLoading = false;
  isData: boolean;
  columns = [
    { columnDef: 'id', header: 'Id', cell: (row) => `${row.id}` },
    { columnDef: 'name', header: 'Name', cell: (row) => `${row.name}` },
    { columnDef: 'attack', header: 'Attack', cell: (row) => `${row.attack}` },
    { columnDef: 'defense', header: 'Defense', cell: (row) => `${row.defense}` },
    { columnDef: 'hp', header: 'HP', cell: (row) => `${row.hp}` },
    { columnDef: 'spAttack', header: 'SP Attack', cell: (row) => `${row.spAttack}` },
    { columnDef: 'spDefense', header: 'SP Defense', cell: (row) => `${row.spDefense}` },
    { columnDef: 'speed', header: 'Speed', cell: (row) => `${row.speed}` },
    { columnDef: 'weight', header: 'Weight', cell: (row) => `${row.weight}` },
    { columnDef: 'totalMoves', header: 'Total Moves', cell: (row) => `${row.totalMoves}` },
  ];

  constructor(private pokemonService: PokemonService) { }

  ngOnInit() {
    this.getDataTypes();
    this.getPokemonData();
  }

  getPokemonData(): void {
    this.isLoading = true;
    this.isData = false;
    this.pokemonsSub = this.pokemonService.getPokemonsByType(this.chosenType)
      .subscribe(pokemons => {
        if (pokemons) {
          this.pokemons = (pokemons as Array<IPokemonTop>).map(pokemon =>
            this.pokemonService.extractDataForTop(pokemon)
          );
          this.dataSource = new MatTableDataSource(this.pokemons)
          this.dataSource.sort = this.sort;
        }
        else {
          this.isData = true
        }
        this.isLoading = false;
      });
  };

  getDataTypes() {
    this.typesSub = this.pokemonService.getAllTypes().subscribe(data => {
      this.types = data['results'];
    });
  };

  ngOnDestroy(): void {
    this.pokemonsSub.unsubscribe();
    this.typesSub.unsubscribe();
  };

}
