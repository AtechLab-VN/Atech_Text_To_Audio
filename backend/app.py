import os
from typing import Optional
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

from backend.services.web_to_audio import WebToAudio, OUTPUT_DIR, EDGE_TTS_AVAILABLE, PYTTSX3_AVAILABLE

app = FastAPI(title='Web To Audio API')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

svc = WebToAudio()

class ExtractRequest(BaseModel):
    url: str

class TTSRequest(BaseModel):
    text: str
    engine: str = 'edge'  # 'edge' | 'gtts' | 'offline'
    lang: str = 'vi'
    voice: str = 'vi-VN-HoaiMyNeural'
    base_name: str = 'output'

class ChaptersRequest(BaseModel):
    start_url: str
    count: int = 3
    engine: str = 'edge'
    lang: str = 'vi'
    voice: str = 'vi-VN-HoaiMyNeural'

@app.get('/health')
def health():
    return {'status': 'ok'}

@app.post('/extract')
def extract(req: ExtractRequest):
    data = svc.get_text_from_url(req.url)
    if not data:
        return JSONResponse({'error': 'Failed to extract text'}, status_code=400)
    
    return {
        'length': len(data['text']), 
        'preview': data['text'][:300], 
        'text': data['text'],
        'story_name': data['story_name'],
        'chapter_number': data['chapter_number'],
        'filename': data['filename']
    }

@app.post('/tts')
def tts(req: TTSRequest):
    try:
        base_name = req.base_name
        if req.engine == 'edge':
            if not EDGE_TTS_AVAILABLE:
                return JSONResponse({'error': 'edge-tts not available'}, status_code=400)
            paths = __import__('asyncio').run(svc.text_to_audio_edge_tts(req.text, base_name, req.voice))
        elif req.engine == 'gtts':
            paths = svc.text_to_audio_gtts(req.text, base_name, req.lang)
        elif req.engine == 'offline':
            if not PYTTSX3_AVAILABLE:
                return JSONResponse({'error': 'pyttsx3 not available'}, status_code=400)
            paths = svc.text_to_audio_pyttsx3(req.text, base_name)
        else:
            return JSONResponse({'error': 'invalid engine'}, status_code=400)
        return {'files': [os.path.basename(p) for p in paths]}
    except Exception as e:
        return JSONResponse({'error': str(e)}, status_code=500)

@app.post('/convert_chapters')
def convert_chapters(req: ChaptersRequest):
    try:
        results = svc.auto_convert_multiple_chapters(req.start_url, req.count, req.engine, req.lang, req.voice)
        return {'results': results}
    except Exception as e:
        return JSONResponse({'error': str(e)}, status_code=500)

@app.get('/files')
def list_files():
    files = sorted([f for f in os.listdir(OUTPUT_DIR) if os.path.isfile(os.path.join(OUTPUT_DIR, f))])
    return {'files': files}

@app.get('/download')
def download(path: str = Query(...)):
    safe_path = os.path.normpath(os.path.join(OUTPUT_DIR, path))
    if not safe_path.startswith(OUTPUT_DIR) or not os.path.exists(safe_path):
        return JSONResponse({'error': 'file not found'}, status_code=404)
    return FileResponse(safe_path)
