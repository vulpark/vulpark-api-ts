import { Client } from "./mod.ts";

const client = new Client("01H1X4PJY8AHR3Q2CFTBE7P75H")

client.onAny(ev => {
    console.log(ev)
})

client.on("HandshakeComplete", _ => {
    client.createMessage("01H2724PX63W7D9CJWWMSXNA67", "owo")
})
