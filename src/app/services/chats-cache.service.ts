import { Injectable } from '@angular/core';
import localForage from "localforage";

@Injectable({
  providedIn: 'root'
})
export class ChatsCacheService {
  private cache = localForage.createInstance({
    name: 'chats-cache',
    storeName: 'chats'
  });

  constructor() { }

  async saveChats(chats: any[]) {
    await this.cache.setItem('chats', chats);
  }

  async loadChats() {
    const chats = await this.cache.getItem('chats');
    if (chats) {
      return chats;
    } else {
      return [];
    }
  }

}
