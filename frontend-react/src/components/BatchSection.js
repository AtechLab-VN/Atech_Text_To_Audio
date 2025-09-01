import React, { useState } from 'react';
import { useVoiceSelector } from './VoiceSelector';

const BatchSection = ({ apiBase, onLog, onFilesChange }) => {
  const [startUrl, setStartUrl] = useState('');
  const [count, setCount] = useState(3);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sử dụng hook voice selector
  const {
    engine,
    lang,
    voice,
    handleEngineChange,
    handleLangChange,
    setVoice,
  } = useVoiceSelector();

  const handleBatchProcess = async () => {
    if (!startUrl.trim()) {
      alert('Vui lòng nhập URL chương đầu tiên');
      return;
    }

    setIsProcessing(true);
    onLog(`Bắt đầu xử lý ${count} chương bằng ${engine}...`);

    try {
      const response = await fetch(`${apiBase}/convert_chapters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start_url: startUrl.trim(),
          count: parseInt(count) || 3,
          engine,
          lang: lang.trim() || 'vi',
          voice: voice.trim() || 'vi-VN-HoaiMyNeural',
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Lỗi khi xử lý batch');
      }

      const processedCount = data.results?.length || 0;
      onLog(`Hoàn thành xử lý ${processedCount} chương`);
      
      // Log chi tiết từng chương đã xử lý
      if (data.results) {
        data.results.forEach(result => {
          onLog(`✅ ${result.story_name} - Chương ${result.chapter_number}`);
        });
      }
      
      onFilesChange();
    } catch (error) {
      onLog(`Lỗi: ${error.message}`);
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="section">
      <h2>2) Tự động nhiều chương</h2>
      
      <div className="form-row">
        <input
          type="text"
          placeholder="URL chương đầu tiên"
          value={startUrl}
          onChange={(e) => setStartUrl(e.target.value)}
          className="form-input"
        />
        
        <input
          type="number"
          min="1"
          max="20"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          className="form-input"
          style={{ width: '100px' }}
        />
        
        <select 
          value={engine} 
          onChange={(e) => handleEngineChange(e.target.value)}
          className="form-select"
        >
          <option value="edge">Microsoft Edge TTS</option>
          <option value="gtts">Google TTS</option>
          <option value="offline">Offline TTS</option>
        </select>
        
        <select
          value={lang}
          onChange={(e) => handleLangChange(e.target.value)}
          className="form-select"
          style={{ width: '120px' }}
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
        
        <button 
          onClick={handleBatchProcess}
          disabled={isProcessing}
          className="btn btn-warning"
        >
          {isProcessing ? 'Đang xử lý...' : 'Chạy'}
        </button>
      </div>
      
      <div className="info-box">
        <p><strong>Lưu ý:</strong> Quá trình này sẽ tự động tìm và chuyển đổi các chương tiếp theo.</p>
      </div>
    </section>
  );
};

export default BatchSection;
