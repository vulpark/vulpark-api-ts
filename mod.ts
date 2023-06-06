export * from "./event.ts"
export * from "./user.ts"
export * from "./message.ts"
export * from "./channel.ts"

import { on_event, dispatch_event, Response } from "./event.ts"
import {User} from "./user.ts";
import {Message} from "./message.ts"

export class ServerContext {
    base_url: string
    client: WebSocket
    token: string
    constructor(base_url: string, token: string) {
        this.base_url = base_url
        this.client = new WebSocket(`ws://${base_url}/gateway`)
        this.token = token
        
        this.client.onmessage = message => {
            const msg = JSON.parse(message.data)
            dispatch_event(msg)
        }
        on_event("HandshakeStart", _ => {
            const data = {
                Handshake: {
                    token
                }
            }
            this.client.send(JSON.stringify(data))
        })
    }
}
export async function req<T>(ctx: ServerContext, method: string, path: string, body?: string): Promise<Response<T>> {
    return (await fetch("http://" + ctx.base_url + path, {
        method, body,
        headers: {
            "Content-Type": body ? "applicatioon/json" : undefined,
            "Authorization": ctx.token
        }
    })).json()
}
