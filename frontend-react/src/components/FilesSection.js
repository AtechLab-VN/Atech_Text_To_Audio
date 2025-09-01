import React from 'react';

const FilesSection = ({ files, apiBase, onRefresh }) => {
  const handleDownload = (filename) => {
    const downloadUrl = `${apiBase}/download?path=${encodeURIComponent(filename)}`;
    window.open(downloadUrl, '_blank');
  };

  const getFileIcon = (filename) => {
    if (filename.endsWith('.mp3')) return '🎵';
    if (filename.endsWith('.wav')) return '🎵';
    if (filename.endsWith('.txt')) return '📄';
    return '📁';
  };

  const getFileSize = (filename) => {
    // This would need backend support to get actual file sizes
    return '';
  };

  return (
    <section className="section">
      <div className="section-header">
        <h2>3) File đã tạo</h2>
        <button onClick={onRefresh} className="btn btn-secondary">
          🔄 Làm mới
        </button>
      </div>

      {files.length === 0 ? (
        <div className="empty-state">
          <p>Chưa có file nào được tạo.</p>
        </div>
      ) : (
        <div className="files-grid">
          {files.map((filename, index) => (
            <div key={index} className="file-item">
              <div className="file-icon">
                {getFileIcon(filename)}
              </div>
              <div className="file-info">
                <div className="file-name">{filename}</div>
                <div className="file-size">{getFileSize(filename)}</div>
              </div>
              <button 
                onClick={() => handleDownload(filename)}
                className="btn btn-sm btn-outline"
              >
                📥 Tải
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="files-summary">
        <p>Tổng cộng: {files.length} file</p>
      </div>
    </section>
  );
};

export default FilesSection;
