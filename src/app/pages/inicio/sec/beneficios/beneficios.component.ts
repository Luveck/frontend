import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-beneficios',
  templateUrl: './beneficios.component.html',
  styleUrls: ['./beneficios.component.scss']
})
export class BeneficiosComponent {
  @Output() sectionEvent = new EventEmitter<string>();

  constructor(public authServ:AuthService) { }

  selectSection(sec:string){
    this.sectionEvent.emit(sec)
  }
}
