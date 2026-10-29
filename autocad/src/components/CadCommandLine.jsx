import React, { useRef, useEffect } from 'react';
import { Terminal, Send } from 'lucide-react';
import { useCad } from '../context/CadContext';

export default function CadCommandLine() {
  const {
    commandLog,
    commandInput,
    setCommandInput,
    executeCommand,
  } = useCad();

  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [commandLog]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    executeCommand(commandInput);
  };

  return (
    <div className="bg-[#181818] border-t border-[#333333] px-3 py-1.5 flex flex-col shrink-0 select-none font-mono text-xs z-30 shadow-2xl">
      {/* Command Output Log (Last 3 lines) */}
      <div className="h-14 overflow-y-auto space-y-0.5 text-gray-400 text-[11px] pb-1 select-text">
        {commandLog.slice(-5).map((log, idx) => (
          <div key={idx} className="leading-tight">
            <span className="text-gray-500 mr-1.5">›</span>
            <span className={log.startsWith('Command:') ? 'text-white font-bold' : log.includes('ON') ? 'text-green-400' : 'text-gray-300'}>
              {log}
            </span>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>

      {/* Command Prompt Input */}
      <form onSubmit={handleSubmit} className="flex items-center space-x-2 border-t border-[#292929] pt-1">
        <span className="text-cyan-400 font-bold text-xs">COMMAND:</span>
        <input
          id="cad-command-input"
          type="text"
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          placeholder="Type a command (e.g. L, C, REC, DIM, LA, ZE, DXF)..."
          className="flex-1 bg-transparent text-white outline-none font-mono text-xs placeholder:text-gray-600"
          autoComplete="off"
          spellCheck="false"
        />
        <button
          type="submit"
          className="px-2 py-0.5 bg-[#333] hover:bg-[#444] rounded text-[10px] text-gray-300 font-bold"
        >
          ENTER
        </button>
      </form>
    </div>
  );
}
