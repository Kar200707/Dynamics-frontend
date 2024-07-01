import { Component } from '@angular/core';
import {MobileNavPanelComponent} from "../components/mobile-nav-panel/mobile-nav-panel.component";
import {PlayerComponent} from "../components/player/player.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-layout',
  standalone: true,
    imports: [
        MobileNavPanelComponent,
        PlayerComponent,
        RouterOutlet
    ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
}
