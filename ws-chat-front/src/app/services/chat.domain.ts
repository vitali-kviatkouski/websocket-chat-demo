export interface Chat {
    id: number,
    name: string
}

export class ChatState {
    id: number;
    messages: String[];

    constructor(id: number, messages: String[]) {
        this.id = id;
        this.messages = messages;
    }
}