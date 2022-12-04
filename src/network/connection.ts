import { Manager } from "socket.io-client";


export const socketManager = new Manager("https://piratezzz.glitch.me", {
    reconnectionDelayMax: 10000,
    autoConnect: true,
});

export const socket = socketManager.socket('/');