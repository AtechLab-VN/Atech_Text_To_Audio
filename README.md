# Web To Audio Converter

Ứng dụng web chuyển đổi nội dung text từ các trang web thành file audio sử dụng Text-to-Speech (TTS).

## 🎯 Mô tả

Web To Audio Converter là một ứng dụng full-stack cho phép:
- Trích xuất nội dung text từ các trang web
- Chuyển đổi text thành audio sử dụng nhiều engine TTS khác nhau
- Xử lý hàng loạt nhiều chương truyện
- Giao diện web thân thiện với người dùng

## ✨ Tính năng chính

### Backend (FastAPI)
- **Trích xuất text**: Tự động lấy nội dung từ URL web
- **Text-to-Speech**: Hỗ trợ 3 engine TTS:
  - Microsoft Edge TTS (chất lượng cao)
  - Google TTS (gTTS)
  - Offline TTS (pyttsx3)
- **Xử lý hàng loạt**: Tự động chuyển đổi nhiều chương truyện
- **Quản lý file**: Tải xuống và quản lý các file audio đã tạo

### Frontend (React)
- **Giao diện trực quan**: Thiết kế hiện đại và dễ sử dụng
- **Trích xuất đơn lẻ**: Chuyển đổi một URL thành audio
- **Xử lý hàng loạt**: Chuyển đổi nhiều chương cùng lúc
- **Quản lý file**: Xem và tải xuống các file đã tạo
- **Logs real-time**: Theo dõi quá trình xử lý

## 🛠️ Công nghệ sử dụng

### Backend
- **FastAPI**: Framework web API hiệu suất cao
- **BeautifulSoup**: Parse HTML content
- **edge-tts**: Microsoft Edge TTS engine
- **gTTS**: Google Text-to-Speech
- **pyttsx3**: Offline TTS engine
- **requests**: HTTP requests

### Frontend
- **React 19**: UI framework
- **CSS3**: Styling
- **Fetch API**: HTTP requests

## 📦 Cài đặt

### Yêu cầu hệ thống
- Python 3.8+
- Node.js 16+
- npm hoặc yarn

### Backend Setup

1. **Cài đặt dependencies Python**:
```bash
cd backend
pip install fastapi uvicorn beautifulsoup4 requests gtts edge-tts pyttsx3
```

2. **Khởi chạy server**:
```bash
uvicorn backend.app:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

1. **Cài đặt dependencies**:
```bash
cd frontend-react
npm install
```

2. **Khởi chạy development server**:
```bash
npm start
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

## 🚀 Sử dụng

### 1. Trích xuất và chuyển đổi đơn lẻ

1. Mở ứng dụng trong trình duyệt
2. Nhập URL của trang web chứa nội dung cần chuyển đổi
3. Chọn engine TTS và voice phù hợp
4. Nhấn "Trích xuất và chuyển đổi"
5. Tải xuống file audio đã tạo

### 2. Xử lý hàng loạt

1. Nhập URL chương đầu tiên
2. Chọn số lượng chương cần xử lý
3. Cấu hình TTS engine và voice
4. Nhấn "Bắt đầu xử lý hàng loạt"
5. Theo dõi tiến trình trong phần logs

### 3. Quản lý file

- Xem danh sách tất cả file đã tạo
- Tải xuống file audio
- Xóa file không cần thiết

## 🔧 Cấu hình

### TTS Engines

#### Microsoft Edge TTS (Khuyến nghị)
- Chất lượng cao nhất
- Hỗ trợ tiếng Việt tốt
- Cần kết nối internet

#### Google TTS
- Chất lượng tốt
- Hỗ trợ nhiều ngôn ngữ
- Cần kết nối internet

#### Offline TTS (pyttsx3)
- Hoạt động offline
- Chất lượng cơ bản
- Phụ thuộc vào voice system của OS

### Voice Options

- **Tiếng Việt**: `vi-VN-HoaiMyNeural`, `vi-VN-NamMinhNeural`
- **Tiếng Anh**: `en-US-JennyNeural`, `en-US-GuyNeural`
- Và nhiều voice khác tùy theo engine

## 📁 Cấu trúc dự án

```
Atech_text_audio/
├── backend/
│   ├── app.py                 # FastAPI application
│   ├── services/
│   │   └── web_to_audio.py    # Core TTS logic
│   └── outputs/               # Generated audio files
├── frontend-react/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── App.js            # Main app component
│   │   └── index.js          # App entry point
│   └── package.json
└── frontend/                  # Alternative vanilla JS frontend
```

## 🔌 API Endpoints

- `GET /health` - Kiểm tra trạng thái server
- `POST /extract` - Trích xuất text từ URL
- `POST /tts` - Chuyển đổi text thành audio
- `POST /convert_chapters` - Xử lý hàng loạt nhiều chương
- `GET /files` - Lấy danh sách file
- `GET /download` - Tải xuống file

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Dự án này được phát hành dưới MIT License.

## 🆘 Hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra logs trong console
2. Đảm bảo tất cả dependencies đã được cài đặt
3. Kiểm tra kết nối internet (cho Edge TTS và Google TTS)
4. Tạo issue trên GitHub với thông tin chi tiết

## 🔮 Roadmap

- [ ] Hỗ trợ thêm nhiều ngôn ngữ
- [ ] Tùy chỉnh tốc độ đọc
- [ ] Background processing
- [ ] User authentication
- [ ] Cloud storage integration
- [ ] Mobile app
