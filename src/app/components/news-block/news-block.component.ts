import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import Splide from "@splidejs/splide";
import {ResizeHeightDirective} from "../../directives/resize-height.directive";
import {RequestService} from "../../services/request.service";
import {HttpClient, HttpClientModule, HttpHandler} from "@angular/common/http";

@Component({
  selector: 'app-news-block',
  standalone: true,
  imports: [
    ResizeHeightDirective,
    HttpClientModule
  ],
  providers: [
    RequestService,
    HttpClient
  ],
  templateUrl: './news-block.component.html',
  styleUrl: './news-block.component.css'
})
export class NewsBlockComponent implements AfterViewInit {
  @ViewChild('slider') slider!: ElementRef<HTMLElement>;
  url: string = '';

  constructor(private requestService: RequestService) {  }

  ngAfterViewInit() {
    const newsSlider: Splide = new Splide(
      this.slider.nativeElement,
      {
        type: 'loop',
        autoplay: true,
        arrows: true
      }
    );

    newsSlider.mount();
  }
}
