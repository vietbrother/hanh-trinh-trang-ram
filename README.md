# TRUNG THU 4.0 — HÀNH TRÌNH TRĂNG RẰM (MVP)

> **Sự kết hợp giữa:** Mô hình bản đồ Trung thu vật lý 3D + Trạm quét QR + Website Mobile-First + Storytelling Thỏ Ngọc + Thử thách đố vui + Tích điểm & Huy hiệu Hộ chiếu.

Ứng dụng web chạy trực tiếp trên trình duyệt điện thoại **không cần cài app**, được thiết kế theo tư duy **Clean Architecture** với **Vanilla JavaScript ES Modules** và **CSS3 Design Tokens**, sẵn sàng tải lên **GitHub Pages** chạy ngay lập tức.

---

## 📁 Cấu trúc Thư mục

```text
TRUNG_THU_4.0/
├── index.html                  # Entry point HTML5 semantic, viewport mobile-first
├── README.md                   # Hướng dẫn chi tiết
│
├── src/
│   ├── config/                 # ⚙️ Cấu hình tập trung
│   │   ├── app.config.js       # Tên app, mascot Thỏ Ngọc, phiên bản
│   │   ├── theme.config.js     # Tokens thiết kế, màu sắc, bán kính bo
│   │   └── game.config.js      # Điểm thưởng, độ dài nickname
│   │
│   ├── data/                   # 📊 Dữ liệu tách biệt hoàn toàn khỏi UI
│   │   ├── stations.data.js    # Danh mục trạm, câu hỏi, đáp án, nhiệm vụ
│   │   ├── badges.data.js      # Danh mục huy hiệu thám hiểm
│   │   └── messages.data.js    # Văn bản thông báo, lời dặn, thông điệp vui
│   │
│   ├── services/               # 🧠 Nghiệp vụ tập trung (Single Source of Truth)
│   │   ├── storage.service.js  # Wrapper an toàn cho LocalStorage
│   │   ├── player.service.js   # Quản lý nickname, điểm, ngăn cộng điểm lặp
│   │   ├── station.service.js  # Tìm kiếm trạm, phân định trạng thái AVAILABLE/COMPLETED
│   │   └── audio.service.js    # Hiệu ứng chuông pentatonic & đọc nhiệm vụ
│   │
│   ├── components/             # 🧱 Giao diện tái sử dụng (Reusable DOM Components)
│   │   ├── app-shell.js        # Khung ứng dụng mobile 480px, safe-area
│   │   ├── button.js           # Button chuẩn touch target ≥ 44px
│   │   ├── card.js             # Thẻ bo góc mềm mại
│   │   ├── score-display.js    # Huy hiệu hiển thị điểm số ⭐
│   │   ├── player-profile.js   # Thanh header: Nickname, điểm, bật/tắt loa
│   │   ├── station-header.js   # Tiêu đề trạm và icon
│   │   ├── question-card.js    # Thẻ câu hỏi và các phương án lựa chọn
│   │   ├── badge-card.js       # Thẻ vinh danh huy hiệu đạt được
│   │   └── feedback-message.js # Banner phản hồi đúng/thử lại
│   │
│   ├── pages/                  # 📄 Màn hình
│   │   ├── gateway.page.js     # Cổng Vào (QR00) & Hộ Chiếu Nhà Thám Hiểm
│   │   └── station.page.js     # Màn hình Trạm Khám Phá (QR01 & mở rộng 02..05)
│   │
│   ├── utils/                  # 🛠️ Tiện ích phụ trợ
│   │   ├── dom.js              # DOM an toàn, chống XSS
│   │   ├── url.js              # Trích xuất ?station=01 từ URL
│   │   └── validation.js       # Kiểm tra hợp lệ tên người chơi (2-20 ký tự)
│   │
│   ├── styles/                 # 🎨 CSS Design System
│   │   ├── reset.css           # CSS Reset chuẩn
│   │   ├── tokens.css          # Design tokens (:root CSS Variables)
│   │   ├── base.css            # Nền trời đêm, ánh trăng, typography
│   │   ├── components.css      # Style các component UI
│   │   └── pages.css           # Bố cục trang, hoạt ảnh CSS, hoa giấy nhẹ
│   │
│   └── main.js                 # Router & điều phối luồng ứng dụng
```

---

## 🚀 Cách chạy trên máy Local

### Cách 1: Sử dụng bất kỳ Static Web Server nào (Không cần build)
Vì project viết bằng **Vanilla JS ES Modules**, bạn chỉ cần mở thư mục gốc bằng một static server:
```bash
# Sử dụng npx serve
npx serve .

# Hoặc sử dụng Python 3 có sẵn trên máy
python3 -m http.server 3000
```
Mở trình duyệt: `http://localhost:3000`

### Cách 2: Sử dụng Vite Dev Server
```bash
npm run dev
```

---

## 🌐 Cách deploy lên GitHub Pages

1. Đẩy mã nguồn lên repository GitHub của bạn.
2. Vào **Settings** của repository -> mục **Pages**.
3. Tại **Build and deployment** -> **Source**: Chọn **Deploy from a branch**.
4. Chọn Branch `main` (hoặc `master`), thư mục `/ (root)`.
5. Nhấn **Save**. Sau khoảng 1 phút, website sẽ hoạt động tại:
   `https://<YOUR_USERNAME>.github.io/<REPO_NAME>/`

---

## 📱 Cách tạo mã QR tương ứng

Dùng bất kỳ công cụ tạo mã QR miễn phí (như qr-code-generator.com):

