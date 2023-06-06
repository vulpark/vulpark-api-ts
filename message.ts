import {req, ServerContext} from "./mod.ts"

export type Message = {
    id: string
    author_id?: string
    content: string
    created: string
}

export async function message_create(ctx: ServerContext, text: string) {
    return await req(ctx, "post", "/messages", JSON.stringify({content: text}))
}
export async function message_fetch_single(ctx: ServerContext, id: string) {
    return await req<Message>(ctx, "get", "/messages/"+id)
}
export async function message_fetch_before(ctx: ServerContext, before: Date) {
    return await req<Message[]>(ctx, "get", "/messages?before="+encodeURIComponent(before.toISOString()))
}
export async function message_fetch_after(ctx: ServerContext, after: Date) {
    return await req<Message[]>(ctx, "get", "/messages?after="+encodeURIComponent(after.toISOString()))
}