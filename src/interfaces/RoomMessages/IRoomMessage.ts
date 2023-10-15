export interface IUserMessage {
  userId: string;
  userName: string;
  message: string;
  messageTime?: number;
  iv?: string;
}

export interface IRoomMessage {
  roomId: string;
  roomName?: string;
  messages: IUserMessage[];
}
