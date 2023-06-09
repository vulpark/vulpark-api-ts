import {Client} from "./mod.ts"
import { User } from "./user.ts";

export type Message = {
    id: string
    author_id?: string
    content: string
    created: string
}

export type MessageResponse = {
    message: Message
    author?: User
}

export function init() {
    Client.prototype.createMessage = async function (channel_id, content) {
        return await this.req<MessageResponse>("post", "/messages", {channel_id, content})
    }
    Client.prototype.fetchMessagesAfter = async function (after, max = 25) {
        return await this.req<MessageResponse[]>("get", "/messages?after="+encodeURIComponent(after.toISOString())+"&max="+max)
    }
    Client.prototype.fetchMessagesBefore = async function (before, max = 25) {
        return await this.req<MessageResponse[]>("get", "/messages?before="+encodeURIComponent(before.toISOString())+"&max="+max)
    }
    Client.prototype.fetchMessage = async function (id) {
        return await this.req<MessageResponse>("get", "/messages/"+id)
    }
}
