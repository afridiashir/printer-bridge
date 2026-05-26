import { Tray, Menu, BrowserWindow } from "electron";
import path from "path";

let tray: Tray;

export function createTray(win: BrowserWindow) {
  tray = new Tray(path.join(__dirname, "icon.png"));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Open",
      click: () => {
        win.show();
      },
    },
    {
      label: "Quit",
      click: () => {
        process.exit(0);
      },
    },
  ]);

  tray.setToolTip("Printer Bridge");
  tray.setContextMenu(contextMenu);
}