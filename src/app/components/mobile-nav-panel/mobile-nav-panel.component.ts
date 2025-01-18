import {Component} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {NavigationEnd, Router, RouterLink} from "@angular/router";
import {NgOptimizedImage} from "@angular/common";
import {filter} from "rxjs";

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

  constructor(private router: Router) { }

  setRouteActive (route: string) {
    this.routePath = route;
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd) // Listen for route change
    ).subscribe((event: any) => {
      const currentRoutePath = event.urlAfterRedirects;
      switch (currentRoutePath) {
        case '/home/track-favorites':
          this.routePath = 'home';
          break;
        case '/home/library':
          this.routePath = 'library';
          break;
        case '/home/search':
          this.routePath = 'search';
          break;
        default:
          this.routePath = '';
      }
    });
  }
}
