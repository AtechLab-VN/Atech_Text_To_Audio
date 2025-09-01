import React from 'react';

// Danh sách ngôn ngữ
export const languages = [
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'zh', name: '中文' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'th', name: 'ไทย' },
];

// Danh sách giọng đọc theo engine
export const voices = {
  edge: [
    { id: 'vi-VN-HoaiMyNeural', name: 'Hoài My (Nữ - Việt Nam)', lang: 'vi' },
    { id: 'vi-VN-NamMinhNeural', name: 'Nam Minh (Nam - Việt Nam)', lang: 'vi' },
    { id: 'en-US-JennyNeural', name: 'Jenny (Nữ - Mỹ)', lang: 'en' },
    { id: 'en-US-GuyNeural', name: 'Guy (Nam - Mỹ)', lang: 'en' },
    { id: 'en-GB-SoniaNeural', name: 'Sonia (Nữ - Anh)', lang: 'en' },
    { id: 'en-GB-RyanNeural', name: 'Ryan (Nam - Anh)', lang: 'en' },
    { id: 'ja-JP-NanamiNeural', name: 'Nanami (Nữ - Nhật)', lang: 'ja' },
    { id: 'ja-JP-KeitaNeural', name: 'Keita (Nam - Nhật)', lang: 'ja' },
    { id: 'ko-KR-SunHiNeural', name: 'Sun Hi (Nữ - Hàn)', lang: 'ko' },
    { id: 'ko-KR-InJoonNeural', name: 'In Joon (Nam - Hàn)', lang: 'ko' },
    { id: 'zh-CN-XiaoxiaoNeural', name: 'Xiaoxiao (Nữ - Trung Quốc)', lang: 'zh' },
    { id: 'zh-CN-YunxiNeural', name: 'Yunxi (Nam - Trung Quốc)', lang: 'zh' },
    { id: 'fr-FR-DeniseNeural', name: 'Denise (Nữ - Pháp)', lang: 'fr' },
    { id: 'fr-FR-HenriNeural', name: 'Henri (Nam - Pháp)', lang: 'fr' },
    { id: 'de-DE-KatjaNeural', name: 'Katja (Nữ - Đức)', lang: 'de' },
    { id: 'de-DE-ConradNeural', name: 'Conrad (Nam - Đức)', lang: 'de' },
    { id: 'es-ES-ElviraNeural', name: 'Elvira (Nữ - Tây Ban Nha)', lang: 'es' },
    { id: 'es-ES-AlvaroNeural', name: 'Alvaro (Nam - Tây Ban Nha)', lang: 'es' },
    { id: 'it-IT-IsabellaNeural', name: 'Isabella (Nữ - Ý)', lang: 'it' },
    { id: 'it-IT-DiegoNeural', name: 'Diego (Nam - Ý)', lang: 'it' },
    { id: 'pt-BR-FranciscaNeural', name: 'Francisca (Nữ - Brazil)', lang: 'pt' },
    { id: 'pt-BR-AntonioNeural', name: 'Antonio (Nam - Brazil)', lang: 'pt' },
    { id: 'ru-RU-SvetlanaNeural', name: 'Svetlana (Nữ - Nga)', lang: 'ru' },
    { id: 'ru-RU-DmitryNeural', name: 'Dmitry (Nam - Nga)', lang: 'ru' },
    { id: 'ar-SA-ZariyahNeural', name: 'Zariyah (Nữ - Ả Rập)', lang: 'ar' },
    { id: 'ar-SA-HamedNeural', name: 'Hamed (Nam - Ả Rập)', lang: 'ar' },
    { id: 'hi-IN-SwaraNeural', name: 'Swara (Nữ - Ấn Độ)', lang: 'hi' },
    { id: 'hi-IN-MadhurNeural', name: 'Madhur (Nam - Ấn Độ)', lang: 'hi' },
    { id: 'th-TH-AcharaNeural', name: 'Achara (Nữ - Thái)', lang: 'th' },
    { id: 'th-TH-NiwatNeural', name: 'Niwat (Nam - Thái)', lang: 'th' },
  ],
  gtts: [
    { id: 'vi', name: 'Tiếng Việt', lang: 'vi' },
    { id: 'en', name: 'English', lang: 'en' },
    { id: 'ja', name: '日本語', lang: 'ja' },
    { id: 'ko', name: '한국어', lang: 'ko' },
    { id: 'zh', name: '中文', lang: 'zh' },
    { id: 'fr', name: 'Français', lang: 'fr' },
    { id: 'de', name: 'Deutsch', lang: 'de' },
    { id: 'es', name: 'Español', lang: 'es' },
    { id: 'it', name: 'Italiano', lang: 'it' },
    { id: 'pt', name: 'Português', lang: 'pt' },
    { id: 'ru', name: 'Русский', lang: 'ru' },
    { id: 'ar', name: 'العربية', lang: 'ar' },
    { id: 'hi', name: 'हिन्दी', lang: 'hi' },
    { id: 'th', name: 'ไทย', lang: 'th' },
  ],
  offline: [
    { id: 'default', name: 'Giọng mặc định', lang: 'vi' },
  ]
};

