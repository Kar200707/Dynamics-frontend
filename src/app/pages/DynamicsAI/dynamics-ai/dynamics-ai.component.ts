import { Component, OnInit } from '@angular/core';
import { RequestService } from "../../../services/request.service";
import { environment } from "../../../../environment/environment";
import { ResizeHeightDirective } from "../../../directives/resize-height.directive";
import {Router, RouterLink} from "@angular/router";
import { ChatsCacheService } from "../../../services/chats-cache.service";
import {MatIcon} from "@angular/material/icon";
import {BleClient} from "@capacitor-community/bluetooth-le";
import {ChatControllerService} from "../chat-controller.service";

@Component({
  selector: 'app-dynamics-ai',
  standalone: true,
  imports: [
    ResizeHeightDirective,
    RouterLink,
    MatIcon
  ],
  templateUrl: './dynamics-ai.component.html',
  styleUrl: './dynamics-ai.component.css'
})
export class DynamicsAiComponent implements OnInit {
  token: string | null = localStorage.getItem('token');
  title: string = "Dynamics Ai";
  chats: any[] = [];

  constructor(
    public router: Router,
    private chatController: ChatControllerService,
    private chatCacheService: ChatsCacheService,
    private reqService: RequestService
  ) {}

  async ngOnInit() {
    await this.loadChatsFromCache();
    this.updateChatsFromServer();

  }

  private async loadChatsFromCache() {
    const cachedChats: any = await this.chatCacheService.loadChats();
    if (cachedChats && cachedChats.length > 0) {
      this.chats = cachedChats;
    }
  }

  private updateChatsFromServer() {
    this.reqService.post<any>(environment.getAiChat, { token: this.token })
      .subscribe(data => {
        if (data.chats && data.chats.length > 0) {
          this.chats = data.chats;
          this.chatCacheService.saveChats(this.chats);
        }
      })
  }

  setChat(id: string) {
    this.chatController.setId(id);
  }

  createNewChat() {
    this.reqService.post<any>(environment.createAiChat, { token: this.token })
      .subscribe(data => {
        this.router.navigate(['home/dynamics-ai/chat/', data.chatId]);
      });
  }

  protected readonly innerWidth = innerWidth;
  protected readonly Navigator = Navigator;
}
