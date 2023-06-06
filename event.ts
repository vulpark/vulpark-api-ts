import {User} from "./user.ts"
import {Message} from "./message.ts"

export type EventType = "MessageCreate" | "HandshakeStart" | "HandshakeComplete"

export type Event = {
    HandshakeStart: HandshakeStart
    HandshakeComplete: undefined
    MessageCreate: undefined
} | {
    HandshakeStart: undefined
    HandshakeComplete: HandshakeComplete
    MessageCreate: undefined
} | {
    HandshakeStart: undefined
    HandshakeComplete: undefined
    MessageCreate: MessageCreate
}

export type SpecificEvent<T extends EventType> =
    T extends "MessageCreate" ? MessageCreate :
    T extends "HandshakeStart" ? HandshakeStart :
    T extends "HandshakeComplete" ? HandshakeComplete :
    never

export type EventCallback<T extends EventType> = {
    type: T,
    func: (event: SpecificEvent<T>) => void|Promise<void>
}

export type HandshakeStart = never

export type HandshakeComplete = {
    user: User
}

export type MessageCreate = {
    message: Message
    author?: User
}

export type Response<T> = { Success: {data: T}, Error?: undefined} | {Success?: undefined, Error: {status_code: number, message: string } }

const listeners: EventCallback<EventType>[] = []

export function on_event<T extends EventType>(type: T, func: (event: SpecificEvent<T>) => void|Promise<void>) {
    listeners.push({type, func})
}

export function dispatch_event(event: Event) {
    listeners.forEach(it => {
        const ev = event[it.type]
        if(ev)
            it.func(ev)
    })
}

