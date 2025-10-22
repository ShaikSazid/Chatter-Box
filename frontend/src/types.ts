
export interface User {
  id: string;
  username: string;
}

export interface Message {
  _id: string;
  role: 'user' | 'assistant';
  content: string;
  timeStamp: string;
}

export interface Thread {
  _id: string;
  title: string;
  messages: Message[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export type Block =
  | { type: "text"; content: string }
  | { type: "list"; content: string[] }
  | { type: "table"; content: string[][] }
  | { type: "code"; content: string };