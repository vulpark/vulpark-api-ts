import { Client } from "./mod.ts";

const client = new Client("01H1X4PJY8AHR3Q2CFTBE7P75H")

client.onAny(ev => {
    console.log(ev)
})
