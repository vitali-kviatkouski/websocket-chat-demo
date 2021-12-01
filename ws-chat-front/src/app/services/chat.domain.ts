export interface Chat {
    id: number,
    name: string
}

export class ChatState {
    id: number;
    messages: Message[];

    constructor(id: number, messages: Message[]) {
        this.id = id;
        this.messages = messages;
    }
}

export interface Message {
    user: string | null,
    message: string
}