import {Component, inject, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {environment} from "../../../../environment/environment";
import {RequestService} from "../../../services/request.service";
import {MatIcon} from "@angular/material/icon";
import {HttpClient, HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-more-chat',
  standalone: true,
  imports: [
    MatIcon,
    HttpClientModule
  ],
  providers: [
    RequestService
  ],
  templateUrl: './more-chat.component.html',
  styleUrl: './more-chat.component.css'
})
export class MoreChatComponent implements OnInit {
  token: string | null = localStorage.getItem('token');
  private bottomSheetRef = inject(MatBottomSheetRef<MoreChatComponent>);
  chatId?: string;

  constructor(
    private reqService: RequestService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: string) {}

  ngOnInit() {
    this.chatId = this.data;
  }

  deleteChat() {
    this.reqService.post<any>(environment.deleteChat + this.chatId, { token: this.token })
      .subscribe(data => {
        this.bottomSheetRef.dismiss();
      });
  }
}