// Hook để quản lý voice selection
export const useVoiceSelector = (initialEngine = 'edge', initialLang = 'vi', initialVoice = 'vi-VN-HoaiMyNeural') => {
  const [engine, setEngine] = React.useState(initialEngine);
  const [lang, setLang] = React.useState(initialLang);
  const [voice, setVoice] = React.useState(initialVoice);

  // Lọc giọng đọc theo engine và ngôn ngữ
  const getAvailableVoices = () => {
    const engineVoices = voices[engine] || [];
    if (engine === 'edge') {
      return engineVoices.filter(v => v.lang === lang);
    }
    return engineVoices;
  };

  // Tự động cập nhật giọng đọc khi thay đổi ngôn ngữ
  const handleLangChange = (newLang) => {
    setLang(newLang);
    const availableVoices = getAvailableVoices();
    if (availableVoices.length > 0) {
      setVoice(availableVoices[0].id);
    }
  };

  // Tự động cập nhật giọng đọc khi thay đổi engine
  const handleEngineChange = (newEngine) => {
    setEngine(newEngine);
    const availableVoices = voices[newEngine] || [];
    if (availableVoices.length > 0) {
      setVoice(availableVoices[0].id);
    }
  };

  return {
    engine,
    lang,
    voice,
    setEngine,
    setLang,
    setVoice,
    handleEngineChange,
    handleLangChange,
    getAvailableVoices,
  };
};

// Component VoiceSelector
const VoiceSelector = ({ 
  engine, 
  lang, 
  voice, 
  onEngineChange, 
  onLangChange, 
  onVoiceChange,
  showEngine = true,
  compact = false 
}) => {
  const getAvailableVoices = () => {
    const engineVoices = voices[engine] || [];
    if (engine === 'edge') {
      return engineVoices.filter(v => v.lang === lang);
    }
    return engineVoices;
  };

  return (
    <>
      {showEngine && (
        <select 
          value={engine} 
          onChange={(e) => onEngineChange(e.target.value)}
          className="form-select"
        >
          <option value="edge">Microsoft Edge TTS (khuyến nghị)</option>
          <option value="gtts">Google TTS</option>
          <option value="offline">Offline TTS</option>
        </select>
      )}
      
      <select
        value={lang}
        onChange={(e) => onLangChange(e.target.value)}
        className="form-select"
        style={compact ? { width: '120px' } : {}}
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
      
      <select
        value={voice}
        onChange={(e) => onVoiceChange(e.target.value)}
        className="form-select"
      >
        {getAvailableVoices().map(v => (
          <option key={v.id} value={v.id}>
            {v.name}
          </option>
        ))}
      </select>
    </>
  );
};

export default VoiceSelector;
