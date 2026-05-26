# 🖨 PrinterBridge

PrinterBridge is a lightweight **Electron-based desktop printing agent** that enables secure silent printing from web applications using WebSocket communication — a modern alternative to QZ Tray.

---

## 🚀 Overview

PrinterBridge connects web applications (React, Next.js, etc.) to local printers through a **localhost WebSocket bridge** running on the user's machine.

It enables **silent printing** without browser limitations.

---

## ⚙️ How It Works

```
Frontend (Web App)
        ↓
ws://localhost:3210
        ↓
Electron PrinterBridge App
        ↓
Local Printer (USB / Thermal / Network)
```

---

## ✨ Features

- 🔌 WebSocket-based local bridge
- 🖨 Silent printing support
- 🧾 Thermal printer compatibility (ESC/POS)
- 💻 Works with any frontend (React / Next.js / Vue)
- ⚡ Fast local execution
- 📦 System tray background app
- 🔒 Local-only secure communication

---

## 🧑‍💻 Use Cases

- POS systems (restaurants, retail shops)
- Pharmacy billing systems
- Logistics & shipping labels
- ERP software printing modules
- Hospital & lab reports
- SaaS applications needing print integration

---

## 📦 Tech Stack

- Electron
- Node.js
- WebSocket (`ws`)
- node-thermal-printer
- escpos
- pdf-to-printer

---

## 🛠 Installation

### Clone repo
```bash
git clone https://github.com/afridiashir/printer-bridge.git
cd printer-bridge
```

### Install dependencies
```bash
npm install
```

### Run development
```bash
npm start
```

### Build app
```bash
npm run dist
```

---

## 🌐 Frontend Integration

### Example (JavaScript)
```js
const ws = new WebSocket("ws://localhost:3210");

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: "PRINT",
    payload: "Order #1001 - Burger x2"
  }));
};
```

---

## 🔐 Security Notes

- Runs only on localhost
- No external network exposure by default
- Can be extended with API keys & signed requests

---

## 📌 Roadmap

- [ ] Cloud SaaS dashboard
- [ ] Multi-printer routing
- [ ] Print queue system
- [ ] Authentication layer (API keys)
- [ ] Auto-updates
- [ ] Developer SDK (npm package)

---

## 💡 Why PrinterBridge?

Browsers cannot access printers directly due to security restrictions.

PrinterBridge solves this by acting as a **local bridge between web apps and printers**, similar to QZ Tray but customizable and SaaS-ready.

---

## 📜 License

MIT

---

## 👨‍💻 Author

Built by Ashir Afridi

