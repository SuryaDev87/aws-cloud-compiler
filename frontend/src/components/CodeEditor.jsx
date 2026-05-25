import React from "react";
import Editor from "@monaco-editor/react";

export function CodeEditor({ code, setCode, language }) {
  const filename =
    language === "python"
      ? "main.py"
      : language === "java"
        ? "Main.java"
        : "main.cpp";

  return (
    <div className="flex-1 flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-[#0d1117] shadow-2xl">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-[#161b22]">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
          </div>

          <span className="text-sm text-slate-300 font-mono">{filename}</span>
        </div>

        <span className="text-xs text-slate-500 font-mono">Monaco Editor</span>
      </div>

      {/* Monaco */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          value={code}
          theme="vs-dark"
          onChange={(value) => setCode(value || "")}
          options={{
            fontSize: 14,
            fontFamily: "JetBrains Mono, monospace",
            minimap: { enabled: false },
            smoothScrolling: true,
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            roundedSelection: true,
            wordWrap: "on",
          }}
        />
      </div>
    </div>
  );
}
