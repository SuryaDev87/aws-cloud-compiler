import React, { useState } from 'react';
import { Navbar } from './components/Navbar.jsx';
import { CodeEditor } from './components/CodeEditor.jsx';
import { TelemetryPanel } from './components/TelemetryPanel.jsx';
import { TerminalConsole } from './components/TerminalConsole.jsx';

const TEMPLATES = {
  python: 'print("Hello From AWS Cloud Compiler!")',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello From AWS Cloud Compiler!");\n    }\n}',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello From AWS Cloud Compiler!" << std::endl;\n    return 0;\n}'
};

export default function App() {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(TEMPLATES.python);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [execTime, setExecTime] = useState(null);
  const [status, setStatus] = useState('idle');

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(TEMPLATES[lang]);
  };

  const handleRun = async () => {
    setLoading(true);
    setStatus('running');
    setOutput('Compiling and running code on remote server...');
    const start = performance.now();
    
    try {
      const res = await fetch('http://13.50.5.227:8081/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code }),
      });
      const data = await res.json();
      
      setExecTime(((performance.now() - start) / 1000).toFixed(2));
      
      // Look for standard output strings from your backend compiler
      if (data.error) {
        setStatus('error');
        setOutput(data.error);
      } else {
        setStatus('success');
        setOutput(data.output || 'Code executed successfully with no output returned.');
      }
    } catch (err) {
      setStatus('error');
      setOutput(`Connection Error: Unable to reach compile server.\n${err.message}`);
      setExecTime('0.00');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
      <Navbar 
        language={language} 
        onLanguageChange={handleLanguageChange} 
        onRun={handleRun} 
        loading={loading} 
      />
      
      <main className="flex-1 flex flex-col md:flex-row p-5 gap-5 overflow-hidden max-h-[calc(100vh-70px)]">
        <CodeEditor 
          code={code} 
          setCode={setCode} 
          language={language} 
        />
        
        <div className="w-full md:w-[380px] flex flex-col gap-5 h-full">
          <TelemetryPanel 
            execTime={execTime} 
            status={status} 
          />
          <TerminalConsole 
            output={output} 
            status={status} 
          />
        </div>
      </main>
    </div>
  );
}