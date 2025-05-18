import {Component, OnInit} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {NavigationEnd, Router, RouterLink} from "@angular/router";
import {NgOptimizedImage} from "@angular/common";
import {filter} from "rxjs";
import {Capacitor} from "@capacitor/core";

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
export class MobileNavPanelComponent implements OnInit {
  routePath: string = 'home';
  isNative: boolean = false;

  constructor(private router: Router) { }

  ngOnInit() {
    this.isNative = Capacitor.isNativePlatform();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const currentRoutePath = event.urlAfterRedirects.split('?')[0];

      switch (currentRoutePath) {
        case '/home':
        case '/folder':
          this.routePath = 'home';
          break;
        case '/library':
          this.routePath = 'library';
          break;
        case '/search':
          this.routePath = 'search';
          break;
        default:
          this.routePath = '';
      }
    });
  }


  setRouteActive (route: string) {
    // this.routePath = route;

  }
}
