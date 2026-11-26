# Sổ tay Claude Code

Trang cá nhân lưu và chia sẻ mẹo dùng Claude Code, viết bằng HTML, CSS và JavaScript thuần. Không cần build, không có thư viện.

## Xem trang

Mở `index.html` bằng trình duyệt là chạy. Muốn xem qua một server cục bộ (giống khi đưa lên mạng), chạy một trong hai lệnh sau trong thư mục này rồi mở `http://localhost:5173`:

```bash
npx serve -l 5173 .
python -m http.server 5173
```

Đưa lên mạng: tải nguyên thư mục lên bất kỳ dịch vụ trang tĩnh nào (GitHub Pages, Netlify, Cloudflare Pages, Vercel).

## Cấu trúc

```
index.html       Khung trang
css/style.css    Giao diện: màu, chữ, bố cục, chuyển động
js/app.js        Tìm kiếm, lọc, trang đọc, chép, sáng/tối
data/tips.js     Toàn bộ nội dung: thông tin trang, chủ đề, mẹo
```

Thêm hay sửa nội dung chỉ cần đụng vào `data/tips.js`.

## Thêm một mẹo

Mở `data/tips.js`, chép một khối trong mảng `tips` và sửa lại. Chỉ năm trường đầu là bắt buộc; các trường còn lại có thì hiện, không có thì ẩn.

```js
{
  id: 'ten-meo-khong-dau',        // dùng làm đường dẫn: index.html#ten-meo-khong-dau
  topic: 'quy-trinh',             // id của một chủ đề trong mảng topics
  level: 'co-ban',                // 'co-ban' hoặc 'nang-cao'
  title: 'Tên mẹo ngắn gọn',
  summary: 'Một câu nói mẹo này giúp gì.',

  why: 'Vì sao nên làm. Dùng mảng nếu muốn nhiều đoạn.',
  flow: {                         // sơ đồ các bước, có hiệu ứng khi cuộn tới
    title: 'Tên sơ đồ',
    steps: [{ label: 'Bước 1', note: 'giải thích ngắn' }, { label: 'Bước 2' }],
  },
  cards: [{ icon: 'book', title: 'Thẻ', text: 'Nội dung ngắn' }],  // 2 đến 4 thẻ
  scenario: 'Một tình huống áp dụng thực tế.',
  compare: { before: 'Cách viết chưa tốt', after: 'Cách nên viết' },
  steps: ['Bước 1', 'Bước 2'],
  prompt: 'Lời nhắn mẫu. [Phần trong ngoặc vuông] được tô để người đọc biết cần sửa.',
  commands: [{ cmd: '/context', desc: 'Lệnh này làm gì' }],
  code: '/lenh-mau',              // hoặc nội dung file mẫu
  codeLabel: '.claude/settings.json',
  note: 'Lưu ý quan trọng.',
  tags: ['từ khoá', 'giúp tìm kiếm'],
  sources: [docs('memory', 'Memory'), nhatAnh(6)],
},
```

- `prompt` và `code` nhận một chuỗi, hoặc một mảng `[{ label, text }]` khi cần nhiều khối.
- Trong các đoạn chữ, bọc trong dấu backtick (`` `/clear` ``) để hiện dạng code.
- Icon có sẵn: `terminal`, `message`, `book`, `layers`, `route`, `check`, `cpu`, `bolt`, `lock`, `bulb`, `alert`, `link`, `grid`. Thêm icon mới trong `ICONS` ở đầu `js/app.js`.

Mẹo hiện theo thứ tự chủ đề, và trong mỗi chủ đề theo thứ tự trong file.

## Ghi nguồn

Mỗi mẹo nên có `sources`. Hai hàm có sẵn ở đầu `data/tips.js` giúp viết gọn:

- `docs('goal', 'Keep Claude working toward a goal')` trỏ tới `https://code.claude.com/docs/en/goal`.
- `nhatAnh(13)` trỏ tới bài “16 bài học sau 1000 giờ dùng Claude” của Nhật Anh AI, kèm số bài.

Nguồn khác thì viết thẳng: `{ label: 'Tên nguồn', url: 'https://...' }`. Lời ghi công chung cho trang nằm ở `site.credit` và hiện ở chân trang.

## Thêm một chủ đề

Thêm một dòng vào mảng `topics` trong `data/tips.js`:

```js
{ id: 'chu-de-moi', name: 'Chủ đề mới', icon: 'bolt', desc: 'Một câu mô tả chủ đề.' },
```

Thứ tự trong mảng là thứ tự hiển thị.

## Đổi thông tin trang

Sửa đối tượng `site` ở đầu `data/tips.js`: tên trang, tác giả, tiêu đề lớn, lời dẫn, ngày cập nhật và các từ khoá chạy gợi ý trong ô tìm kiếm.

Đổi màu hoặc font: sửa các biến trong `:root` ở đầu `css/style.css` (có hai bộ: giấy kẻ ô cho giao diện sáng, nền đen cho giao diện tối).

## Tính năng

- Tìm kiếm không phân biệt dấu: gõ "bo nho" vẫn ra "bộ nhớ". Phím tắt `/` hoặc `Ctrl+K` để tìm.
- Lọc theo chủ đề và mức độ; bộ lọc được ghi vào địa chỉ trang (`?q=...&chu-de=...&muc-do=...`) để chia sẻ được.
- Mỗi mẹo có liên kết riêng (`#id`). Trong trang đọc: phím ← → để chuyển mẹo, `Esc` để đóng.
- Nút Chép cho lời nhắn, lệnh mẫu và từng dòng trong bảng lệnh.
- Trang đọc có sơ đồ các bước (chạy hiệu ứng khi cuộn tới, có nút Chạy lại), thẻ, khung so sánh, tình huống áp dụng, lưu ý và nguồn tham khảo.
- Giao diện sáng/tối theo hệ thống, có nút chuyển và nhớ lựa chọn.
- Tôn trọng cài đặt giảm chuyển động của hệ điều hành.
