import React, { useState } from 'react';

function App() {
  const [code, setCode] = useState('print("Hello From AWS Cloud Compiler!")');
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    setOutput('Executing code on AWS EC2...');
    try {
      const response = await fetch('http://13.50.5.227:8081/api/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language, code }),
      });
      const data = await response.json();
      setOutput(data.output || 'No output returned.');
    } catch (error) {
      setOutput('Error connecting to backend server: ' + error.message);
    } finally {
      setLanguage(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wider text-cyan-400"> AWS Cloud Compiler</h1>
        <div className="flex items-center gap-4">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-700 border border-slate-600 rounded px-3 py-1.5 focus:outline-none focus:border-cyan-400"
          >
            <option value="python">Python 3</option>
          </select>
          <button 
            onClick={handleRun}
            disabled={loading}
            className={`font-semibold px-5 py-1.5 rounded transition-all ${
              loading ? 'bg-slate-600 cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
            }`}
          >
            {loading ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col md:flex-row p-6 gap-6">
        {/* Code Editor Panel */}
        <div className="flex-1 flex flex-col bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="bg-slate-850 px-4 py-2 border-b border-slate-700 text-sm font-mono text-slate-400">
            main.py
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 p-4 bg-slate-950 font-mono text-sm text-emerald-400 focus:outline-none resize-none leading-relaxed"
            rows="15"
          />
        </div>

        {/* Console Output Panel */}
        <div className="w-full md:w-1/3 flex flex-col bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="bg-slate-850 px-4 py-2 border-b border-slate-700 text-sm font-mono text-slate-400">
            Console Output
          </div>
          <pre className="flex-1 p-4 bg-slate-900 font-mono text-sm text-slate-200 overflow-auto whitespace-pre-wrap">
            {output || 'Click "Run Code" to view execution results.'}
          </pre>
        </div>
      </main>
    </div>
  );
}

export default App;