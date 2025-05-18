import {Component, inject, Input, OnInit} from '@angular/core';
import { RequestService } from "../../../services/request.service";
import { environment } from "../../../../environment/environment";
import { ResizeHeightDirective } from "../../../directives/resize-height.directive";
import {Router, RouterLink} from "@angular/router";
import { ChatsCacheService } from "../../../services/chats-cache.service";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {Haptics, ImpactStyle} from "@capacitor/haptics";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {MoreChatComponent} from "../../../components/bottom-sheets/more-chat/more-chat.component";
import {ChatModel} from "../../../../models/chat.model";
import {ChatParentModel} from "../../../../models/chat-parent.model";
import {Capacitor} from "@capacitor/core";

@Component({
  selector: 'app-dynamics-ai',
  standalone: true,
    imports: [
        ResizeHeightDirective,
        RouterLink,
        MatIcon,
        MatIconButton
    ],
  templateUrl: './dynamics-ai.component.html',
  styleUrl: './dynamics-ai.component.css'
})
export class DynamicsAiComponent implements OnInit {
  token: string | null = localStorage.getItem('token');
  title: string = "Dynamics Ai";
  @Input('place') place!: string;
  chats: any[] = [];
  private _bottomSheetChatMore = inject(MatBottomSheet);

  constructor(
    public router: Router,
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
        data.chats.forEach((chatParent: ChatParentModel) => {
          if (chatParent.chat.length === 0) {
            this.deleteChat(chatParent._id);
          }
        })
        if (data.chats && data.chats.length > 0) {
          this.chats = data.chats.reverse();
          if (this.place === 'pc-component') {
            this.router.navigate(['home/dynamics-ai-pc/chat/', data.chats[0]._id]);
          }
          this.chatCacheService.saveChats(this.chats);
        }
      })
  }

  createNewChat() {
    this.reqService.post<any>(environment.createAiChat, { token: this.token })
      .subscribe(data => {
        this.router.navigate([this.place === 'pc-component' ? 'dynamics-ai-pc/chat/' : 'dynamics-ai/chat/', data.chatId]);
      });
  }

  deleteChat(chatId: string) {
    this.reqService.post<any>(environment.deleteChat + chatId, { token: this.token })
      .subscribe(data => {});
  }

  async openSheetChatMore(chatId: string) {
    const platform = Capacitor.getPlatform();

    if (platform !== 'web') {
      await Haptics.impact({style: ImpactStyle.Medium});
    }
    const bottomSheetRef = this._bottomSheetChatMore.open(MoreChatComponent, {
      panelClass: "bottom-sheet",
      data: chatId,
    });

    bottomSheetRef.afterDismissed().subscribe(() => { this.updateChatsFromServer() });
  }

  protected readonly innerWidth = innerWidth;
  protected readonly Navigator = Navigator;
}
