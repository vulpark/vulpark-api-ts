import { User } from "./mod.ts"

export type Channel = {
    id: string
    name: string
    location: ChannelLocation
}

export type ChannelResponse = {
    channel: Channel
}

export type ChannelLocation = DmLocation | GuildLocation

type DmLocation = {
    type: "dm",
    users: User[]
}

type GuildLocation = {
    // Not exists yet.
}
