import { BrowserWindow } from "electron";
import { getSelectedPrinter } from "./config";

export async function printReceipt(text: string): Promise<void> {
  const selectedPrinter = getSelectedPrinter();

  console.log(`[Native Printer] Preparing print job for printer: "${selectedPrinter || 'Default System Printer'}"`);

  return new Promise<void>((resolve, reject) => {
    // Create a temporary hidden BrowserWindow
    const tempWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    // Format text inside preformatted HTML with clean receipt styling
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            @page {
              margin: 0;
            }
            body {
              font-family: 'Courier New', Courier, monospace;
              font-size: 12px;
              line-height: 1.3;
              margin: 0;
              padding: 8px;
              white-space: pre-wrap;
              word-wrap: break-word;
              color: #000;
              background-color: #fff;
            }
            .header {
              text-align: center;
              font-weight: bold;
              font-size: 14px;
              margin-bottom: 8px;
            }
            .divider {
              border-top: 1px dashed #000;
              margin: 8px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">RECEIPT</div>
          <div class="divider"></div>
          <div>${escapeHtml(text)}</div>
          <div class="divider"></div>
        </body>
      </html>
    `;

    tempWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);

    tempWindow.webContents.on("did-finish-load", () => {
      tempWindow.webContents.print(
        {
          silent: true,
          printBackground: true,
          deviceName: selectedPrinter || undefined, // undefined falls back to standard system default
        },
        (success, errorType) => {
          tempWindow.close();
          if (success) {
            console.log("[Native Printer] Print task succeeded.");
            resolve();
          } else {
            console.error(`[Native Printer] Print task failed: ${errorType}`);
            reject(new Error(`Printing failed: ${errorType}`));
          }
        }
      );
    });

    tempWindow.webContents.on("did-fail-load", (event, errorCode, errorDescription) => {
      tempWindow.close();
      reject(new Error(`Failed to load print template: ${errorDescription}`));
    });
  });
}

export async function printHTMLReceipt(htmlContent: string): Promise<void> {
  const selectedPrinter = getSelectedPrinter();

  console.log(`[Printer] Using: ${selectedPrinter || "Default"}`);

  return new Promise((resolve, reject) => {
    const tempWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    tempWindow.loadURL(
      `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`
    );

    tempWindow.webContents.once("did-finish-load", async () => {
      try {
        // IMPORTANT: allow render completion
        await new Promise((r) => setTimeout(r, 500));

        tempWindow.webContents.print(
          {
            silent: true,
            printBackground: true,
            deviceName: selectedPrinter || undefined,
          },
          (success, errorType) => {
            console.log("[Printer] success:", success);
            console.log("[Printer] errorType:", errorType);

            // give OS time to flush print queue
            setTimeout(() => {
              tempWindow.close();
            }, 1000);

            if (success) {
              resolve();
            } else {
              reject(new Error(`Print failed: ${errorType}`));
            }
          }
        );
      } catch (err) {
        tempWindow.close();
        reject(err);
      }
    });

    tempWindow.webContents.once(
      "did-fail-load",
      (event, errorCode, errorDescription) => {
        console.error("[Printer] load failed:", errorDescription);
        tempWindow.close();
        reject(new Error(errorDescription));
      }
    );
  });
}

// Simple HTML escaping to render safety
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\n/g, "<br>");
}