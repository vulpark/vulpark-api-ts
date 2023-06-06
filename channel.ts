import { User } from "./user.ts"

export type Channel = {
    id: string
    name: string
    location: ChannelLocation
}

export type ChannelLocation = DmLocation | GuildLocation

type DmLocation = {
    type: "dm",
    users: User[]
}

type GuildLocation = {
    // Not exists yet.
}
