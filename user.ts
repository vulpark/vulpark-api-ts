import {req, Client} from "./mod.ts"

export type User = {
    id: string
    username: string
    discriminator: string
}

export type UserCreateResponse = {
    user: User,
    token: string
}

export async function user_fetch(ctx: Client, id: string) {
    return await req<User>(ctx, "get", "/users/" + id)
}

export async function user_create(ctx: Client, username: string) {
    return await req<UserCreateResponse>(ctx, "post", "/users", JSON.stringify({username}))
}
