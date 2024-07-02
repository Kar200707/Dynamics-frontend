import {Component} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-mobile-nav-panel',
  standalone: true,
  imports: [
    MatIcon,
    RouterLink,
    NgOptimizedImage
  ],
  templateUrl: './mobile-nav-panel.component.html',
  styleUrl: './mobile-nav-panel.component.css'
})
export class MobileNavPanelComponent {
  routePath: string = '';

  constructor() { }

  setRouteActive (route: string) {
    this.routePath = route;
  }
}
