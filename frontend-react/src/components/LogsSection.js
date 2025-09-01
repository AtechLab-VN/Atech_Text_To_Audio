import React, { useRef, useEffect } from 'react';

const LogsSection = ({ logs }) => {
  const logsEndRef = useRef(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const clearLogs = () => {
    // This would need to be implemented in the parent component
    // For now, we'll just show a message
    console.log('Clear logs functionality would be implemented here');
  };

  return (
    <section className="section">
      <div className="section-header">
        <h2>Logs</h2>
        <button onClick={clearLogs} className="btn btn-secondary">
          🗑️ Xóa logs
        </button>
      </div>
      
      <div className="logs-container">
        {logs.length === 0 ? (
          <div className="empty-logs">
            <p>Chưa có log nào.</p>
          </div>
        ) : (
          <pre className="logs">
            {logs.join('\n')}
            <div ref={logsEndRef} />
          </pre>
        )}
      </div>
    </section>
  );
};

export default LogsSection;
