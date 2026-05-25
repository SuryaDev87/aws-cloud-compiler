import React from 'react';

export function TerminalConsole({ output, status }) {
  return (
    <div className="flex-1 flex flex-col bg-slate-950 border border-slate-800 rounded-lg overflow-hidden shadow-md">
      <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
        <span className="text-xs font-mono text-slate-400">Console Output</span>
        {status !== 'idle' && (
          <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${
            status === 'error' ? 'bg-rose-950/30 text-rose-400 border-rose-900/50' : 
            status === 'running' ? 'bg-amber-950/30 text-amber-400 border-amber-900/50' : 
            'bg-emerald-950/30 text-emerald-400 border-emerald-900/50'
          }`}>
            {status}
          </span>
        )}
      </div>
      
      <div className="flex-1 p-4 font-mono text-xs overflow-y-auto whitespace-pre-wrap text-slate-300">
        {output || 'No execution history. Click "Run Code" to view output.'}
      </div>
    </div>
  );
}