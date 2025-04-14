import React, { useRef, useEffect } from 'react';
import useDebugLogs from '../hooks/useDebugLogs';

const Debug: React.FC = () => {
   const { logs, clearLogs } = useDebugLogs();
   const logsContainerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      // Scroll to the bottom of the logs
      if (logsContainerRef.current) {
         logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
      }
   }, [logs]);

   return (
      <div
         style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            color: '#fff',
            padding: '10px',
            fontFamily: 'monospace',
            fontSize: '12px',
            lineHeight: '1.5',
            overflowY: 'auto',
         }}
         ref={logsContainerRef}
      >
         <div style={{ position: 'sticky', top: 0, backgroundColor: '#000', padding: '5px 0', zIndex: 1 }}>
            <button
               onClick={clearLogs}
               style={{
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  cursor: 'pointer',
               }}
            >
               Clear Logs
            </button>
         </div>
         {logs.map((log, index) => (
            <div key={index}>{log}</div>
         ))}
      </div>
   );
};

export default Debug;
