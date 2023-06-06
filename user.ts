import {req} from "./mod.ts"

export type User = {
    id: string
    username: string
    discriminator: string
}

export type UserCreateResponse = {
    user: User,
    token: string
}

export async function createUser(username: string) {
    return await req<UserCreateResponse>("post", "/users", JSON.stringify({username}))
}
