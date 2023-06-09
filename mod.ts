import { Event, EventType, Response, SpecificEvent } from "./event.ts"
import { MessageResponse } from "./message.ts";
import * as message from "./message.ts";
import { User } from "./user.ts";
import * as user from "./user.ts"
const BASE_URL = "127.0.0.1:8000"

export async function req<T>(method: string, path: string, body?: unknown, token?: string): Promise<Response<T>> {
    const res = await fetch("http://" + BASE_URL + path, {
        method, body: body ? JSON.stringify(body) : undefined,
        // @ts-ignore type checker is dumb sometimes
        headers: {
            "Content-Type": body ? "application/json" : undefined,
            "Authorization": token
        }
    })
    const text = await res.text()
    console.log(text)
    return JSON.parse(text)
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
        for (const k in this.bus) {
            const t = k as EventType
            const events = this.bus[t]!
            const ev = event[t] as SpecificEvent<typeof t>
            if (!ev) continue
            for (const callback of events) {
                const cb = callback as (event: typeof ev) => void|Promise<void>
                try {
                    await cb(ev)
                } catch (e) {
                    console.error(e)
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

    async req<T>(method: string, path: string, body?: unknown) {
        return await req<T>(method, path, body, this.token)
    }
}

user.init()
message.init()

type PromiseResponse<T> = Promise<Response<T>>

export interface Client {
    createMessage(channel_id: string, content: string): PromiseResponse<MessageResponse>
    fetchMessagesBefore(before: Date, max?: number): PromiseResponse<MessageResponse[]>
    fetchMessagesAfter(after: Date, max?: number): PromiseResponse<MessageResponse[]>
    fetchMessage(id: string): PromiseResponse<MessageResponse>

    fetchUser(id: string): PromiseResponse<User>
}
