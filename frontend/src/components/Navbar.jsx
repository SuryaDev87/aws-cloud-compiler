import React from 'react';

export function Navbar({ language, onLanguageChange, onRun, loading }) {
  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-2">
        <h1 className="text-md font-semibold tracking-tight text-slate-200">
          SuryaDev <span className="text-slate-500 font-normal">|</span> <span className="text-slate-400 font-mono text-xs font-medium">Online IDE</span>
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-xs font-mono text-slate-400">Language:</label>
          <select 
            value={language} 
            onChange={(e) => onLanguageChange(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs rounded px-2.5 py-1.5 font-mono text-slate-300 focus:outline-none focus:border-slate-500 cursor-pointer"
          >
            <option value="python">Python 3</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>

        <button 
          onClick={onRun}
          disabled={loading}
          className={`font-mono text-xs font-medium px-4 py-1.5 rounded transition-all ${
            loading 
              ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed' 
              : 'bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95 shadow-sm'
          }`}
        >
          {loading ? 'Running...' : 'Run Code'}
        </button>
      </div>
    </header>
  );
}