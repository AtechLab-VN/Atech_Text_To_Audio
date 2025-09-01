import os
import re
import time
import requests
from urllib.parse import urljoin
from bs4 import BeautifulSoup
from gtts import gTTS

PYTTSX3_AVAILABLE = False
EDGE_TTS_AVAILABLE = False

try:
    import pyttsx3
    PYTTSX3_AVAILABLE = True
except ImportError:
    pass

try:
    import edge_tts
    import asyncio
    EDGE_TTS_AVAILABLE = True
except ImportError:
    pass

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'outputs')
os.makedirs(OUTPUT_DIR, exist_ok=True)

class WebToAudio:
    def __init__(self) -> None:
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        self.engine = None
        if PYTTSX3_AVAILABLE:
            try:
                self.engine = pyttsx3.init()
                voices = self.engine.getProperty('voices')
                if voices:
                    for voice in voices:
                        if 'vietnamese' in voice.name.lower() or 'female' in voice.name.lower():
                            self.engine.setProperty('voice', voice.id)
                            break
                    else:
                        self.engine.setProperty('voice', voices[0].id)
                self.engine.setProperty('rate', 150)
                self.engine.setProperty('volume', 0.9)
            except Exception:
                self.engine = None

    def extract_story_info(self, url: str, soup: BeautifulSoup) -> dict:
        """Trích xuất thông tin truyện và chương từ URL và nội dung trang"""
        story_name = "Unknown"
        chapter_number = "001"
        
        # 1. Thử lấy từ URL
        url_parts = url.split('/')
        for part in url_parts:
            # Tìm số chương trong URL
            chapter_match = re.search(r'ch(?:uong)?[-\s]?(\d+)', part.lower())
            if chapter_match:
                chapter_number = chapter_match.group(1).zfill(3)
            
            # Tìm tên truyện trong URL (thường là slug)
            if len(part) > 3 and not part.isdigit() and not part.startswith('http'):
                # Loại bỏ các ký tự đặc biệt và chuyển thành tên truyện
                clean_part = re.sub(r'[^\w\s-]', '', part)
                if clean_part and len(clean_part) > 2 and clean_part.lower() not in ['truyen', 'novel', 'story', 'chapter', 'chuong']:
                    story_name = clean_part.replace('-', ' ').title()
        
        # 2. Thử lấy từ title của trang
        title_tag = soup.find('title')
        if title_tag:
            title_text = title_tag.get_text(strip=True)
            # Tìm pattern: "Tên Truyện - Chương X" hoặc "Chương X - Tên Truyện"
            title_patterns = [
                r'(.+?)\s*[-–—]\s*Ch(?:uong)?\s*(\d+)',
                r'Ch(?:uong)?\s*(\d+)\s*[-–—]\s*(.+)',
                r'(.+?)\s*Ch(?:uong)?\s*(\d+)',
                r'Ch(?:uong)?\s*(\d+)\s*(.+)'
            ]
            
            for pattern in title_patterns:
                match = re.search(pattern, title_text, re.IGNORECASE)
                if match:
                    if 'story_name' in match.groupdict():
                        story_name = match.group('story_name').strip()
                        chapter_number = match.group('chapter_number').zfill(3)
                    else:
                        groups = match.groups()
                        if len(groups) == 2:
                            if groups[0].isdigit():
                                chapter_number = groups[0].zfill(3)
                                story_name = groups[1].strip()
                            else:
                                story_name = groups[0].strip()
                                chapter_number = groups[1].zfill(3)
                    break
        
        # 3. Thử lấy từ breadcrumb hoặc navigation
        breadcrumb_selectors = ['.breadcrumb', '.breadcrumbs', '.nav-breadcrumb', '.breadcrumb-nav']
        for selector in breadcrumb_selectors:
            breadcrumb = soup.select_one(selector)
            if breadcrumb:
                breadcrumb_text = breadcrumb.get_text(strip=True)
                # Tìm tên truyện trong breadcrumb
                story_match = re.search(r'([^>]+?)(?:\s*>\s*[^>]*)?$', breadcrumb_text)
                if story_match:
                    potential_name = story_match.group(1).strip()
                    if len(potential_name) > 2:
                        story_name = potential_name
        
        # 4. Thử lấy từ heading của trang
        heading_selectors = ['h1', 'h2', '.chapter-title', '.story-title', '.novel-title']
        for selector in heading_selectors:
            heading = soup.select_one(selector)
            if heading:
                heading_text = heading.get_text(strip=True)
                # Tìm pattern tương tự title
                for pattern in title_patterns:
                    match = re.search(pattern, heading_text, re.IGNORECASE)
                    if match:
                        groups = match.groups()
                        if len(groups) == 2:
                            if groups[0].isdigit():
                                chapter_number = groups[0].zfill(3)
                                story_name = groups[1].strip()
                            else:
                                story_name = groups[0].strip()
                                chapter_number = groups[1].zfill(3)
                        break
        
        # Clean up story name
        # Replace Vietnamese characters with ASCII equivalents
        story_name = story_name.replace('à', 'a').replace('á', 'a').replace('ả', 'a').replace('ã', 'a').replace('ạ', 'a')
        story_name = story_name.replace('ă', 'a').replace('ằ', 'a').replace('ắ', 'a').replace('ẳ', 'a').replace('ẵ', 'a').replace('ặ', 'a')
        story_name = story_name.replace('â', 'a').replace('ầ', 'a').replace('ấ', 'a').replace('ẩ', 'a').replace('ẫ', 'a').replace('ậ', 'a')
        story_name = story_name.replace('è', 'e').replace('é', 'e').replace('ẻ', 'e').replace('ẽ', 'e').replace('ẹ', 'e')
        story_name = story_name.replace('ê', 'e').replace('ề', 'e').replace('ế', 'e').replace('ể', 'e').replace('ễ', 'e').replace('ệ', 'e')
        story_name = story_name.replace('ì', 'i').replace('í', 'i').replace('ỉ', 'i').replace('ĩ', 'i').replace('ị', 'i')
        story_name = story_name.replace('ò', 'o').replace('ó', 'o').replace('ỏ', 'o').replace('õ', 'o').replace('ọ', 'o')
        story_name = story_name.replace('ô', 'o').replace('ồ', 'o').replace('ố', 'o').replace('ổ', 'o').replace('ỗ', 'o').replace('ộ', 'o')
        story_name = story_name.replace('ơ', 'o').replace('ờ', 'o').replace('ớ', 'o').replace('ở', 'o').replace('ỡ', 'o').replace('ợ', 'o')
        story_name = story_name.replace('ù', 'u').replace('ú', 'u').replace('ủ', 'u').replace('ũ', 'u').replace('ụ', 'u')
        story_name = story_name.replace('ư', 'u').replace('ừ', 'u').replace('ứ', 'u').replace('ử', 'u').replace('ữ', 'u').replace('ự', 'u')
        story_name = story_name.replace('ỳ', 'y').replace('ý', 'y').replace('ỷ', 'y').replace('ỹ', 'y').replace('ỵ', 'y')
        story_name = story_name.replace('đ', 'd')
        # Remove special characters and normalize
        story_name = re.sub(r'[^\w\s-]', '', story_name).strip()
        # Replace spaces with underscores
        story_name = re.sub(r'\s+', '_', story_name)
        if not story_name or len(story_name) < 2:
            story_name = "Unknown"
        
        return {
            'story_name': story_name,
            'chapter_number': chapter_number,
            'filename': f"{story_name}_{chapter_number}"
        }

    def get_text_from_url(self, url: str) -> dict | None:
        try:
            resp = requests.get(url, headers=self.headers, timeout=15)
            resp.raise_for_status()
            soup = BeautifulSoup(resp.content, 'html.parser')

            # Extract story info first
            story_info = self.extract_story_info(url, soup)

            # Remove unwanted tags
            for tag in soup([
                'script', 'style', 'nav', 'header', 'footer', 'aside', 'form', 'input', 'button',
                'select', 'textarea', 'iframe', 'embed', 'object', 'video', 'audio', 'noscript', 'meta', 'link', 'title'
            ]):
                tag.decompose()

            # Remove elements with unwanted classes/ids
            unwanted_classes = [
                'advertisement', 'ads', 'banner', 'sidebar', 'menu', 'navigation', 'header', 'footer', 'comment',
                'social', 'share', 'related', 'recommend', 'popular', 'trending', 'category', 'tag', 'breadcrumb',
                'pagination', 'author', 'date', 'time', 'rating', 'vote', 'like', 'dislike', 'bookmark', 'print', 'email',
                'report', 'flag', 'spam'
            ]
            for element in soup.find_all(['div', 'section', 'article']):
                classes = ' '.join(element.get('class', [])) + ' ' + (element.get('id') or '')
                if any(k in classes.lower() for k in unwanted_classes):
                    element.decompose()

            # Try common content containers
            content_selectors = [
                '.chapter-content', '.story-content', '.novel-content', '.content-chapter', '.chapter-text', '.story-text',
                '.entry-content', '.post-content', '.article-content', '.main-content', '.content', 'article', 'main',
                '.chapter', '.story', '.novel', '.text-content'
            ]
            content = None
            for selector in content_selectors:
                node = soup.select_one(selector)
                if node:
                    content = node
                    break

            # Fallback: choose the div with longest text and few links
            if not content:
                best_div = None
                best_len = 0
                for div in soup.find_all('div'):
                    text_len = len(div.get_text(strip=True))
                    link_count = len(div.find_all('a'))
                    if text_len > 500 and link_count < 10 and text_len > best_len:
                        best_len = text_len
                        best_div = div
                content = best_div or soup

            # Collect text blocks
            blocks = content.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'h5'])
            if blocks:
                texts: list[str] = []
                for b in blocks:
                    t = b.get_text(separator=' ', strip=True)
                    if len(t) >= 10 and not self._is_unwanted_line(t):
                        texts.append(t)
                text = '\n\n'.join(texts) if texts else content.get_text(separator=' ', strip=True)
            else:
                text = content.get_text(separator=' ', strip=True)

            text = self.clean_text(text)
            
            if text.strip():
                return {
                    'text': text,
                    'story_name': story_info['story_name'],
                    'chapter_number': story_info['chapter_number'],
                    'filename': story_info['filename']
                }
            return None
        except Exception:
            return None

    def _is_unwanted_line(self, line: str) -> bool:
        patterns = [
            r'quảng cáo', r'advertisement', r'click here', r'subscribe', r'follow us', r'share this', r'comment', r'like',
            r'vote', r'copyright', r'privacy policy', r'terms of service', r'contact us', r'about us', r'lượt xem',
            r'Tạm ngưng', r'Full\s+\d+\s+lượt xem'
        ]
        low = line.lower()
        return any(re.search(p, low) for p in patterns)

    def clean_text(self, text: str) -> str:
        # Drop trailing catalog-like lines
        lines = [ln.strip() for ln in text.split('\n') if ln.strip()]
        filtered: list[str] = []
        for ln in lines:
            if self._is_unwanted_line(ln):
                continue
            filtered.append(ln)
        text = '\n'.join(filtered)
        text = re.sub(r'\s+', ' ', text)
        paragraphs = [p.strip() for p in re.split(r'(?:\n\s*){2,}', text)]
        paragraphs = [p for p in paragraphs if len(p) >= 20]
        return '\n\n'.join(paragraphs).strip()

    def text_to_audio_gtts(self, text: str, base_filename: str, lang: str = 'vi') -> list[str]:
        paths: list[str] = []
        max_len = 5000
        if len(text) > max_len:
            chunks = self._split_text(text, 4000)
        else:
            chunks = [text]
        for i, chunk in enumerate(chunks, start=1):
            fname = f"{base_filename}_part_{i}.mp3" if len(chunks) > 1 else f"{base_filename}.mp3"
            path = os.path.join(OUTPUT_DIR, fname)
            tts = gTTS(text=chunk, lang=lang, slow=False)
            tts.save(path)
            paths.append(path)
        return paths

    def text_to_audio_pyttsx3(self, text: str, base_filename: str) -> list[str]:
        if not self.engine:
            raise RuntimeError('pyttsx3 not available')
        chunks = self._split_text(text, 1000)
        paths: list[str] = []
        for i, chunk in enumerate(chunks, start=1):
            fname = f"{base_filename}_part_{i}.wav" if len(chunks) > 1 else f"{base_filename}.wav"
            path = os.path.join(OUTPUT_DIR, fname)
            self.engine.save_to_file(chunk, path)
            self.engine.runAndWait()
            paths.append(path)
        return paths

    async def text_to_audio_edge_tts(self, text: str, base_filename: str, voice: str = 'vi-VN-HoaiMyNeural') -> list[str]:
        if not EDGE_TTS_AVAILABLE:
            raise RuntimeError('edge-tts not available')
        chunks = self._split_text(text, 3000)
        paths: list[str] = []
        for i, chunk in enumerate(chunks, start=1):
            fname = f"{base_filename}_part_{i}.mp3" if len(chunks) > 1 else f"{base_filename}.mp3"
            path = os.path.join(OUTPUT_DIR, fname)
            communicate = edge_tts.Communicate(chunk, voice)
            await communicate.save(path)
            paths.append(path)
        return paths

    def _split_text(self, text: str, limit: int) -> list[str]:
        sentences = re.split(r'([.!?。！？])', text)
        # Recombine sentences with delimiters
        merged: list[str] = []
        for i in range(0, len(sentences), 2):
            s = sentences[i]
            end = sentences[i+1] if i + 1 < len(sentences) else ''
            merged.append((s + end).strip())
        chunks: list[str] = []
        buf = ''
        for s in merged:
            if len(buf) + len(s) <= limit:
                buf += ((' ' if buf else '') + s)
            else:
                if buf:
                    chunks.append(buf.strip())
                buf = s
        if buf:
            chunks.append(buf.strip())
        return chunks

    def find_next_chapter_url(self, current_url: str) -> str | None:
        try:
            resp = requests.get(current_url, headers=self.headers, timeout=10)
            resp.raise_for_status()
            soup = BeautifulSoup(resp.content, 'html.parser')
            # First find anchor text patterns
            for a in soup.find_all('a', href=True):
                label = (a.get_text() or '').strip().lower()
                if any(k in label for k in ['chương tiếp', 'tiếp theo', 'next']):
                    return urljoin(current_url, a['href'])
            # Fallback: numeric increment in URL path
            parts = current_url.rstrip('/').split('/')
            for i in reversed(range(len(parts))):
                if parts[i].isdigit():
                    parts[i] = str(int(parts[i]) + 1)
                    return '/'.join(parts)
                if parts[i].endswith('.html'):
                    base = parts[i].replace('.html', '')
                    if base.isdigit():
                        parts[i] = str(int(base) + 1) + '.html'
                        return '/'.join(parts)
            return None
        except Exception:
            return None

    def auto_convert_multiple_chapters(self, start_url: str, count: int, engine: str, lang: str = 'vi', voice: str = 'vi-VN-HoaiMyNeural') -> list[dict]:
        results: list[dict] = []
        url = start_url
        for idx in range(1, count + 1):
            data = self.get_text_from_url(url)
            if not data:
                break
            
            text = data['text']
            filename = data['filename']
            
            if engine == 'gtts':
                paths = self.text_to_audio_gtts(text, filename, lang)
            elif engine == 'edge':
                # Run async edge tts in a new loop
                paths = asyncio.run(self.text_to_audio_edge_tts(text, filename, voice))  # type: ignore
            elif engine == 'offline':
                paths = self.text_to_audio_pyttsx3(text, filename)
            else:
                raise ValueError('Invalid engine')
            
            text_path = os.path.join(OUTPUT_DIR, f"{filename}.txt")
            with open(text_path, 'w', encoding='utf-8') as f:
                f.write(text)
            
            results.append({
                'chapter': idx, 
                'story_name': data['story_name'],
                'chapter_number': data['chapter_number'],
                'text': text_path, 
                'audio': paths
            })
            
            next_url = self.find_next_chapter_url(url)
            if not next_url:
                break
            url = next_url
            time.sleep(2)
        return results
