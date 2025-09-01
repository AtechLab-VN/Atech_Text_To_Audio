const API = 'http://127.0.0.1:8000';

function log(msg) {
  const el = document.getElementById('logs');
  el.textContent += `\n${msg}`;
  el.scrollTop = el.scrollHeight;
}

async function extract() {
  const url = document.getElementById('url').value.trim();
  if (!url) return alert('Nhập URL');
  log('Trích xuất nội dung...');
  const res = await fetch(`${API}/extract`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  const data = await res.json();
  if (!res.ok) { alert(data.error || 'Lỗi'); return; }
  document.getElementById('preview').textContent = data.text;
  log(`OK: ${data.length} ký tự`);
}

async function tts() {
  const text = document.getElementById('preview').textContent.trim();
  if (!text) return alert('Chưa có nội dung');
  const engine = document.getElementById('engine').value;
  const lang = document.getElementById('lang').value.trim() || 'vi';
  const voice = document.getElementById('voice').value.trim() || 'vi-VN-HoaiMyNeural';
  const base_name = document.getElementById('baseName').value.trim() || 'output';
  log(`TTS (${engine})...`);
  const res = await fetch(`${API}/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, engine, lang, voice, base_name }),
  });
  const data = await res.json();
  if (!res.ok) { alert(data.error || 'Lỗi'); return; }
  log(`Tạo file: ${data.files.join(', ')}`);
  refreshFiles();
}

async function batch() {
  const start_url = document.getElementById('startUrl').value.trim();
  const count = parseInt(document.getElementById('count').value, 10) || 3;
  const engine = document.getElementById('engine2').value;
  const lang = document.getElementById('lang2').value.trim() || 'vi';
  const voice = document.getElementById('voice2').value.trim() || 'vi-VN-HoaiMyNeural';
  if (!start_url) return alert('Nhập URL chương đầu');
  log(`Batch ${count} chương bằng ${engine}...`);
  const res = await fetch(`${API}/convert_chapters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ start_url, count, engine, lang, voice }),
  });
  const data = await res.json();
  if (!res.ok) { alert(data.error || 'Lỗi'); return; }
  log(`Xong ${data.results?.length || 0} chương`);
  refreshFiles();
}

async function refreshFiles() {
  const ul = document.getElementById('files');
  ul.innerHTML = '';
  const res = await fetch(`${API}/files`);
  const data = await res.json();
  (data.files || []).forEach(name => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `${API}/download?path=${encodeURIComponent(name)}`;
    a.textContent = name;
    a.target = '_blank';
    li.appendChild(a);
    ul.appendChild(li);
  });
}

function setup() {
  document.getElementById('btnExtract').onclick = extract;
  document.getElementById('btnTTS').onclick = tts;
  document.getElementById('btnBatch').onclick = batch;
  document.getElementById('btnRefresh').onclick = refreshFiles;
  refreshFiles();
}

document.addEventListener('DOMContentLoaded', setup);
