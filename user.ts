import {req, ServerContext} from "./mod.ts"

export type User = {
    id: string
    username: string
    discriminator: string
}

export async function user_fetch(ctx: ServerContext, id: string) {
    return await req<User>(ctx, "get", "/users/" + id)
}

export async function user_create(ctx: ServerContext, user: User) {
    return await req(ctx, "post", "/users", JSON.stringify(user))
} 