import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-beneficios',
  templateUrl: './beneficios.component.html',
  styleUrls: ['./beneficios.component.scss'],
})
export class BeneficiosComponent {
  @Output() sectionEvent = new EventEmitter<string>();

  constructor(public readonly sessionService: SessionService) {}

  selectSection(sec: string) {
    this.sectionEvent.emit(sec);
  }
}
