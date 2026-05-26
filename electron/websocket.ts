import WebSocket, { WebSocketServer } from "ws";
import { printReceipt } from "./printer";

export function startWebSocketServer() {
  const wss = new WebSocketServer({ port: 3210 });

  console.log("WebSocket running on ws://localhost:3210");

  wss.on("connection", (ws: WebSocket) => {
    console.log("Client connected");

    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message.toString());

        if (data.type === "PRINT") {
          await printReceipt(data.payload);

          ws.send(
            JSON.stringify({
              success: true,
            })
          );
        }
      } catch (err) {
        ws.send(
          JSON.stringify({
            success: false,
            error: "Printing failed",
          })
        );
      }
    });
  });
}