export * from "./event.ts"
export * from "./user.ts"
export * from "./message.ts"
export * from "./channel.ts"

import { Event, EventType, Response, SpecificEvent } from "./event.ts"
import { MessageResponse } from "./message.ts";
import { User } from "./user.ts";

const BASE_URL = "127.0.0.1:8000"

export async function req<T>(method: string, path: string, body?: string, token?: string): Promise<Response<T>> {
    return (await fetch("http://" + BASE_URL + path, {
        method, body,
        // @ts-ignore type checker is dumb sometimes
        headers: {
            "Content-Type": body ? "application/json" : undefined,
            "Authorization": token
        }
    })).json()
}

type EventBus = {
    [K in EventType]?: ((event: SpecificEvent<K>) => void|Promise<void>)[]
}

export class Client {
    socket: WebSocket
    token: string
    private bus: EventBus = {}
    private busAny: ((event: Event) => void|Promise<void>)[] = []
    constructor(token: string) {
        this.socket = new WebSocket(`ws://${BASE_URL}/gateway`)
        this.token = token
        
        this.socket.onmessage = message => this.dispatchEvent(JSON.parse(message.data))

        this.on("HandshakeStart", _ => {
            const data = {
                Handshake: {
                    token
                }
            }
            this.socket.send(JSON.stringify(data))
        })
    }

    private async dispatchEvent(event: Event) {
        for (const callback of this.busAny) {
            try {
                await callback(event)
            } catch (e) {
                console.error(e)
            }
        }
        for (const k in event) {
            const events = this.bus[k as EventType]
            if (events) {
                for (const callback of events) {
                    try {
                        //@ts-ignore It's guarunteed that it's right.
                        await callback(event[k])
                    } catch (e) {
                        console.error(e)
                    }
                }
            }
        }
    }

    on<T extends EventType>(event: T, callback: (event: SpecificEvent<T>) => void|Promise<void>) {
        if (!this.bus[event])
            this.bus[event] = []
        this.bus[event]!.push(callback)
    }

    onAny(callback: (event: Event) => void|Promise<void>) {
        this.busAny.push(callback)
    }

    async req<T>(method: string, path: string, body?: string) {
        return await req<T>(method, path, body, this.token)
    }

    async createMessage(content: string) {
        return await this.req<MessageResponse>("post", "/messages", JSON.stringify({content}))
    }

    async fetchMessagesAfter(after: Date, max = 25) {
        return await this.req<MessageResponse[]>("get", "/messages?after="+encodeURIComponent(after.toISOString())+"&max="+max)
    }

    async fetchMessagesBefore(before: Date, max = 25) {
        return await this.req<MessageResponse[]>("get", "/messages?before="+encodeURIComponent(before.toISOString())+"&max="+max)
    }

    async fetchMessage(id: string) {
        return await this.req<MessageResponse>("get", "/messages/"+id)
    }

    async fetchUser(id: string) {
        return await this.req<User>("get", "/users/" + id)
    }
}
