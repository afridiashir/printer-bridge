import { app } from "electron";
import fs from "fs";
import path from "path";

let configPath: string | null = null;

function getConfigPath(): string {
  if (!configPath) {
    configPath = path.join(app.getPath("userData"), "config.json");
  }
  return configPath;
}

export function getSelectedPrinter(): string {
  try {
    const filePath = getConfigPath();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      const config = JSON.parse(content);
      return config.selectedPrinter || "";
    }
  } catch (err) {
    console.error("Failed to read printer config:", err);
  }
  return "";
}

export function setSelectedPrinter(printerName: string): void {
  try {
    const filePath = getConfigPath();
    const config = { selectedPrinter: printerName };
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write printer config:", err);
  }
}
