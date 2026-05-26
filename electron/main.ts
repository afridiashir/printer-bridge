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
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

//   mainWindow.loadFile("renderer/index.html");
// mainWindow.loadFile(
//   path.join(__dirname, "../../renderer/index.html")
// );
mainWindow.loadFile(
  path.join(process.resourcesPath, "renderer/index.html")
);
}

app.whenReady().then(() => {
  createWindow();
  createTray(mainWindow!);
  startWebSocketServer();
});

app.on("window-all-closed", () => {
  // Keep running in tray
  app.quit();
});

app.setLoginItemSettings({
  openAtLogin: true,
});