import {ChatModel} from "./chat.model";

export interface ChatParentModel {
  at: number;
  chat: ChatModel[];
  userId: string;
  _id: string;
  __v: number;
}
