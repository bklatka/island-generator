import { getRandomInRange } from "./getRandomInRange";


export function getRandomFromArray<T = unknown>(someArray: T[]) {
    return someArray[getRandomInRange(0, someArray.length)];
}