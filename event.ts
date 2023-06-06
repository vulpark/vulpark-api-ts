import { Channel } from "./channel.ts";
import { MessageResponse } from "./message.ts";
import { User } from "./user.ts";

export type EventType = keyof Event

export type Event = {
    HandshakeStart?: Record<string, unknown>
    HandshakeComplete?: HandshakeComplete
    MessageCreate?: MessageResponse
    ChannelCreate?: ChannelCreate
}

export type SpecificEvent<T extends EventType> = Event[T] & Record<string|number|symbol, unknown>

export type EventCallback<T extends EventType> = {
    type: T,
    func: (event: SpecificEvent<T>) => void|Promise<void>
}

export type HandshakeStart = never

export type HandshakeComplete = {
    user: User
}

export type ChannelCreate = {
    channel: Channel,
    creator: User
}

export type Response<T> = T | {error_code: number, message: string}
