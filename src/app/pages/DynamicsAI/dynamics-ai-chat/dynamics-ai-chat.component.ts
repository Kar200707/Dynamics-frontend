import {Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {RequestService} from "../../../services/request.service";
import {environment} from "../../../../environment/environment";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {ResizeHeightDirective} from "../../../directives/resize-height.directive";
import {Haptics, ImpactStyle} from "@capacitor/haptics";

@Component({
  selector: 'app-dynamics-ai-chat',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    RouterLink,
    ResizeHeightDirective,
    MatButton
  ],
  templateUrl: './dynamics-ai-chat.component.html',
  styleUrl: './dynamics-ai-chat.component.css'
})
export class DynamicsAiChatComponent implements OnInit {
  @ViewChild('chatScroll') private chatScroll!: ElementRef;
  @ViewChild('send_input') private sendInput!: ElementRef;
  token: string | null = localStorage.getItem('token');
  chat: any;
  windowWidth: number = innerWidth;
  chatId!: string | null;
  textCopiedIndex: number = 0;
  confirm: boolean = false;
  aiMessageLoading: boolean = false;
  isRequestError: boolean = false;
  aiModel: string = 'gpt-4o-mini';
  aiModels: string[] = [];
  message: string = '';
  textCopied: boolean = false;
  @Input('place') place!: string;
  @HostListener('window:resize', ['$event'])
  resize () {
    this.windowWidth = innerWidth;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private reqService: RequestService) {
    this.route.paramMap.subscribe(params => {
      this.chatId = params.get('id');
      this.getChat();
    });
  }

  async ngOnInit() {
    this.getAiModels();
  }

  modelSelectOnChange(e: Event) {
    this.aiModel = (e.target as HTMLSelectElement).value
  }

  private scrollToBottom(): void {
    try {
      this.chatScroll.nativeElement.scrollTop = this.chatScroll.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  classifyText(text: string): { text: string; type: string }[] {
    const codePattern = /```(\w+)\n([\s\S]+?)```/g;
    const thinkPattern = /<think>(\w+)\n([\s\S]+?)<\/think>/g;
    const result: { text: string; type: string }[] = [];
    let lastIndex = 0;
    let match;

    while (
      (match = codePattern.exec(text)) !== null ||
      (match = thinkPattern.exec(text)) !== null
      ) {
      if (match.index > lastIndex) {
        const textChunk = text.slice(lastIndex, match.index).trim();
        if (textChunk) result.push({ text: textChunk, type: 'text' });
      }

      if (match[0].startsWith('```')) {
        const language = match[1].toLowerCase();
        const codeContent = match[2].trim();
        result.push({ text: codeContent, type: language });
      } else if (match[0].startsWith('<think>')) {
        const blockType = match[1].toLowerCase();
        const thinkContent = match[2].trim();
        result.push({ text: thinkContent, type: blockType });
      }

      lastIndex = match.index + match[0].length;
    }

    const remainingText = text.slice(lastIndex).trim();
    if (remainingText) {
      result.push({ text: remainingText, type: 'text' });
    }

    return result;
  }
  copy(text: string, index: number) {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Text successfully copied to clipboard');
      this.textCopied = false;
      this.textCopiedIndex = index;
      this.textCopied = true;
      setTimeout(() => {
        this.textCopied = false;
      }, 2000)
    }).catch(function(err) {
      console.error('Error copying text: ', err);
    });
  }

  getChat() {
     if (this.chatId) {
       this.reqService.post<any>(environment.getAiChat + this.chatId, { token: this.token })
         .subscribe(data => {
           this.chat = data.chat;
           setTimeout(() => {this.scrollToBottom()}, 100);
         }, () => { this.router.navigate([this.place === 'pc-component' ? 'home/dynamics-ai-pc/chat' : 'home/dynamics-ai']) })
     }
  }

  getAiModels() {
    this.reqService.post<any>(environment.getAiModels, { token: this.token })
      .subscribe(data => {
        this.aiModels = data.models;
        setTimeout(() => {this.scrollToBottom()}, 100);
      })
  }

  async sendMessageChat(message: string, event: any) {
    setTimeout(() => {Haptics.impact({ style: ImpactStyle.Light })})
    event.preventDefault();
    this.sendInput.nativeElement.focus();
    this.isRequestError = false;
    this.aiMessageLoading = true;
    if (this.sendInput.nativeElement.value.length !== 0) {
      this.chat.chat.push({ role: "user", content: message, });
      setTimeout(() => {this.scrollToBottom()}, 100);
      this.reqService.post<any>(environment.sendMessageChat + this.chatId, { token: this.token, aiModel: this.aiModel, message })
        .subscribe(data => {
          this.aiMessageLoading = false;
          this.chat.chat.push({ role: "assistant", content: data.aiMessage, });
          setTimeout(() => {this.scroll100()}, 100);
          setTimeout(() => {Haptics.impact({ style: ImpactStyle.Light })})
        }, () => { this.isRequestError = true; })
      this.sendInput.nativeElement.value = "";
    }
  }

  scroll100() {
    const scrollTop = this.chatScroll.nativeElement.scrollTop;

    this.chatScroll.nativeElement.scrollTop = scrollTop + 300;
  }

  createNewChat() {
    if (this.chat.chat.length !== 0) {
      this.reqService.post<any>(environment.createAiChat, { token: this.token })
        .subscribe(data => {
          this.aiMessageLoading = false;
          this.router.navigate([this.place === 'pc-component' ? 'home/dynamics-ai-pc/chat/' : 'home/dynamics-ai/chat/', data.chatId]).then(() => {
            this.getChat();
            this.getAiModels();
          });
        }, () => {
          this.isRequestError = true;
        });
    }
  }

  clickDeleteChatButton () {
    this.confirm = true;
  }

  deleteChat() {
    this.reqService.post<any>(environment.deleteChat + this.chatId, { token: this.token })
      .subscribe(data => {
        this.confirm = false;
        this.router.navigate([this.place === 'pc-component' ? 'home/dynamics-ai-pc/chat' : 'home/dynamics-ai',]);
      }, () => {
        this.isRequestError = true;
      });
  }
}
