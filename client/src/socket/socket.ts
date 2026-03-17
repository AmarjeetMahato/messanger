import {io} from "socket.io-client"

export const socket = io("http://localhost:5000", {
    withCredentials: true,
  transports: ["websocket", "polling"], // Polling को Fallback के लिए रखें
});