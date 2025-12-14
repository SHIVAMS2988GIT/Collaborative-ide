# 🚀 Real-Time Collaborative IDE

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Live-success.svg)

**A distributed code editor enabling sub-millisecond collaboration and remote code execution.**

🔗 **Live Demo:** [Click Here to Open App](https://collaborative-ide.vercel.app) *(Replace this with your actual Vercel link)*

---

## 📖 Overview

This project is a high-performance collaborative code editor similar to **Google Docs for Code** or **VS Code Live Share**. It solves the complex problem of **concurrency** in distributed systems, allowing multiple users to edit the same document simultaneously without data inconsistency or cursor jumps.

It includes a built-in compiler that executes code remotely using a sandboxed API, supporting JavaScript, Python, Java, and C++.

## ✨ Key Features

* **Real-Time Synchronization:** Uses **WebSockets** and **CRDTs (Conflict-free Replicated Data Types)** to ensure eventual consistency across all connected clients.
* **Conflict Resolution:** Implemented **Yjs** to handle complex merge conflicts automatically (e.g., User A types while User B deletes lines).
* **Remote Code Execution:** Integrated the **Piston API** to compile and run code securely in a sandboxed environment.
* **Production-Grade Editor:** Built on **Monaco Editor** (the engine powering VS Code) for full IntelliSense and syntax highlighting.
* **Language Support:** JavaScript, Python, Java, C++.

## 🏗️ System Architecture

1.  **Client (Frontend):** React + Vite. Connects to the WebSocket server to send/receive document "deltas" (small changes).
2.  **Server (Backend):** Node.js + `ws`. Maintains the active "Room" state in memory and broadcasts updates to connected clients.
3.  **Synchronization Engine:** Yjs. Decouples the network layer from the state, allowing for offline-first capabilities and automatic syncing upon reconnection.

## 🛠️ Tech Stack

* **Frontend:** React.js, Monaco Editor, Tailwind CSS
* **Backend:** Node.js, Express, WebSocket (`ws`)
* **State Management:** Yjs (CRDT Implementation)
* **Compiler API:** Piston (External API)
* **Deployment:** Vercel (Frontend), Render (Backend)

## 🚀 How to Run Locally

### Prerequisites
* Node.js installed

### 1. Clone the Repository
```bash
git clone [https://github.com/YOUR_USERNAME/collaborative-ide.git](https://github.com/YOUR_USERNAME/collaborative-ide.git)
cd collaborative-ide