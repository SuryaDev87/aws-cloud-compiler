import React from 'react';

export function TelemetryPanel({ execTime, status }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 font-mono text-xs shadow-sm">
      <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-3">
        <span className="text-slate-400 font-medium text-[11px]">Execution Metadata</span>
        <span className="flex items-center gap-1.5 text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
          Connected
        </span>
      </div>
      
      <div className="space-y-2 text-slate-300">
        <div className="flex justify-between py-1 border-b border-slate-800/40">
          <span className="text-slate-500">Server IP:</span>
          <span>13.50.5.227</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-slate-500">Execution Time:</span>
          <span className={execTime ? "text-indigo-400 font-medium" : "text-slate-500"}>
            {execTime ? `${execTime}s` : '--'}
          </span>
        </div>
      </div>
    </div>
  );
}