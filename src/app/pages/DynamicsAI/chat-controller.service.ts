import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChatControllerService {
  private chatId: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  chatId$:Observable<any> = this.chatId.asObservable();

  setId(id: string) {
    this.chatId.next(id);
  }

  constructor() { }
}
