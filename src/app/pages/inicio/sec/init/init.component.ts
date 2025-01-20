import { Component, ViewEncapsulation, EventEmitter, Output  } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import SwiperCore, { Autoplay, SwiperOptions, Navigation } from 'swiper';
SwiperCore.use([ Autoplay, Navigation])

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InitComponent {
  @Output() sectionEvent = new EventEmitter<string>();

  swipperConfig: SwiperOptions = {
    effect: 'fade',
    loop: true,
    slidesPerView: 1,
    navigation: true,
    autoplay: {
      delay: 8000,
      pauseOnMouseEnter: true,
      disableOnInteraction: false
    }
  };

  constructor(public authServ:AuthService) { }

  selectSection(sec:string){
    this.sectionEvent.emit(sec)
  }
}
