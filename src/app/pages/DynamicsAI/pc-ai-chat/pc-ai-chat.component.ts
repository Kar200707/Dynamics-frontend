import { Component } from '@angular/core';
import {DynamicsAiChatComponent} from "../dynamics-ai-chat/dynamics-ai-chat.component";
import {DynamicsAiComponent} from "../dynamics-ai/dynamics-ai.component";

@Component({
  selector: 'app-pc-ai-chat',
  standalone: true,
  imports: [
    DynamicsAiChatComponent,
    DynamicsAiComponent,
  ],
  templateUrl: './pc-ai-chat.component.html',
  styleUrl: './pc-ai-chat.component.css',
})
export class PcAiChatComponent {  }
