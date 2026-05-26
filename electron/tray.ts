import { Tray, Menu, BrowserWindow } from "electron";
import path from "path";

import { app } from "electron";

let tray: Tray;

const iconPath = path.join(__dirname, "../../assets/icon.png");

export function createTray(win: BrowserWindow) {
  tray = new Tray(iconPath);

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