// Type fuckery
type UnionToIntersection<U> = (
    U extends never ? never : (a: U) => never
) extends (a: infer I) => never ? I : never

type UnionToTuple<U> = UnionToIntersection<
    U extends never ? never : (a: U) => U
> extends (a: never) => infer W ?
    [...UnionToTuple<Exclude<U, W>>, W] :
    []

type REnumMidpoint<Obj extends ([string, REnumValue])[]> = {
    [I in keyof Obj]: 
        (Obj[I][1] extends void ?
            Obj[I][0] :
            { [K in Obj[I][0]]: Obj[I][1] }) &
        { [K in Exclude<Obj[number][0], Obj[I][0]>]?: undefined }
}[number]

type EntryMidpoint<O extends {[K in S]: REnumValue}, S extends number|string|symbol = keyof O> = { [K in keyof O]: [K, O[K]] }

type Entries<
    O extends {[K in S]: REnumValue},
    S extends number|string|symbol = keyof O,
    V = UnionToTuple<EntryMidpoint<O>[S]>
> = V extends [string, REnumValue][] ? V : never

// The actual good stuff
export type REnumValue = undefined|void|{[K in string]: unknown}|unknown[]

export type REnum<O extends {[K in string]: REnumValue}> = REnumMidpoint<Entries<O>>

export type Result<T, E> = REnum<{
    Ok: [T]
    Err: [E]
}>

export function Ok<T>(ok: T):  Exclude<Result<T, unknown>, {Err: unknown[]}> { return { Ok: [ok] } }
export function Err<E>(err: E): Exclude<Result<unknown, E>, {Ok: unknown[]}> { return { Err: [err] } }

export type Option<T> = REnum<{
    Some: [T]
    None: void
}>

export function Some<T>(some: T): Exclude<Option<T>, "None"> { return { Some: [some] } }
export const None: Exclude<Option<unknown>, {Some: unknown[]}> = "None"
