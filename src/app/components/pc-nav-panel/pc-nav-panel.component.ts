import { Component } from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {PlayerControllerService} from "../../services/player-controller.service";

@Component({
  selector: 'app-pc-nav-panel',
  standalone: true,
  imports: [
    MatIcon
  ],
  templateUrl: './pc-nav-panel.component.html',
  styleUrl: './pc-nav-panel.component.css'
})
export class PcNavPanelComponent {
  backgroundColor: string = 'rgba(30,30,30,0)';

  constructor(private playerController: PlayerControllerService) {
    playerController.color$.subscribe(rgb => {
      if (rgb && rgb.r !== undefined && rgb.g !== undefined && rgb.b !== undefined) {
        this.backgroundColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      }
    })
  }
}
