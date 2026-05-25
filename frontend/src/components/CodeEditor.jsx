import React from 'react';

export function CodeEditor({ code, setCode, language }) {
  const filename = language === 'python' ? 'main.py' : language === 'java' ? 'Main.java' : 'main.cpp';

  return (
    <div className="flex-1 flex flex-col bg-slate-950 rounded-lg border border-slate-800 shadow-inner overflow-hidden">
      <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex justify-between items-center text-xs font-mono text-slate-400">
        <span className="flex items-center gap-2">
          <span className="text-cyan-500">📄</span> {filename}
        </span>
        <span className="text-[10px] text-slate-600">UTF-8</span>
      </div>
      
      <div className="flex-1 flex font-mono text-sm leading-6 relative">
        {/* Student Project Touch: Embedded Left Line Counters */}
        <div className="bg-slate-900/40 text-slate-600 text-right px-3 py-4 select-none border-r border-slate-900/60 min-w-[3.5rem] text-xs">
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className="h-6">{i + 1}</div>
          ))}
        </div>
        
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 bg-transparent p-4 text-emerald-400 focus:outline-none resize-none overflow-y-auto font-mono tracking-wide w-full h-full"
          placeholder="# Write code logic execution matrix here..."
        />
      </div>
    </div>
  );
}