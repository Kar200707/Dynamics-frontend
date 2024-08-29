import { Component } from '@angular/core';
import {PlayerControllerService} from "../../services/player-controller.service";
import {MatButton} from "@angular/material/button";
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-timer-bottom-sheet',
  standalone: true,
  imports: [
    MatButton,
    HttpClientModule
  ],
  templateUrl: './timer-bottom-sheet.component.html',
  styleUrl: './timer-bottom-sheet.component.css'
})
export class TimerBottomSheetComponent {

  constructor(private playerController: PlayerControllerService) {}

  close () {
    this.playerController.setTimer(null);
  }
}