| Mã QR | Tên trạm | URL mục tiêu |
|---|---|---|
| **QR00** | Cổng Vào | `https://<YOUR_DOMAIN>/` |
| **QR01** | Trạm 01: Cung Trăng | `https://<YOUR_DOMAIN>/?station=01` |
| **QR02** | Trạm 02 (tương lai) | `https://<YOUR_DOMAIN>/?station=02` |

> *Lưu ý: Bạn có thể in mã QR00 dán tại Cổng hành trình, và in mã QR01 dán tại vị trí Cung Trăng trên mô hình vật lý 3D.*

---

## ➕ Cách mở rộng thêm Trạm mới (Station 02, 03, 04...)

Kiến trúc được thiết kế hoàn toàn **Data-Driven**. Bạn **KHÔNG CẦN VIẾT LẠI CODE UI**, chỉ cần 2 bước:

### Bước 1: Khai báo huy hiệu mới trong `src/data/badges.data.js`
```javascript
'lantern-master': {
  id: 'lantern-master',
  stationId: 'station-02',
  stationCode: '02',
  name: 'Bậc Thầy Đèn Lồng',
  icon: '🏮',
  title: 'Huy Hiệu Phố Đèn',
  description: 'Đã hoàn thành thử thách tại Phố Đèn Lồng!',
}
```

### Bước 2: Thêm dữ liệu trạm mới vào mảng trong `src/data/stations.data.js`
```javascript
{
  id: 'station-02',
  code: '02',
  name: 'Phố Đèn Lồng',
  title: 'Trạm 02: Phố Đèn Lồng',
  icon: '🏮',
  badgeId: 'lantern-master',
  story: {
    mascotCallout: '🐰 Thỏ Ngọc dẫn bạn tới Phố Đèn Lồng lung linh...',
    guidance: 'Hãy quan sát mô hình 3D và tìm chiếc đèn kéo quân!',
  },
  audio: {
    label: 'Nghe nhiệm vụ Phố Đèn',
    textToSpeak: 'Bạn hãy tìm chiếc đèn kéo quân trên mô hình phố cổ nhé!',
  },
  physicalClue: {
    icon: '👀',
    title: 'Quan Sát Mô Hình Vật Lý Thật',
    text: 'Tìm góc phố cổ trên mô hình và xác định chiếc đèn kéo quân.',
  },
  mission: {
    title: 'NHIỆM VỤ PHỐ ĐÈN',
    description: 'Tìm chiếc đèn kéo quân và chọn phương án đúng.',
  },
  question: {
    id: 'q-station-02',
    text: 'Chiếc đèn nào là đèn kéo quân?',
    options: [
      { id: 'opt-lantern-turn', icon: '🏮', label: 'Đèn Kéo Quân', isCorrect: true },
      { id: 'opt-fish', icon: '🐟', label: 'Đèn Cá Chép', isCorrect: false },
    ],
  },
  reward: {
    points: 10,
    badgeId: 'lantern-master',
  },
}
```
*Hệ thống Router sẽ tự động nhận diện `?station=02`, hiển thị giao diện, chấm điểm và trao huy hiệu mới mà không cần sửa bất kỳ file logic nào.*

---

## 🎨 Cách tùy chỉnh Giao diện, Màu sắc & Điểm số

- **Màu sắc & Tokens:** Chỉnh sửa các biến CSS trong `src/styles/tokens.css` (ví dụ `--color-primary`, `--color-accent-gold`).
- **Điểm số & Ràng buộc tên:** Chỉnh sửa trong `src/config/game.config.js` (`defaultRewardPoints: 10`, `minLength: 2`, `maxLength: 20`).
- **Nội dung câu hỏi:** Chỉnh sửa trực tiếp tại `src/data/stations.data.js`.
- **Thông điệp hệ thống:** Chỉnh sửa trong `src/data/messages.data.js`.

---

## 🔄 Cách reset dữ liệu người chơi để test lại

1. Trên màn hình Cổng vào (Hộ chiếu thám hiểm), nhấn nút: **"Đổi tên hoặc Chơi lại từ đầu"**.
2. Hoặc mở DevTools trình duyệt (F12) -> Console gõ:
   ```javascript
   localStorage.clear(); location.reload();
   ```

---

## ✅ Checklist Kiểm tra Nghiệp vụ MVP

- [x] Mở không có tham số URL -> Hiện Cổng vào (Gateway), nhập Nickname.
- [x] Validate Nickname (không cho chuỗi rỗng, độ dài 2-20 ký tự, chống XSS).
- [x] Lưu trạng thái người chơi vào LocalStorage.
- [x] Quét `?station=01` -> Mở đúng Trạm 01 Cung Trăng.
- [x] Storytelling Thỏ Ngọc & nút phát âm thanh nhiệm vụ.
- [x] Box hướng dẫn tương tác với mô hình vật lý 3D thật.
- [x] Trả lời sai: Báo thử lại vui vẻ, không trừ điểm, không khóa game.
- [x] Trả lời đúng: Hiệu ứng pháo hoa, cộng đúng +10 điểm, trao Huy hiệu Cung Trăng.
- [x] **Chống lặp điểm:** Refresh trang hoặc quét lại QR01 không cộng thêm điểm lần 2.
- [x] Truy cập `?station=999` (trạm không tồn tại) -> Báo lỗi thân thiện, không crash app.
- [x] Chưa nhập tên mà truy cập trực tiếp `?station=01` -> Nhắc bé nhập tên trước tại Cổng vào.
- [x] Mobile-first: Tối ưu hoàn hảo cho màn hình 320px đến 414px, touch target ≥ 44px.
