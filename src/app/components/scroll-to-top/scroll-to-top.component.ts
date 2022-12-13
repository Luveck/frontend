import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-scroll-to-top',
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollToTopComponent{
  @Output() scrollToTop = new EventEmitter<void>();

  constructor() { }

  onScrollToTop(): void {
    this.scrollToTop.emit();
  }
}
