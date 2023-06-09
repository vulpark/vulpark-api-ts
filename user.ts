import {Client, req} from "./mod.ts"

export type User = {
    id: string
    username: string
    discriminator: string
}

export type LoginService = "github"

export type UserCreate = {
    username: string
    service: LoginService
    oauth_code: string
}

export type UserLoginResponse = {
    user: User,
    token: string
}

export async function createUser(user: UserCreate) {
    return await req<UserLoginResponse>("post", "/users", JSON.stringify(user))
}

export function init() {
    Client.prototype.fetchUser = async function (id: string) {
        return await this.req<User>("get", "/users/" + id)
    }    
}