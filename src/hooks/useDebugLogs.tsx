import { useState, useEffect } from 'react';

const useDebugLogs = () => {
   const [logs, setLogs] = useState<string[]>([]);

   useEffect(() => {
      // Load logs from localStorage on component mount
      const storedLogs = localStorage.getItem('debugLogs');
      if (storedLogs) {
         setLogs(JSON.parse(storedLogs));
      }

      // Wrap console.log
      const originalConsoleLog = console.log;
      const originalConsoleWarn = console.warn;
      const originalConsoleError = console.error;

      console.log = (...args: any[]) => {
         originalConsoleLog(...args); // Keep the original console.log
         const newLog = `LOG: ${args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ')}`;
         setLogs(prevLogs => {
            const updatedLogs = [...prevLogs, newLog];
            // Save logs to localStorage whenever they change
            try {
               localStorage.setItem('debugLogs', JSON.stringify(updatedLogs));
            } catch (e) {
               if (e instanceof DOMException && e.code === 22) {
                  console.error('QuotaExceededError: Unable to save logs to localStorage.');
               } else {
                  throw e;
               }
            }
            return updatedLogs;
         });
      };

      console.warn = (...args: any[]) => {
         originalConsoleWarn(...args); // Keep the original console.warn
         const newLog = `WARN: ${args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ')}`;
         setLogs(prevLogs => {
            const updatedLogs = [...prevLogs, newLog];
            try {
               localStorage.setItem('debugLogs', JSON.stringify(updatedLogs));
            } catch (e) {
               if (e instanceof DOMException && e.code === 22) {
                  console.error('QuotaExceededError: Unable to save logs to localStorage.');
               } else {
                  throw e;
               }
            }
            return updatedLogs;
         });
      };

      console.error = (...args: any[]) => {
         originalConsoleError(...args); // Keep the original console.error
         const newLog = `ERROR: ${args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ')}`;
         setLogs(prevLogs => {
            const updatedLogs = [...prevLogs, newLog];
            try {
               localStorage.setItem('debugLogs', JSON.stringify(updatedLogs));
            } catch (e) {
               if (e instanceof DOMException && e.code === 22) {
                  console.error('QuotaExceededError: Unable to save logs to localStorage.');
               } else {
                  throw e;
               }
            }
            return updatedLogs;
         });
      };

      return () => {
         console.log = originalConsoleLog; // Restore original console.log on unmount
         console.warn = originalConsoleWarn;
         console.error = originalConsoleError;
      };
   }, []);

   const clearLogs = () => {
      setLogs([]);
      localStorage.removeItem('debugLogs');
   };

   return { logs, clearLogs };
};

export default useDebugLogs;
