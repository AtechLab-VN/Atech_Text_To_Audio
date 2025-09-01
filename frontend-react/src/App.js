import React, { useState, useEffect } from 'react';
import './App.css';
import ExtractSection from './components/ExtractSection';
import BatchSection from './components/BatchSection';
import FilesSection from './components/FilesSection';
import LogsSection from './components/LogsSection';

const API_BASE = 'http://127.0.0.1:8000';

function App() {
  const [logs, setLogs] = useState([]);
  const [files, setFiles] = useState([]);

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const refreshFiles = async () => {
    try {
      const response = await fetch(`${API_BASE}/files`);
      const data = await response.json();
      setFiles(data.files || []);
    } catch (error) {
      addLog(`Lỗi khi tải danh sách file: ${error.message}`);
    }
  };

  useEffect(() => {
    refreshFiles();
    addLog('Ứng dụng đã sẵn sàng');
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Web To Audio</h1>
        <p>Trích xuất text từ web và chuyển sang audio</p>
      </header>

      <main className="App-main">
        <ExtractSection 
          apiBase={API_BASE} 
          onLog={addLog} 
          onFilesChange={refreshFiles}
        />
        
        <BatchSection 
          apiBase={API_BASE} 
          onLog={addLog} 
          onFilesChange={refreshFiles}
        />
        
        <FilesSection 
          files={files} 
          apiBase={API_BASE} 
          onRefresh={refreshFiles}
        />
        
        <LogsSection logs={logs} />
      </main>
    </div>
  );
}

export default App;
