# WebToAudio React Frontend

Giao diện web hiện đại cho ứng dụng WebToAudio được xây dựng bằng ReactJS.

## 🚀 Tính Năng

- **Trích xuất nội dung**: Lấy text từ URL web và lọc bỏ nội dung không liên quan
- **Text-to-Speech**: Hỗ trợ 3 engine TTS:
  - Microsoft Edge TTS (chất lượng cao nhất)
  - Google TTS
  - Offline TTS (pyttsx3)
- **Batch Processing**: Tự động chuyển đổi nhiều chương liên tiếp
- **Quản lý file**: Xem và tải các file audio/text đã tạo
- **Real-time logs**: Theo dõi quá trình xử lý

## 🛠️ Cài Đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm start
```

## 📁 Cấu Trúc

```
src/
├── components/
│   ├── ExtractSection.js    # Trích xuất nội dung 1 trang
│   ├── BatchSection.js      # Xử lý nhiều chương
│   ├── FilesSection.js      # Quản lý file
│   └── LogsSection.js       # Hiển thị logs
├── App.js                   # Component chính
├── App.css                  # Styles
└── index.js                 # Entry point
```

## 🎨 Giao Diện

- **Thiết kế hiện đại**: Gradient background, glassmorphism effects
- **Responsive**: Tương thích mobile và desktop
- **User-friendly**: Giao diện trực quan, dễ sử dụng
- **Real-time feedback**: Loading states, error handling

## 🔧 API Endpoints

Frontend giao tiếp với backend qua các endpoint:

- `POST /extract` - Trích xuất text từ URL
- `POST /tts` - Chuyển text sang audio
- `POST /convert_chapters` - Xử lý nhiều chương
- `GET /files` - Danh sách file
- `GET /download` - Tải file

## 🚀 Sử Dụng

1. **Chạy Backend**: `python -m uvicorn backend.app:app --host 127.0.0.1 --port 8000 --reload`
2. **Chạy Frontend**: `npm start`
3. **Mở trình duyệt**: http://localhost:3000

## 📱 Responsive Design

- Desktop: Layout đầy đủ với grid và flexbox
- Tablet: Tối ưu cho màn hình vừa
- Mobile: Stack layout, touch-friendly buttons

## 🎯 Tính Năng Nổi Bật

- **Auto-scroll logs**: Tự động cuộn xuống log mới nhất
- **File preview**: Hiển thị icon theo loại file
- **Progress indicators**: Loading states cho các thao tác
- **Error handling**: Thông báo lỗi rõ ràng
- **Keyboard shortcuts**: Hỗ trợ Enter để submit

## 🔄 Development

```bash
# Development mode
npm start

# Build production
npm run build

# Run tests
npm test

# Eject (không khuyến nghị)
npm run eject
```

## 📦 Dependencies

- React 18
- CSS3 với modern features
- Fetch API cho HTTP requests
- ES6+ JavaScript features
