import { app, BrowserWindow } from "electron";
import path from "path";
import { createTray } from "./tray";
import { startWebSocketServer } from "./websocket";

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    show: false,
  });

  mainWindow.loadFile(
    path.join(__dirname, "../../renderer/index.html")
  );
}

app.whenReady().then(() => {
  createWindow();
  createTray(mainWindow!);

  console.log("Electron started");
  startWebSocketServer();
});

app.on("window-all-closed", () => {
  // Keep running in tray
  // app.quit();
});

app.setLoginItemSettings({
  openAtLogin: true,
});