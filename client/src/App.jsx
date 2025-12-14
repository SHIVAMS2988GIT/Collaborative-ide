import { useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import "./App.css";

// 1. Language versions for the Piston API
const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  python: "3.10.0",
  java: "15.0.2",
  cpp: "10.2.0",
};

function App() {
  const editorRef = useRef(null);
  const [status, setStatus] = useState("Connecting...");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState(""); // Stores console output
  const [isLoading, setIsLoading] = useState(false);

  const languages = [
    { name: "JavaScript", value: "javascript" },
    { name: "Python", value: "python" },
    { name: "Java", value: "java" },
    { name: "C++", value: "cpp" }, // Note: Piston expects "c++" not "cpp" usually, but we handle mapping below if needed
  ];

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    const doc = new Y.Doc();
    // OLD
// const provider = new WebsocketProvider("ws://localhost:3001", "monaco-demo", doc);

// NEW (Use your Render URL with wss://)
const provider = new WebsocketProvider(
  "wss://ide-backend-dpiv.onrender.com",
  "monaco-demo",
  doc
);
    const type = doc.getText("monaco");
    const binding = new MonacoBinding(type, editor.getModel(), new Set([editor]), provider.awareness);

    provider.on("status", (event) => {
      setStatus(event.status === "connected" ? "🟢 Live" : "🔴 Disconnected");
    });
  }

  // 2. The Function to Run Code
  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;

    setIsLoading(true);
    
    // Piston API Endpoint
    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: language === "cpp" ? "c++" : language, // Fix naming for API
          version: LANGUAGE_VERSIONS[language],
          files: [{ content: sourceCode }],
        }),
      });

      const data = await response.json();
      
      // Handle the result
      if (data.run) {
        setOutput(data.run.output);
      } else {
        setOutput("Error: " + data.message);
      }
    } catch (error) {
      setOutput("Failed to execute code: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* HEADER */}
      <div style={{ padding: "10px 20px", background: "#1e1e1e", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #333" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <h3 style={{ margin: 0 }}>Collaborative IDE</h3>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            style={{ padding: "5px", borderRadius: "4px", background: "#333", color: "white", border: "1px solid #555" }}
          >
            {languages.map((lang) => <option key={lang.value} value={lang.value}>{lang.name}</option>)}
          </select>
          
          {/* RUN BUTTON */}
          <button 
            onClick={runCode} 
            disabled={isLoading}
            style={{
              padding: "5px 15px",
              background: isLoading ? "#555" : "#4caf50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontWeight: "bold"
            }}
          >
            {isLoading ? "Running..." : "▶ Run Code"}
          </button>
        </div>
        <span style={{ fontSize: "14px", fontWeight: "bold" }}>{status}</span>
      </div>

      {/* MAIN CONTENT SPLIT: EDITOR + OUTPUT */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Editor Area (70% height) */}
        <div style={{ flex: 7 }}>
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            onMount={handleEditorDidMount}
            options={{ minimap: { enabled: false }, fontSize: 14 }}
          />
        </div>

        {/* Output Terminal (30% height) */}
        <div style={{ flex: 3, background: "#1e1e1e", borderTop: "2px solid #333", padding: "10px", overflowY: "auto", fontFamily: "monospace", color: "#ddd" }}>
          <div style={{ color: "#888", marginBottom: "5px", textTransform: "uppercase", fontSize: "12px" }}>Terminal Output</div>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
            {output || 'Click "Run Code" to see output here...'}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default App;