import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("printerBridge", {
  getPrinters: () => ipcRenderer.invoke("get-printers"),
  getSelectedPrinter: () => ipcRenderer.invoke("get-selected-printer"),
  setSelectedPrinter: (name: string) => ipcRenderer.invoke("set-selected-printer", name),
  testPrint: (name: string) => ipcRenderer.invoke("test-print", name),
});
