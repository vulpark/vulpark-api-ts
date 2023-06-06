import { crayon } from "https://deno.land/x/crayon@3.3.3/mod.ts"
import { Box, TextBox, Label } from "https://deno.land/x/tui@2.0.0-RC4/src/components/mod.ts"
import { handleInput, handleKeyboardControls, handleMouseControls, Tui } from "https://deno.land/x/tui@2.0.0-RC4/mod.ts"
import { Key } from "https://deno.land/x/tui@2.0.0-RC4/src/input_reader/types.ts"
import {Client, on_event, message_fetch_before, user_fetch, message_create} from "./mod.ts";

const ctx = new Client("127.0.0.1:8000", "01H1X4PJY8AHR3Q2CFTBE7P75H")
const tui = new Tui({})

handleInput(tui);
handleMouseControls(tui)
handleKeyboardControls(tui)

const channel_theme = {
    base: crayon.rgb(184, 212, 227).bgRgb(79, 86, 101)
}

const channels = new Box({
    parent: tui,
    theme: channel_theme,
    rectangle: {
        row: 0,
        column: 0,
        width: 32,
        height: tui.canvas.size.value.rows
    },
    zIndex: 0,
})

const channels_list = new Label({
    parent: channels,
    align: {
        horizontal: "left",
        vertical: "top"
    },
    text: "owo",
    rectangle: {
        row: 0,
        column: 0,
        width: 32,
        height: tui.canvas.size.value.rows
    },
    theme: channel_theme,
    zIndex: 1
})

const messages = new Label({
    parent: tui,
    align: {
        horizontal: "left",
        vertical: "bottom"
    },
    text: "",
    rectangle: {
        row: 0,
        column: 32,
        width: tui.canvas.size.value.columns - 32,
        height: tui.canvas.size.value.rows - 1
    },
    theme: {
        base: crayon.rgb(196, 228, 234).bgRgb(100, 111, 126)
    },
    zIndex: 0
})

function add_message(text: string) {
    const curr_text = messages.text.value.split("\n")
    while (curr_text.length >= 25)
        curr_text.shift()
    curr_text.push(text)
    messages.text.value = curr_text.join("\n").trim()
}

// TODO move this elsewhere?
on_event("MessageCreate", ({message, author}) => {
    const user = author!.username
    add_message(`${user}: ${message.content}`)
})

async function fetch_messages() {
    const messages = await message_fetch_before(ctx, new Date())
    if(messages.Error)
        return
    for(const it of messages.Success.data) {
        const user = await user_fetch(ctx, it.author_id)
        if(user.Error)
            return
        add_message(`${user.Success.data.username}: ${it.content}`)
    }
}
fetch_messages()

const chat_input = new TextBox({
    parent: tui,
    rectangle: {
        width: tui.canvas.size.value.columns - 32,
        height: 1,
        row: tui.canvas.size.value.rows - 1,
        column: 32
    },
    theme: {
        base: crayon.rgb(184, 212, 227).bgRgb(79, 86, 101),
        cursor: {
            base: crayon.bgRgb(184, 212, 227)
        }
    },
    zIndex: 0
})

let text = ""

const ignore_keys: Key[] = [
    "tab",
    "escape",
    "up",
    "down",
    "left",
    "right",
    "clear",
    "insert",
    "delete",
    "pageup",
    "pagedown",
    "home",
    "end",
    "tab"
]

chat_input.on("keyPress", ev => {
    const key = ev.key;
    if (ignore_keys.indexOf(key) != -1 ) return
    if (ev.key == "return") {
        if(text)
            message_create(ctx, text)
        text = ""
        chat_input.text.value = ""
    } else if (ev.key == "backspace") {
        text = text.substring(0, text.length-1)
    } else {
        text += new TextDecoder().decode(ev.buffer)
    }
})

tui.canvas.on("render", () => {
    channels.rectangle.value.height = tui.canvas.size.value.rows
    channels_list.rectangle.value.height = tui.canvas.size.value.rows
    chat_input.rectangle.value.width = tui.canvas.size.value.columns - 32
    chat_input.rectangle.value.row = tui.canvas.size.value.rows - 1
    messages.rectangle.value.width = tui.canvas.size.value.columns - 32
    messages.rectangle.value.height = tui.canvas.size.value.rows - 1
})

tui.dispatch();

tui.run()
