import { Channel } from "./channel.ts";
import { MessageResponse } from "./message.ts";
import { User } from "./user.ts";

import { REnum } from "./renum.ts";

export type EventType = Event extends string ? Event : keyof Event

export type Event = REnum<{
    HandshakeStart: Record<never, never>
    HandshakeComplete: HandshakeComplete
    MessageCreate: MessageResponse
    ChannelCreate: ChannelCreate
}>

export type SpecificEvent<T extends EventType> = NonNullable<Event[T]>

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
