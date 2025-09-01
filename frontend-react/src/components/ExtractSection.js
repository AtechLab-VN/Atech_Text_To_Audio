import React, { useState } from 'react';
import { useVoiceSelector } from './VoiceSelector';

const ExtractSection = ({ apiBase, onLog, onFilesChange }) => {
  const [url, setUrl] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [storyInfo, setStoryInfo] = useState(null);
  const [baseName, setBaseName] = useState('output');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  // Sử dụng hook voice selector
  const {
    engine,
    lang,
    voice,
    handleEngineChange,
    handleLangChange,
    setVoice,
  } = useVoiceSelector();

  const handleExtract = async () => {
    if (!url.trim()) {
      alert('Vui lòng nhập URL');
      return;
    }

    setIsExtracting(true);
    onLog('Đang trích xuất nội dung...');

    try {
      const response = await fetch(`${apiBase}/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Lỗi khi trích xuất');
      }

      setExtractedText(data.text);
      setStoryInfo({
        story_name: data.story_name,
        chapter_number: data.chapter_number,
        filename: data.filename
      });
      setBaseName(data.filename); // Tự động set filename
      onLog(`Trích xuất thành công: ${data.length} ký tự - ${data.story_name} Chương ${data.chapter_number}`);
    } catch (error) {
      onLog(`Lỗi: ${error.message}`);
      alert(error.message);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleConvert = async () => {
    if (!extractedText.trim()) {
      alert('Chưa có nội dung để chuyển đổi');
      return;
    }

    setIsConverting(true);
    onLog(`Đang chuyển text sang audio (${engine})...`);

    try {
      const response = await fetch(`${apiBase}/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: extractedText,
          engine,
          lang: lang.trim() || 'vi',
          voice: voice.trim() || 'vi-VN-HoaiMyNeural',
          base_name: baseName.trim() || 'output',
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Lỗi khi chuyển đổi');
      }

      onLog(`Tạo file thành công: ${data.files.join(', ')}`);
      onFilesChange();
    } catch (error) {
      onLog(`Lỗi: ${error.message}`);
      alert(error.message);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <section className="section">
      <h2>1) Trích xuất nội dung 1 trang</h2>
      
      <div className="form-row">
        <input
          type="text"
          placeholder="Dán URL chương..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="form-input"
        />
        <button 
          onClick={handleExtract}
          disabled={isExtracting}
          className="btn btn-primary"
        >
          {isExtracting ? 'Đang trích xuất...' : 'Trích xuất'}
        </button>
      </div>

      {extractedText && (
        <div className="preview-container">
          {storyInfo && (
            <div className="story-info">
              <h3>📚 Thông tin truyện:</h3>
              <div className="info-grid">
                <div className="info-item">
                  <strong>Tên truyện:</strong> {storyInfo.story_name}
                </div>
                <div className="info-item">
                  <strong>Chương:</strong> {storyInfo.chapter_number}
                </div>
                <div className="info-item">
                  <strong>Tên file:</strong> {storyInfo.filename}
                </div>
              </div>
            </div>
          )}
          <h3>Nội dung đã trích xuất:</h3>
          <pre className="preview">{extractedText}</pre>
        </div>
      )}

      <div className="form-row">
        <select 
          value={engine} 
          onChange={(e) => handleEngineChange(e.target.value)}
          className="form-select"
        >
          <option value="edge">Microsoft Edge TTS (khuyến nghị)</option>
          <option value="gtts">Google TTS</option>
          <option value="offline">Offline TTS</option>
        </select>
        
        <select
          value={lang}
          onChange={(e) => handleLangChange(e.target.value)}
          className="form-select"
        >
          <option value="vi">Tiếng Việt</option>
          <option value="en">English</option>
          <option value="ja">日本語</option>
          <option value="ko">한국어</option>
          <option value="zh">中文</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          <option value="es">Español</option>
          <option value="it">Italiano</option>
          <option value="pt">Português</option>
          <option value="ru">Русский</option>
          <option value="ar">العربية</option>
          <option value="hi">हिन्दी</option>
          <option value="th">ไทย</option>
        </select>
        
        <select
          value={voice}
          onChange={(e) => setVoice(e.target.value)}
          className="form-select"
        >
          {engine === 'edge' && lang === 'vi' && (
            <>
              <option value="vi-VN-HoaiMyNeural">Hoài My (Nữ - Việt Nam)</option>
              <option value="vi-VN-NamMinhNeural">Nam Minh (Nam - Việt Nam)</option>
            </>
          )}
          {engine === 'edge' && lang === 'en' && (
            <>
              <option value="en-US-JennyNeural">Jenny (Nữ - Mỹ)</option>
              <option value="en-US-GuyNeural">Guy (Nam - Mỹ)</option>
              <option value="en-GB-SoniaNeural">Sonia (Nữ - Anh)</option>
              <option value="en-GB-RyanNeural">Ryan (Nam - Anh)</option>
            </>
          )}
          {engine === 'edge' && lang === 'ja' && (
            <>
              <option value="ja-JP-NanamiNeural">Nanami (Nữ - Nhật)</option>
              <option value="ja-JP-KeitaNeural">Keita (Nam - Nhật)</option>
            </>
          )}
          {engine === 'edge' && lang === 'ko' && (
            <>
              <option value="ko-KR-SunHiNeural">Sun Hi (Nữ - Hàn)</option>
              <option value="ko-KR-InJoonNeural">In Joon (Nam - Hàn)</option>
            </>
          )}
          {engine === 'edge' && lang === 'zh' && (
            <>
              <option value="zh-CN-XiaoxiaoNeural">Xiaoxiao (Nữ - Trung Quốc)</option>
              <option value="zh-CN-YunxiNeural">Yunxi (Nam - Trung Quốc)</option>
            </>
          )}
          {engine === 'edge' && lang === 'fr' && (
            <>
              <option value="fr-FR-DeniseNeural">Denise (Nữ - Pháp)</option>
              <option value="fr-FR-HenriNeural">Henri (Nam - Pháp)</option>
            </>
          )}
          {engine === 'edge' && lang === 'de' && (
            <>
              <option value="de-DE-KatjaNeural">Katja (Nữ - Đức)</option>
              <option value="de-DE-ConradNeural">Conrad (Nam - Đức)</option>
            </>
          )}
          {engine === 'edge' && lang === 'es' && (
            <>
              <option value="es-ES-ElviraNeural">Elvira (Nữ - Tây Ban Nha)</option>
              <option value="es-ES-AlvaroNeural">Alvaro (Nam - Tây Ban Nha)</option>
            </>
          )}
          {engine === 'edge' && lang === 'it' && (
            <>
              <option value="it-IT-IsabellaNeural">Isabella (Nữ - Ý)</option>
              <option value="it-IT-DiegoNeural">Diego (Nam - Ý)</option>
            </>
          )}
          {engine === 'edge' && lang === 'pt' && (
            <>
              <option value="pt-BR-FranciscaNeural">Francisca (Nữ - Brazil)</option>
              <option value="pt-BR-AntonioNeural">Antonio (Nam - Brazil)</option>
            </>
          )}
          {engine === 'edge' && lang === 'ru' && (
            <>
              <option value="ru-RU-SvetlanaNeural">Svetlana (Nữ - Nga)</option>
              <option value="ru-RU-DmitryNeural">Dmitry (Nam - Nga)</option>
            </>
          )}
          {engine === 'edge' && lang === 'ar' && (
            <>
              <option value="ar-SA-ZariyahNeural">Zariyah (Nữ - Ả Rập)</option>
              <option value="ar-SA-HamedNeural">Hamed (Nam - Ả Rập)</option>
            </>
          )}
          {engine === 'edge' && lang === 'hi' && (
            <>
              <option value="hi-IN-SwaraNeural">Swara (Nữ - Ấn Độ)</option>
              <option value="hi-IN-MadhurNeural">Madhur (Nam - Ấn Độ)</option>
            </>
          )}
          {engine === 'edge' && lang === 'th' && (
            <>
              <option value="th-TH-AcharaNeural">Achara (Nữ - Thái)</option>
              <option value="th-TH-NiwatNeural">Niwat (Nam - Thái)</option>
            </>
          )}
          {engine === 'gtts' && (
            <option value={lang}>{lang === 'vi' ? 'Tiếng Việt' : lang === 'en' ? 'English' : lang}</option>
          )}
          {engine === 'offline' && (
            <option value="default">Giọng mặc định</option>
          )}
        </select>
        
        <input
          type="text"
          placeholder="Tên file"
          value={baseName}
          onChange={(e) => setBaseName(e.target.value)}
          className="form-input"
        />
        
        <button 
          onClick={handleConvert}
          disabled={isConverting || !extractedText}
          className="btn btn-success"
        >
          {isConverting ? 'Đang chuyển đổi...' : 'Chuyển sang Audio'}
        </button>
      </div>
    </section>
  );
};

export default ExtractSection;
