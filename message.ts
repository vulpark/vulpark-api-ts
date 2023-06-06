import {req, Client} from "./mod.ts"

export type Message = {
    id: string
    author_id?: string
    content: string
    created: string
}

export async function message_create(ctx: Client, content: string) {
    return await req(ctx, "post", "/messages", JSON.stringify({content}))
}
export async function message_fetch_single(ctx: Client, id: string) {
    return await req<Message>(ctx, "get", "/messages/"+id)
}
export async function message_fetch_before(ctx: Client, before: Date) {
    return await req<Message[]>(ctx, "get", "/messages?before="+encodeURIComponent(before.toISOString()))
}
export async function message_fetch_after(ctx: Client, after: Date) {
    return await req<Message[]>(ctx, "get", "/messages?after="+encodeURIComponent(after.toISOString()))
}