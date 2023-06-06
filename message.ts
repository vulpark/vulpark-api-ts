import {User} from "./mod.ts"

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
