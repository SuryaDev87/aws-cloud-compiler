import React from "react";

export function TerminalConsole({ output, status }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-black shadow-2xl">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
          </div>

          <span className="text-sm text-slate-300 font-mono">terminal</span>
        </div>

        {status !== "idle" && (
          <span
            className={`text-xs px-3 py-1 rounded-full font-mono border ${
              status === "error"
                ? "bg-red-500/10 text-red-400 border-red-500/20"
                : status === "running"
                  ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                  : "bg-green-500/10 text-green-400 border-green-500/20"
            }`}
          >
            {status}
          </span>
        )}
      </div>

      {/* Console Body */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm bg-[#0d1117] text-green-400">
        <div className="mb-2 text-slate-500">user@compiler:~$</div>

        <pre className="whitespace-pre-wrap break-words leading-6">
          {output || "Run your code to see output..."}
        </pre>

        <div className="flex items-center mt-2">
          <span className="text-slate-500 mr-2">user@compiler:~$</span>

          <span className="w-2 h-5 bg-green-400 animate-pulse rounded-sm"></span>
        </div>
      </div>
    </div>
  );
}
