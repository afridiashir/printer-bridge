import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { createTray } from "./tray";
import { startWebSocketServer } from "./websocket";
import { getSelectedPrinter, setSelectedPrinter } from "./config";
import { printReceipt } from "./printer";

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 450,
    height: 650,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
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

  // Register IPC handlers
  ipcMain.handle("get-printers", async () => {
    if (!mainWindow) return [];
    return await mainWindow.webContents.getPrintersAsync();
  });

  ipcMain.handle("get-selected-printer", () => {
    return getSelectedPrinter();
  });

  ipcMain.handle("getPort", () => {
    return 3210;
  })

  ipcMain.handle("set-selected-printer", (event, name: string) => {
    setSelectedPrinter(name);
    return { success: true };
  });

  ipcMain.handle("test-print", async (event, name: string) => {
    try {
      await printReceipt("Test print successful!\nYour printer bridge is active and working.");
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to print" };
    }
  });
});

app.on("window-all-closed", () => {
  // Keep running in tray
  // app.quit();
});

app.setLoginItemSettings({
  openAtLogin: true,
});