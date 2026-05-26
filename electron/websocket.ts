import WebSocket, { WebSocketServer } from "ws";
import { printReceipt, printHTMLReceipt } from "./printer";

export function startWebSocketServer() {
  const wss = new WebSocketServer({ port: 3210 });

  console.log("WebSocket running on ws://localhost:3210");

  wss.on("connection", (ws: WebSocket) => {
    console.log("Client connected");

    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log("[WebSocket] Received message:", data);

        if (data.type === "PRINT") {
          await printReceipt(data.payload);

          ws.send(
            JSON.stringify({
              success: true,
            })
          );
        }

        if (data.type === "PRINT_HTML") {
          await printHTMLReceipt(data.payload);
          console.log("[WebSocket] HTML content printed successfully");

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