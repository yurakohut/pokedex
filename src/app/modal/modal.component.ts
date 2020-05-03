import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { PokemonService } from '../shared/services/pokemon.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  modalRef: BsModalRef;
  @ViewChild('autoShownModal', { static: false }) autoShownModal: ModalDirective;
  
  constructor(public pokemonService: PokemonService) { }

  ngOnInit() {
  }

  hideModal(): void {
    this.autoShownModal.hide();
  }

  onHidden(): void {
    this.pokemonService.isModalShown = false;
  }
}
