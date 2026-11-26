/*
 * NỘI DUNG CỦA SỔ TAY
 * ------------------------------------------------------------------
 * Đây là file duy nhất cần sửa khi thêm hoặc chỉnh mẹo.
 * Chép một khối { ... } trong `tips`, dán vào chỗ phù hợp rồi sửa nội dung.
 *
 * Trường bắt buộc
 *   id        Chuỗi không dấu, nối bằng gạch ngang. Dùng làm đường dẫn (#id).
 *   topic     id của một chủ đề trong `topics`.
 *   level     'co-ban' hoặc 'nang-cao'.
 *   title     Tên mẹo, ngắn.
 *   summary   Một câu: mẹo này giúp gì.
 *
 * Trường tuỳ chọn (có thì hiện, không có thì ẩn)
 *   why       Vì sao. Chuỗi, hoặc mảng chuỗi nếu nhiều đoạn.
 *   flow      Sơ đồ các bước: { title, steps: [{ label, note }] }.
 *   cards     Các thẻ nhỏ đặt cạnh nhau: [{ icon, title, text }].
 *   scenario  Tình huống áp dụng thực tế.
 *   compare   So sánh: { before: 'Thay vì...', after: 'Nên...' }.
 *   steps     Các bước làm, theo thứ tự.
 *   prompt    Lời nhắn mẫu. Chuỗi, hoặc mảng [{ label, text }].
 *   commands  Bảng lệnh: [{ cmd, desc }].
 *   code      Lệnh hoặc file mẫu. Chuỗi (kèm codeLabel), hoặc mảng [{ label, text }].
 *   note      Lưu ý quan trọng.
 *   tags      Từ khoá giúp tìm kiếm.
 *   sources   Nguồn tham khảo: dùng docs('trang', 'Tên') hoặc nhatAnh(số bài).
 *
 * Trong các đoạn chữ, bọc trong `dấu backtick` để hiện dạng code.
 * Trong lời nhắn mẫu, [phần trong ngoặc vuông] được tô để người đọc biết cần sửa.
 * Icon có sẵn: terminal, message, book, layers, route, check, cpu, bolt, lock, bulb, alert, link, grid.
 */

window.SOTAY = (() => {
  const docs = (page, title) => ({
    label: `Tài liệu Claude Code: ${title}`,
    url: `https://code.claude.com/docs/en/${page}`,
  });
  const nhatAnh = (n) => ({
    label: `Nhật Anh AI, 16 bài học sau 1000 giờ dùng Claude (bài #${n})`,
    url: 'https://nhatanh.ai/1000-gio/',
  });

  const site = {
    name: 'Sổ tay Claude Code',
    author: 'Hau Nguyen',
    headline: 'Mẹo Claude Code dùng được ngay',
    intro:
      'Những gì mình rút ra khi làm việc với Claude Code mỗi ngày. Mỗi mẹo có lý do, cách làm, và lời nhắn hoặc lệnh mẫu để bạn chép dùng luôn.',
    updated: '2026-11-26',
    docsUrl: 'https://code.claude.com/docs/en/overview',
    credit: {
      text: 'Một số mẹo được chọn lọc và viết lại từ bài “16 bài học sau 1000 giờ dùng Claude” của Nhật Anh AI',
      url: 'https://nhatanh.ai/1000-gio/',
    },
    // Những từ khoá chạy lần lượt trong ô tìm kiếm
    searchExamples: ['CLAUDE.md', '/goal', 'tiết kiệm ngữ cảnh', 'subagent Haiku', 'bàn giao', 'hook'],
  };

  const topics = [
    { id: 'bat-dau', name: 'Bắt đầu', icon: 'terminal', desc: 'Những thao tác nên quen tay từ ngày đầu.' },
    { id: 'giao-viec', name: 'Giao việc', icon: 'message', desc: 'Viết yêu cầu để Claude hiểu đúng ngay lần đầu.' },
    { id: 'claude-md', name: 'CLAUDE.md và bộ nhớ', icon: 'book', desc: 'Dạy Claude về dự án một lần, dùng lại ở mọi phiên.' },
    { id: 'ngu-canh', name: 'Ngữ cảnh', icon: 'layers', desc: 'Giữ cuộc trò chuyện gọn để Claude không quên, không lạc đề.' },
    { id: 'quy-trinh', name: 'Quy trình', icon: 'route', desc: 'Lên kế hoạch, làm từng bước và quay lui an toàn.' },
    { id: 'kiem-chung', name: 'Kiểm chứng', icon: 'check', desc: 'Để Claude chứng minh việc đã xong, thay vì bạn tự soát.' },
    { id: 'model', name: 'Model và chi phí', icon: 'cpu', desc: 'Model mạnh cho phần cần nghĩ, model nhỏ cho phần cần làm.' },
    { id: 'tu-dong-hoa', name: 'Tự động hoá', icon: 'bolt', desc: 'Lệnh riêng, skill, subagent, hook, và để Claude chạy khi bạn vắng mặt.' },
    { id: 'an-toan', name: 'Kết nối và an toàn', icon: 'lock', desc: 'MCP, quyền truy cập và những thứ không nên bật.' },
  ];

  const tips = [
    /* ================================================================ Bắt đầu */
    {
      id: 'go-a-cong-chi-dung-file',
      topic: 'bat-dau',
      level: 'co-ban',
      title: 'Gõ @ để chỉ đúng file',
      summary: 'Đưa thẳng file cần thiết vào ngữ cảnh thay vì để Claude tự đi tìm.',
      why: 'Khi bạn viết "sửa file cấu hình", Claude phải đoán đó là file nào và tốn vài lượt tìm kiếm, đôi khi tìm nhầm. Gõ `@` sẽ mở danh sách gợi ý file và thư mục trong dự án; chọn một mục là Claude đọc đúng file đó ngay.',
      steps: [
        'Trong ô nhập, gõ `@` rồi vài ký tự của tên file.',
        'Dùng phím mũi tên và Tab để chọn. Có thể chọn cả thư mục để Claude xem cấu trúc bên trong.',
        'Viết tiếp yêu cầu như bình thường.',
      ],
      prompt: 'Đọc @src/auth/login.ts và @src/auth/session.ts, rồi giải thích luồng đăng nhập trong 5 gạch đầu dòng. Chưa sửa gì cả.',
      tags: ['@', 'file', 'phím tắt'],
      sources: [docs('interactive-mode', 'Interactive mode')],
    },
    {
      id: 'dan-anh-chup-man-hinh',
      topic: 'bat-dau',
      level: 'co-ban',
      title: 'Dán ảnh chụp màn hình thay vì tả bằng lời',
      summary: 'Một ảnh chụp lỗi giao diện nói rõ hơn cả đoạn mô tả dài.',
      why: 'Claude đọc được ảnh. Với lỗi giao diện, thông báo lỗi trên trình duyệt hay một bản thiết kế mẫu, đưa ảnh vào giúp Claude thấy đúng thứ bạn thấy, thay vì phải hình dung từ lời kể.',
      steps: [
        'Chụp vùng màn hình có vấn đề.',
        'Trong terminal: dán bằng `Ctrl+V` (trên Windows là `Alt+V`). Trong app Desktop: kéo thả hoặc dán như bình thường.',
        'Nói rõ bạn muốn Claude nhìn vào chỗ nào trong ảnh.',
      ],
      prompt: 'Ảnh này là trang thanh toán trên điện thoại. Nút "Đặt hàng" bị che mất một nửa. Tìm nguyên nhân trong CSS và sửa, giữ nguyên giao diện trên máy tính.',
      tags: ['ảnh', 'giao diện', 'debug'],
      sources: [docs('interactive-mode', 'Interactive mode')],
    },
    {
      id: 'noi-thay-vi-go',
      topic: 'bat-dau',
      level: 'co-ban',
      title: 'Nói yêu cầu thay vì gõ',
      summary: 'Nói nhanh hơn gõ, và khi nói bạn tự nhiên kể đủ bối cảnh hơn.',
      why: [
        'Khi gõ, ta hay viết thật ngắn rồi để Claude đoán phần còn lại. Khi nói, bạn kể như đang giải thích cho đồng nghiệp ngồi cạnh: lỗi xảy ra lúc nào, đã thử gì, nghi chỗ nào. Đó chính là bối cảnh Claude cần.',
        'Claude Code có sẵn nhập bằng giọng nói: bật bằng `/voice`, rồi giữ phím để nói hoặc bấm một lần để bắt đầu. Lời nói được chép thành chữ ngay trong ô nhập, nên bạn sửa được trước khi gửi.',
      ],
      scenario: 'Bạn vừa lần theo một lỗi đơn hàng bị tạo trùng cả buổi sáng. Thay vì gõ "fix lỗi trùng đơn", bạn nói trong một phút: lỗi chỉ xảy ra khi bấm thanh toán hai lần liên tiếp, log cho thấy hai request cách nhau 50ms, và bạn nghi bước kiểm tra trạng thái đơn trước khi ghi.',
      steps: [
        'Gõ `/voice` để bật nhập bằng giọng nói (cần đăng nhập bằng tài khoản Claude.ai và có micro).',
        'Nói như đang giao việc: mục tiêu, bối cảnh, những gì đã thử, thế nào là xong.',
        'Đọc lại, sửa tên hàm hay tên file bị nghe nhầm, rồi gửi.',
        'Không dùng được `/voice`? Dùng đọc chính tả của hệ điều hành: `Windows + H` trên Windows, nhấn `Fn` hai lần trên macOS.',
      ],
      prompt: 'Mình vừa nói hơi lộn xộn. Trước khi làm, viết lại yêu cầu thành ba phần: mục tiêu, bối cảnh, ràng buộc. Rồi hỏi mình những gì còn thiếu.',
      tags: ['giọng nói', 'voice', 'đọc chính tả', 'prompt'],
      sources: [docs('voice-dictation', 'Voice dictation'), nhatAnh(3)],
    },
    {
      id: 'xuong-dong-khong-gui',
      topic: 'bat-dau',
      level: 'co-ban',
      title: 'Xuống dòng mà không gửi tin',
      summary: 'Enter là gửi. Muốn viết yêu cầu nhiều dòng thì dùng một trong các cách sau.',
      why: 'Yêu cầu dài dễ đọc hơn khi chia dòng, nhưng nhấn Enter là gửi luôn. Cách chắc chắn chạy ở mọi terminal là gõ `\\` rồi nhấn Enter, hoặc nhấn `Ctrl+J`. Shift+Enter cũng dùng được ở nhiều terminal mới như Windows Terminal, iTerm2, WezTerm.',
      steps: [
        'Gõ `\\` ở cuối dòng rồi nhấn Enter, hoặc nhấn `Ctrl+J`.',
        'Nếu terminal hỗ trợ, dùng Shift+Enter cho quen tay.',
        'Viết xong thì nhấn Enter như thường để gửi.',
      ],
      tags: ['phím tắt', 'terminal', 'nhiều dòng'],
      sources: [docs('interactive-mode', 'Interactive mode')],
    },
    {
      id: 'esc-de-dung',
      topic: 'bat-dau',
      level: 'co-ban',
      title: 'Nhấn Esc để dừng Claude giữa chừng',
      summary: 'Thấy Claude đi sai hướng thì dừng ngay, đừng đợi nó làm xong.',
      why: 'Nhấn `Esc` sẽ ngắt Claude giữa lượt mà vẫn giữ những gì đã làm, để bạn nhắn hướng mới. Khi ô nhập đang trống, nhấn `Esc` hai lần sẽ mở danh sách các tin nhắn trước đó để quay lại một điểm cũ.',
      steps: [
        'Thấy Claude sửa nhầm chỗ hoặc hiểu sai: nhấn `Esc` một lần.',
        'Nhắn ngắn gọn điều cần đổi, ví dụ "Không sửa file test, chỉ sửa code".',
        'Muốn làm lại từ một tin nhắn cũ: nhấn `Esc` hai lần và chọn tin nhắn đó.',
      ],
      tags: ['phím tắt', 'esc', 'rewind'],
      sources: [docs('interactive-mode', 'Interactive mode')],
    },
    {
      id: 'cham-than-chay-lenh',
      topic: 'bat-dau',
      level: 'co-ban',
      title: 'Gõ ! để chạy lệnh ngay trong phiên',
      summary: 'Chạy lệnh shell mà không cần mở cửa sổ khác, và Claude cũng thấy kết quả.',
      why: 'Bắt đầu tin nhắn bằng `!` sẽ chạy phần còn lại như một lệnh shell. Kết quả được đưa vào cuộc trò chuyện và Claude phản hồi dựa trên đó, nên bạn không phải chép dán log qua lại.',
      steps: [
        'Gõ `!` rồi lệnh, ví dụ `! git status`.',
        'Đọc kết quả cùng nhận xét của Claude, rồi nhắn tiếp nếu cần.',
      ],
      code: '! npm test\n! git log --oneline -5',
      tags: ['shell', 'phím tắt', 'terminal'],
      sources: [docs('interactive-mode', 'Interactive mode')],
    },

    /* ============================================================== Giao việc */
    {
      id: 'noi-ro-the-nao-la-xong',
      topic: 'giao-viec',
      level: 'co-ban',
      title: 'Nói rõ thế nào là xong',
      summary: 'Một tiêu chí hoàn thành cụ thể giúp Claude biết khi nào dừng và tự kiểm tra.',
      why: 'Một yêu cầu không có điểm kết thúc rõ ràng có thể hiểu theo nhiều cách, và Claude sẽ tự chọn một cách. Khi bạn nêu điều kiện kiểm tra được, chỉ còn một cách hiểu, và Claude dùng chính điều kiện đó để tự kiểm tra trước khi báo xong.',
      compare: {
        before: 'Sửa lỗi đăng nhập.',
        after: 'Sửa lỗi đăng nhập thất bại khi email có chữ hoa. Xong khi: có test cho trường hợp này và `npm test` qua hết. Không đổi schema bảng users.',
      },
      steps: [
        'Viết mục tiêu trong một câu.',
        'Thêm một dòng "Xong khi..." với điều kiện kiểm tra được: test qua, trang hiển thị đúng, lệnh chạy không lỗi.',
        'Nếu có, thêm những gì không được làm.',
      ],
      prompt:
        'Mục tiêu: [việc cần làm].\nXong khi: [điều kiện kiểm tra được, ví dụ lệnh test nào phải qua].\nKhông được: [những gì cần giữ nguyên].\nLàm xong thì chạy kiểm tra và báo kết quả.',
      tags: ['prompt', 'tiêu chí', 'giao việc'],
      sources: [docs('best-practices', 'Best practices')],
    },
    {
      id: 'chi-vao-mau-that',
      topic: 'giao-viec',
      level: 'co-ban',
      title: 'Chỉ vào mẫu thật thay vì dùng tính từ',
      summary: '"Làm giống file này" ngắn hơn và đúng ý hơn mười tính từ.',
      why: 'Những chữ như "chuẩn", "sạch", "hiện đại" mỗi người hiểu một kiểu. Một mẫu thật thì chỉ có một cách hiểu: một file trong dự án đã viết đúng kiểu bạn muốn, một ảnh chụp giao diện bạn thích, một tài liệu có cấu trúc bạn cần. Chưa có mẫu thì nhờ Claude đi tìm vài phương án trước.',
      compare: {
        before: 'Viết endpoint orders cho chuẩn, sạch, dễ bảo trì.',
        after: 'Viết endpoint orders theo đúng cách @src/routes/users.ts đang làm: cùng cách kiểm tra đầu vào, cùng định dạng lỗi, và có test như @tests/users.test.ts.',
      },
      steps: [
        'Tìm một file, ảnh hoặc tài liệu đã đúng kiểu bạn muốn.',
        'Đưa nó vào yêu cầu bằng `@` hoặc dán ảnh.',
        'Nói rõ phần nào giữ nguyên, phần nào khác đi.',
      ],
      prompt: 'Đây là [file, ảnh hoặc tài liệu] mẫu mình muốn theo. Chỉ ra 3 đến 5 điểm làm nên cách làm của mẫu này, rồi làm [việc của mình] theo đúng những điểm đó. Giữ nguyên: [phần cần giữ]. Khác đi: [phần cần đổi].',
      tags: ['prompt', 'quy ước', 'ví dụ', '@'],
      sources: [docs('best-practices', 'Best practices'), nhatAnh(4)],
    },
    {
      id: 'de-claude-phong-van',
      topic: 'giao-viec',
      level: 'co-ban',
      title: 'Để Claude phỏng vấn bạn trước khi viết spec',
      summary: 'Chưa nghĩ kỹ thì để Claude hỏi từng câu, cho đến khi đủ ý để viết spec.',
      why: 'Nhiều yêu cầu bị làm sai không phải vì Claude kém, mà vì chính ta chưa nghĩ tới các trường hợp biên. Thay vì cố viết một prompt hoàn hảo, hãy để Claude hỏi lại: mỗi lần một câu, kèm phương án nó đề xuất để bạn chỉ cần đồng ý hoặc sửa. Câu trả lời được ghi vào file ngay, nên cuộc trò chuyện có dài hay bị ngắt cũng không mất gì.',
      flow: {
        title: 'Từ ý tưởng mơ hồ tới spec',
        steps: [
          { label: 'Claude hỏi', note: 'một câu, kèm phương án đề xuất' },
          { label: 'Bạn chốt', note: 'đồng ý, sửa, hoặc "để sau"' },
          { label: 'Ghi vào SPEC.md', note: 'ngay sau mỗi câu trả lời' },
          { label: 'Phiên mới', note: 'làm theo spec với ngữ cảnh sạch' },
        ],
      },
      scenario: 'Bạn cần thêm giới hạn tần suất (rate limit) cho API công khai nhưng chưa rõ giới hạn theo người dùng hay theo API key, request vượt ngưỡng thì trả về gì, phần nào để sau. Mười phút trả lời câu hỏi của Claude cho ra một SPEC.md đủ để giao việc.',
      steps: [
        'Gửi lời nhắn mẫu kèm việc bạn muốn làm.',
        'Trả lời từng câu. Câu nào chưa chắc thì nói "để sau" để Claude ghi vào mục câu hỏi mở.',
        'Đọc lại SPEC.md khi Claude báo đã đủ ý.',
        'Mở phiên mới và giao việc dựa trên SPEC.md.',
      ],
      prompt: 'Mình muốn [tính năng] nhưng chưa nghĩ kỹ. Hãy phỏng vấn mình, mỗi lần một câu, kèm phương án bạn đề xuất. Sau mỗi câu trả lời, ghi ngay vào SPEC.md. Hỏi cho đến khi đủ để viết spec, rồi tóm tắt các quyết định và những câu hỏi còn mở.',
      tags: ['spec', 'phỏng vấn', 'yêu cầu', 'prompt'],
      sources: [docs('best-practices', 'Best practices'), nhatAnh(5)],
    },
    {
      id: 'hoi-truoc-sua-sau',
      topic: 'giao-viec',
      level: 'co-ban',
      title: 'Hỏi trước, sửa sau',
      summary: 'Với code lạ, dành một lượt để Claude đọc và giải thích trước khi cho phép sửa.',
      why: 'Khi chưa hiểu đoạn code, bạn khó đánh giá thay đổi Claude đề xuất là đúng hay sai. Một lượt hỏi đáp trước giúp cả hai cùng nắm bối cảnh, và những gì Claude vừa đọc vẫn nằm trong ngữ cảnh cho bước sửa sau đó.',
      steps: [
        'Hỏi Claude về luồng xử lý, nói rõ "chưa sửa gì".',
        'Đọc câu trả lời, hỏi thêm chỗ chưa rõ.',
        'Khi đã hiểu, mới giao việc sửa.',
      ],
      prompt: 'Chưa sửa gì cả. Giải thích cho mình: khi người dùng bấm "Gửi" trên form liên hệ thì dữ liệu đi qua những file nào, và lỗi được xử lý ở đâu?',
      tags: ['prompt', 'khám phá code', 'giao việc'],
      sources: [docs('best-practices', 'Best practices')],
    },
    {
      id: 'khoanh-vung-thay-doi',
      topic: 'giao-viec',
      level: 'nang-cao',
      title: 'Khoanh vùng những gì được phép sửa',
      summary: 'Nói trước giới hạn để Claude không tiện tay "dọn dẹp" cả những chỗ bạn không nhờ.',
      why: 'Claude khá nhiệt tình: sửa một lỗi nhỏ có thể kéo theo đổi tên biến, thêm thư viện hay viết lại cả hàm. Liệt kê sẵn phạm vi được phép giúp thay đổi gọn, dễ review và ít rủi ro.',
      steps: [
        'Nêu thư mục hoặc file được phép sửa.',
        'Nêu những gì phải giữ nguyên: API công khai, schema cơ sở dữ liệu, thư viện đang dùng.',
        'Yêu cầu Claude hỏi lại nếu thấy cần vượt ra ngoài phạm vi.',
      ],
      prompt: 'Chỉ sửa trong thư mục src/billing/. Không đổi tên hàm công khai, không thêm thư viện mới. Nếu thấy cần sửa ngoài phạm vi này, dừng lại và hỏi mình trước.',
      tags: ['prompt', 'phạm vi', 'review'],
      sources: [docs('best-practices', 'Best practices')],
    },
    {
      id: 'khong-chi-de-viet-code',
      topic: 'giao-viec',
      level: 'co-ban',
      title: 'Dùng Claude Code cho cả việc quanh code',
      summary: 'Tài liệu, sơ đồ, báo cáo sự cố hay script chạy một lần cũng là file, và Claude làm tốt.',
      why: 'Claude Code làm việc trực tiếp với file và chạy được lệnh trên máy bạn. Vì vậy ngoài viết code, nó hợp với rất nhiều việc kỹ sư phải làm hằng tuần mà ít ai nghĩ tới việc giao cho nó.',
      cards: [
        { icon: 'book', title: 'Design doc', text: 'Từ ghi chú họp và code hiện có thành tài liệu có cấu trúc.' },
        { icon: 'route', title: 'Release note', text: 'Gom commit từ `git log` theo tính năng, sửa lỗi, thay đổi phá vỡ.' },
        { icon: 'layers', title: 'Sơ đồ kiến trúc', text: 'Đọc code thật rồi vẽ bằng Mermaid, không vẽ theo trí nhớ.' },
        { icon: 'alert', title: 'Phân tích sự cố', text: 'Dựng dòng thời gian từ log và khoanh vùng commit đáng nghi.' },
      ],
      scenario: 'Sau một sự cố production, bạn đưa Claude file log, khoảng thời gian xảy ra và lịch sử commit của tuần đó. Claude dựng dòng thời gian, chỉ ra commit đáng nghi kèm lý do và viết bản nháp postmortem theo mẫu của nhóm. Bạn chỉ còn sửa những gì chỉ mình biết.',
      prompt: 'Đọc @logs/incident.log và lịch sử commit từ [ngày bắt đầu]. Dựng dòng thời gian sự cố, chỉ ra các commit đáng nghi kèm lý do, rồi viết bản nháp postmortem vào docs/postmortem.md theo mẫu @docs/templates/postmortem.md.',
      tags: ['tài liệu', 'postmortem', 'release note', 'Mermaid'],
      sources: [nhatAnh(1)],
    },

    /* ==================================================== CLAUDE.md và bộ nhớ */
    {
      id: 'init-tao-claude-md',
      topic: 'claude-md',
      level: 'co-ban',
      title: 'Chạy /init để có CLAUDE.md đầu tiên',
      summary: 'Claude tự đọc dự án và viết sẵn bản ghi chú để mọi phiên sau đều dùng.',
      why: '`CLAUDE.md` là file Claude tự đọc khi bắt đầu mỗi phiên. Lệnh `/init` quét dự án và viết bản nháp gồm cách build, cách chạy test và cấu trúc thư mục. Bạn chỉ cần đọc lại, sửa chỗ sai rồi commit cho cả nhóm cùng dùng.',
      steps: [
        'Mở Claude Code ở thư mục gốc của dự án.',
        'Chạy `/init`.',
        'Đọc file `CLAUDE.md` vừa tạo, xoá phần thừa, bổ sung điều Claude không thể tự biết.',
        'Commit file này vào git.',
      ],
      code: '/init',
      tags: ['CLAUDE.md', 'bộ nhớ', 'init'],
      sources: [docs('memory', 'Memory')],
    },
    {
      id: 'claude-md-nhu-to-ghi-chu',
      topic: 'claude-md',
      level: 'co-ban',
      title: 'Viết CLAUDE.md như tờ ghi chú, không phải tài liệu',
      summary: 'Ngắn, cụ thể, và chỉ ghi những gì Claude không tự đoán ra được.',
      why: 'Toàn bộ `CLAUDE.md` được nạp vào ngữ cảnh ở mỗi phiên, nên mỗi dòng đều tốn chỗ. Hữu ích nhất thường là lệnh chạy chính xác, quy ước riêng của nhóm và những cái bẫy từng gặp. Những gì đọc code là hiểu thì không cần ghi.',
      steps: [
        'Giữ ba nhóm: lệnh thường dùng, quy ước, những điều cần tránh.',
        'Mỗi ý một dòng, viết như một lời dặn.',
        'Thỉnh thoảng đọc lại và xoá dòng đã lỗi thời.',
      ],
      code:
        '# Lệnh\n- Chạy thử: pnpm dev\n- Test một file: pnpm vitest run path/to/file.test.ts\n\n# Quy ước\n- Dùng pnpm, không dùng npm hay yarn\n- Component mới đặt trong src/components/<Tên>/index.tsx\n\n# Cần tránh\n- Không sửa file trong src/generated/ (được sinh tự động)',
      codeLabel: 'Ví dụ CLAUDE.md',
      tags: ['CLAUDE.md', 'bộ nhớ', 'ngữ cảnh'],
      sources: [docs('memory', 'Memory'), docs('best-practices', 'Best practices')],
    },
    {
      id: 'nhac-lan-hai-thanh-quy-tac',
      topic: 'claude-md',
      level: 'co-ban',
      title: 'Nhắc đến lần thứ hai thì biến thành quy tắc',
      summary: 'Điều gì phải nhắc lại thì ghi vào CLAUDE.md, để không phiên nào phải nghe lại.',
      why: 'Mỗi phiên mới, Claude chỉ biết những gì nằm trong file nó đọc lúc bắt đầu; một lời nhắc trong chat chỉ sống đến hết phiên. Quy tắc dễ nhớ: một điều phải nhắc tới lần thứ hai thì xứng đáng thành một dòng trong `CLAUDE.md`. Cách nhẹ nhàng nhất là dặn Claude tự đề xuất dòng đó mỗi khi bạn phải nhắc lại, và chỉ ghi khi bạn đồng ý.',
      flow: {
        title: 'Từ lời nhắc thành quy tắc',
        steps: [
          { label: 'Lần 1', note: 'bạn nhắc trong chat' },
          { label: 'Lần 2', note: 'Claude đề xuất một dòng quy tắc' },
          { label: 'Bạn duyệt', note: 'sửa câu chữ nếu cần' },
          { label: 'CLAUDE.md', note: 'mọi phiên sau đều biết' },
        ],
      },
      scenario: 'Lần thứ hai bạn phải nói "dùng pnpm, đừng chạy npm install". Claude đề xuất thêm dòng "Dùng pnpm cho mọi lệnh cài đặt và chạy script" vào `CLAUDE.md` của dự án. Bạn duyệt, commit, và cả nhóm cùng hưởng.',
      prompt: 'Từ giờ, mỗi khi mình phải nhắc bạn một điều lần thứ hai, hãy đề xuất một dòng ngắn để thêm vào CLAUDE.md. Chỉ thêm khi mình đồng ý.',
      note: 'Claude Code còn có bộ nhớ tự động (auto memory) tự ghi lại những lần bạn sửa nó. Khác biệt: bộ nhớ tự động nằm trên máy bạn, còn `CLAUDE.md` của dự án nằm trong git để cả nhóm dùng chung và review được.',
      tags: ['CLAUDE.md', 'quy tắc', 'bộ nhớ', 'auto memory'],
      sources: [docs('memory', 'Memory'), nhatAnh(6)],
    },
    {
      id: 'claude-md-dang-muc-luc',
      topic: 'claude-md',
      level: 'nang-cao',
      title: 'Biến CLAUDE.md thành mục lục',
      summary: 'Chỉ giữ quy tắc luôn cần; phần chi tiết để ở file riêng, khi cần mới đọc.',
      why: [
        'Khi `CLAUDE.md` dài ra, quy tắc quan trọng bị lẫn giữa nhiều thứ khác và Claude bắt đầu bỏ sót. Hãy để file chính làm mục lục: vài quy tắc lúc nào cũng cần, cộng với những dòng chỉ đường tới tài liệu chi tiết.',
        'Lưu ý sự khác nhau: viết `@docs/testing.md` sẽ nạp file đó vào mọi phiên, còn ghi đường dẫn bình thường thì Claude tự mở khi việc đang làm cần tới. Quy tắc chỉ áp dụng cho một phần code thì đặt trong `.claude/rules/` kèm trường `paths`, để chúng chỉ được nạp khi Claude đụng tới file khớp.',
      ],
      compare: {
        before: 'Một CLAUDE.md 300 dòng: lịch sử dự án, toàn bộ quy ước API, hướng dẫn deploy, mẹo debug.',
        after: 'Một CLAUDE.md 40 dòng: lệnh chính, vài quy tắc luôn cần, và đường dẫn tới docs/api.md, docs/deploy.md để đọc khi cần.',
      },
      steps: [
        'Gõ `/memory` để xem Claude đang nạp những file bộ nhớ nào.',
        'Gửi lời nhắn mẫu để Claude đề xuất phần nên tách ra.',
        'Chuyển quy tắc theo thư mục vào `.claude/rules/` với trường `paths`.',
        'Thỉnh thoảng chạy `/doctor prompt-audit` để tìm chỉ dẫn lỗi thời hoặc mâu thuẫn.',
      ],
      prompt: 'Đọc CLAUDE.md. Đề xuất những phần nên chuyển ra file riêng (kèm tên file), để file chính chỉ còn quy tắc luôn cần và các dòng chỉ đường. Chỉ sửa khi mình đồng ý.',
      code: [
        {
          label: 'CLAUDE.md dạng mục lục',
          text: '# Lệnh\n- Cài đặt: pnpm install\n- Test: pnpm test\n\n# Luôn tuân thủ\n- Không commit thẳng vào main\n- Endpoint mới phải có test\n\n# Đọc khi cần\n- Quy ước API: docs/api.md\n- Quy trình deploy: docs/deploy.md\n- Kiến trúc tổng quan: docs/architecture.md',
        },
        {
          label: '.claude/rules/api.md',
          text: '---\npaths:\n  - "src/api/**/*.ts"\n---\n\n- Endpoint nào cũng kiểm tra đầu vào bằng schema\n- Lỗi trả về theo định dạng chung trong src/api/errors.ts',
        },
      ],
      tags: ['CLAUDE.md', 'rules', 'import', 'memory', 'tiết kiệm ngữ cảnh'],
      sources: [docs('memory', 'Memory'), docs('best-practices', 'Best practices'), nhatAnh(7)],
    },
    {
      id: 'claude-md-ca-nhan',
      topic: 'claude-md',
      level: 'co-ban',
      title: 'Đặt thói quen riêng trong ~/.claude/CLAUDE.md',
      summary: 'Một file dùng cho mọi dự án trên máy bạn, không ảnh hưởng đồng nghiệp.',
      why: 'Ngoài `CLAUDE.md` trong dự án, Claude còn đọc `~/.claude/CLAUDE.md` trong thư mục người dùng của bạn. Đây là chỗ cho sở thích cá nhân: ngôn ngữ trả lời, cách viết commit, công cụ hay dùng. File này không nằm trong git của dự án nên không làm phiền ai.',
      steps: [
        'Tạo hoặc mở `~/.claude/CLAUDE.md` (trên Windows là `%USERPROFILE%\\.claude\\CLAUDE.md`).',
        'Ghi những thói quen áp dụng cho mọi dự án.',
        'Để quy ước riêng của từng dự án trong `CLAUDE.md` của dự án đó.',
      ],
      code:
        '- Luôn trả lời bằng tiếng Việt, giữ nguyên thuật ngữ kỹ thuật tiếng Anh\n- Commit message viết bằng tiếng Anh, theo kiểu Conventional Commits\n- Giải thích ngắn gọn trước khi sửa từ 3 file trở lên',
      codeLabel: '~/.claude/CLAUDE.md',
      tags: ['CLAUDE.md', 'cá nhân', 'cài đặt'],
      sources: [docs('memory', 'Memory')],
    },
    {
      id: 'ba-tang-tri-nho',
      topic: 'claude-md',
      level: 'nang-cao',
      title: 'Dựng ba tầng trí nhớ cho dự án dài hơi',
      summary: 'Quy tắc, ghi chú và việc đang dở, mỗi thứ một chỗ, để phiên mới bắt nhịp ngay.',
      why: 'Claude không mang gì từ phiên này sang phiên khác ngoài những file nó đọc lúc bắt đầu. Với dự án kéo dài nhiều tuần, chia trí nhớ thành ba tầng giúp phiên mới nắm việc nhanh mà không phải nạp quá nhiều. Bước hay bị quên nhất là dặn Claude khi nào phải ghi: khi bạn sửa nó, khi có quyết định mới, và khi xong một việc.',
      cards: [
        { icon: 'book', title: 'Quy tắc', text: '`CLAUDE.md`: cách build, quy ước, điều cấm. Ít khi đổi.' },
        { icon: 'layers', title: 'Ghi chú', text: '`docs/notes/`: quyết định kèm lý do, hiểu biết về hệ thống. Có một file mục lục.' },
        { icon: 'route', title: 'Việc đang dở', text: '`PROGRESS.md`: đang làm gì, bước tiếp theo là gì. Đổi mỗi ngày.' },
      ],
      steps: [
        'Gửi lời nhắn dựng bộ nhớ; xem trước rồi mới cho Claude tạo file.',
        'Mở phiên mới, hỏi "Mình đang làm dở gì?" để kiểm tra.',
        'Mỗi tuần, gửi lời nhắn dọn bộ nhớ để gộp ghi chú trùng và bỏ việc đã xong.',
      ],
      prompt: [
        {
          label: 'Dựng bộ nhớ',
          text: 'Dựng bộ nhớ cho dự án này: (1) thư mục docs/notes/ cho ghi chú, mỗi chủ đề một file, kèm index.md liệt kê chúng; (2) file PROGRESS.md ghi việc đang dở và bước tiếp theo; (3) thêm vào CLAUDE.md quy tắc đọc hai file này đầu mỗi phiên, và cập nhật chúng khi mình sửa bạn, khi có quyết định, hoặc khi xong việc. Cho mình xem trước khi tạo.',
        },
        { label: 'Làm tiếp ở phiên mới', text: 'Đọc @PROGRESS.md. Làm tiếp việc đầu tiên chưa xong, cập nhật file khi xong, rồi dừng lại chờ mình.' },
        {
          label: 'Dọn bộ nhớ hằng tuần',
          text: 'Đọc lại docs/notes/ và PROGRESS.md: gộp ghi chú trùng, đánh dấu ghi chú đã lỗi thời, bỏ việc đã xong, cập nhật index.md. Cho mình xem danh sách thay đổi trước khi sửa.',
        },
      ],
      code: [
        {
          label: 'Cấu trúc thư mục',
          text: 'du-an/\n├── CLAUDE.md          quy tắc\n├── PROGRESS.md        việc đang dở\n└── docs/notes/        ghi chú\n    ├── index.md       mục lục, mỗi ghi chú một dòng\n    ├── decisions.md\n    └── payment-flow.md',
        },
        {
          label: 'Thêm vào CLAUDE.md',
          text: '# Bộ nhớ\n- Đầu mỗi phiên: đọc PROGRESS.md và docs/notes/index.md.\n- Khi mình sửa bạn, khi có quyết định mới, hoặc khi xong một việc:\n  cập nhật ghi chú và PROGRESS.md.',
        },
      ],
      note: 'Bộ nhớ tự động (auto memory) của Claude Code cũng ghi chú qua các phiên, nhưng lưu ngoài repo. Cách ở đây nằm ngay trong dự án: đọc được, sửa được, và đi theo git.',
      tags: ['bộ nhớ', 'CLAUDE.md', 'kế hoạch', 'việc dài', 'ghi chú'],
      sources: [docs('memory', 'Memory'), nhatAnh(8)],
    },
    {
      id: 'dua-cau-hinh-vao-git',
      topic: 'claude-md',
      level: 'nang-cao',
      title: 'Đưa cấu hình Claude vào git, dùng chung được với AGENTS.md',
      summary: 'Một bản gốc cho cả nhóm, có lịch sử, và không bị khoá vào một công cụ.',
      why: [
        'Sau một thời gian, `CLAUDE.md`, lệnh riêng, skill và subagent trở thành tài sản của dự án. Commit chúng vào git để cả nhóm dùng chung, review được như code, và quay lại được khi lỡ sửa sai. Thói quen cá nhân trong `~/.claude/` có thể để ở một repo dotfiles riêng tư.',
        'Nếu nhóm còn dùng công cụ AI khác, viết hướng dẫn chung vào `AGENTS.md`. Claude Code đọc `AGENTS.md` khi thư mục không có `CLAUDE.md`; cần thêm phần riêng cho Claude thì tạo `CLAUDE.md` có dòng `@AGENTS.md` để nạp chung.',
      ],
      steps: [
        'Kiểm tra `.gitignore` đã có `.claude/settings.local.json` và các file bí mật.',
        'Commit `CLAUDE.md` cùng thư mục `.claude/`.',
        'Review thay đổi trong các file này như review code.',
      ],
      code: [
        {
          label: 'Nên commit',
          text: 'CLAUDE.md            (hoặc AGENTS.md)\n.claude/settings.json\n.claude/commands/\n.claude/skills/\n.claude/agents/\n.claude/rules/',
        },
        { label: 'Không commit', text: '.claude/settings.local.json   cài đặt riêng của bạn\n.env                          khoá API, mật khẩu' },
        { label: 'CLAUDE.md khi dùng chung AGENTS.md', text: '@AGENTS.md\n\n# Riêng cho Claude Code\n- Việc tìm kiếm dài thì giao cho subagent doc-tim' },
      ],
      note: 'Claude Code tự đưa `.claude/settings.local.json` ra khỏi git khi chính nó tạo file này. Nếu bạn tự tạo, hãy tự thêm vào `.gitignore`.',
      tags: ['git', 'AGENTS.md', 'chia sẻ', 'settings', 'nhóm'],
      sources: [docs('memory', 'Memory'), docs('settings', 'Settings'), nhatAnh(16)],
    },

    /* =============================================================== Ngữ cảnh */
    {
      id: 'clear-khi-doi-viec',
      topic: 'ngu-canh',
      level: 'co-ban',
      title: 'Gõ /clear khi chuyển sang việc khác',
      summary: 'Ngữ cảnh sạch cho việc mới giúp Claude tập trung hơn.',
      why: 'Mọi thứ trong phiên, kể cả những file đã đọc và các lần thử sai, đều nằm trong ngữ cảnh. Khi bạn chuyển sang việc không liên quan, phần cũ chỉ gây nhiễu và tốn chỗ ở mỗi tin nhắn. `/clear` bắt đầu một cuộc trò chuyện mới; `CLAUDE.md` vẫn được nạp lại như cũ.',
      steps: ['Xong một việc, commit lại nếu cần.', 'Gõ `/clear`.', 'Bắt đầu việc mới với yêu cầu đủ bối cảnh.'],
      code: '/clear',
      tags: ['ngữ cảnh', 'clear', 'tiết kiệm ngữ cảnh'],
      sources: [docs('context-window', 'Context window')],
    },
    {
      id: 'context-day-de-sot',
      topic: 'ngu-canh',
      level: 'co-ban',
      title: 'Ngữ cảnh càng đầy càng dễ sót: đặt /autocompact sớm',
      summary: 'Cửa sổ ngữ cảnh lớn không có nghĩa Claude nhớ đều mọi thứ trong đó.',
      why: 'Các model mới có cửa sổ ngữ cảnh rất lớn, nhưng nhét càng nhiều thì thông tin quan trọng càng dễ bị lẫn: một quyết định từ đầu phiên, một ràng buộc bạn dặn từ sớm. Chất lượng bắt đầu giảm từ trước khi ngữ cảnh đầy. Thay vì đợi chạm giới hạn, hãy đặt ngưỡng để Claude Code tự tóm tắt sớm hơn, và giao việc đọc nhiều cho subagent.',
      scenario: 'Sau hai giờ refactor, Claude bắt đầu dùng lại tên hàm cũ mà bạn đã đổi từ đầu phiên. Đó là dấu hiệu ngữ cảnh đã quá đầy: hãy tóm tắt, hoặc bàn giao sang phiên mới, thay vì cố nhắc tiếp.',
      commands: [
        { cmd: '/context', desc: 'Xem ngữ cảnh đang chiếm bao nhiêu và phần nào chiếm nhiều nhất' },
        { cmd: '/autocompact 500k', desc: 'Tự tóm tắt khi ngữ cảnh chạm mức này, sớm hơn giới hạn của model' },
        { cmd: '/compact', desc: 'Tóm tắt ngay, có thể kèm chỉ dẫn cần giữ lại gì' },
        { cmd: '/clear', desc: 'Bắt đầu cuộc trò chuyện mới khi đổi sang việc khác' },
      ],
      steps: [
        'Gõ `/context` để biết bạn đang ở mức nào.',
        'Đặt `/autocompact` thấp hơn hẳn giới hạn của model.',
        'Việc cần đọc hàng chục file thì giao cho subagent, để phần đọc không tràn vào phiên chính.',
      ],
      tags: ['ngữ cảnh', 'autocompact', 'compact', 'tiết kiệm ngữ cảnh'],
      sources: [docs('context-window', 'Context window'), nhatAnh(9)],
    },
    {
      id: 'compact-co-chi-dan',
      topic: 'ngu-canh',
      level: 'nang-cao',
      title: 'Dùng /compact kèm chỉ dẫn giữ lại gì',
      summary: 'Tóm gọn cuộc trò chuyện dài mà không đánh rơi chi tiết quan trọng.',
      why: 'Khi ngữ cảnh gần đầy, Claude Code sẽ tự tóm tắt, nhưng bản tóm tắt tự động có thể bỏ sót điều bạn cần. Chủ động gõ `/compact` kèm một câu nói rõ cần giữ gì, vào lúc bạn chọn, cho kết quả đáng tin hơn.',
      steps: [
        'Khi xong một chặng nhưng vẫn làm tiếp cùng việc đó, gõ `/compact`.',
        'Thêm chỉ dẫn ngay sau lệnh.',
        'Đọc lướt bản tóm tắt để chắc không thiếu gì.',
      ],
      code: '/compact Giữ lại: danh sách file đã sửa, các quyết định thiết kế và những lỗi còn đang mở',
      tags: ['ngữ cảnh', 'compact', 'tiết kiệm ngữ cảnh'],
      sources: [docs('context-window', 'Context window')],
    },
    {
      id: 'ban-giao-truoc-phien-moi',
      topic: 'ngu-canh',
      level: 'co-ban',
      title: 'Viết lời bàn giao trước khi mở phiên mới',
      summary: 'Phiên quá dài thì nhờ Claude viết bàn giao, rồi dán vào một phiên sạch.',
      why: 'Khi cuộc trò chuyện đã quá dài, hoặc sau khi tự tóm tắt Claude bắt đầu quên điều đã thống nhất, mở phiên mới là cách nhanh nhất để lấy lại chất lượng. Nhưng đừng bắt đầu từ con số 0: nhờ Claude viết lời bàn giao, giống đồng nghiệp bàn giao việc trước khi nghỉ phép. Khác với `/compact`, bạn đọc và sửa được bản bàn giao trước khi dùng.',
      flow: {
        title: 'Bàn giao giữa hai phiên',
        steps: [
          { label: 'Phiên cũ', note: 'quá dài, bắt đầu quên' },
          { label: 'Lời bàn giao', note: 'đã xong, còn lại, file, quyết định' },
          { label: 'Bạn đọc lại', note: 'bổ sung chỗ thiếu' },
          { label: 'Phiên mới', note: 'dán vào và làm tiếp' },
        ],
      },
      steps: [
        'Gửi lời nhắn mẫu: Claude viết bàn giao trong một khối để chép một lần.',
        'Đọc lại, bổ sung điều Claude bỏ sót.',
        'Gõ `/clear` hoặc mở phiên mới, dán lời bàn giao rồi giao việc tiếp.',
      ],
      prompt: 'Mình sắp mở phiên mới. Viết lời bàn giao để dán vào phiên đó, gồm: việc đã xong; việc còn lại theo thứ tự; các file liên quan; các quyết định đã chốt kèm lý do; những chỗ còn nghi ngờ. Viết sao cho phiên mới đọc xong là làm tiếp được, và đặt tất cả trong một khối code để mình chép một lần.',
      tags: ['ngữ cảnh', 'bàn giao', 'phiên', 'clear'],
      sources: [docs('context-window', 'Context window'), nhatAnh(10)],
    },
    {
      id: 'xem-context',
      topic: 'ngu-canh',
      level: 'co-ban',
      title: 'Xem ngữ cảnh đang đầy cỡ nào bằng /context',
      summary: 'Biết cái gì đang chiếm chỗ trước khi Claude bắt đầu quên.',
      why: '`/context` vẽ mức sử dụng ngữ cảnh hiện tại, chia theo từng phần như công cụ, file bộ nhớ, MCP và cuộc trò chuyện, kèm gợi ý tối ưu. Nếu MCP hay `CLAUDE.md` chiếm quá nhiều, đó là chỗ nên dọn trước.',
      steps: [
        'Gõ `/context`.',
        'Tìm phần chiếm nhiều nhất.',
        'Tắt MCP server không dùng, rút gọn `CLAUDE.md`, hoặc `/compact` khi cần.',
      ],
      code: '/context',
      tags: ['ngữ cảnh', 'context', 'MCP', 'tiết kiệm ngữ cảnh'],
      sources: [docs('context-window', 'Context window')],
    },
    {
      id: 'hoi-ngang-bang-btw',
      topic: 'ngu-canh',
      level: 'co-ban',
      title: 'Hỏi ngang bằng /btw',
      summary: 'Câu hỏi bên lề không làm rối cuộc trò chuyện chính.',
      why: 'Đang giữa việc mà chợt muốn hỏi một điều nhỏ, như cú pháp một lệnh hay ý nghĩa một thuật ngữ? `/btw` trả lời câu hỏi đó mà không thêm vào lịch sử trò chuyện, nên ngữ cảnh của việc chính vẫn gọn.',
      steps: ['Gõ `/btw` rồi câu hỏi.', 'Đọc câu trả lời, rồi quay lại việc chính như chưa có gì xảy ra.'],
      code: '/btw regex nào khớp số điện thoại Việt Nam 10 chữ số?',
      tags: ['ngữ cảnh', 'btw', 'câu hỏi nhanh'],
      sources: [docs('context-window', 'Context window')],
    },
    {
      id: 'tiep-tuc-phien-cu',
      topic: 'ngu-canh',
      level: 'co-ban',
      title: 'Quay lại phiên cũ với --continue và --resume',
      summary: 'Đóng terminal không có nghĩa là mất cuộc trò chuyện.',
      why: 'Claude Code lưu lại các phiên trước. `claude --continue` (viết tắt `-c`) mở lại phiên gần nhất trong thư mục hiện tại; `claude --resume` cho bạn chọn từ danh sách. Trong một phiên đang mở, `/resume` làm việc tương tự.',
      steps: [
        'Mở terminal ở đúng thư mục dự án.',
        'Chạy `claude -c` để tiếp tục phiên gần nhất.',
        'Hoặc chạy `claude --resume` và chọn phiên cần mở.',
      ],
      code: 'claude -c\nclaude --resume',
      tags: ['phiên', 'resume', 'continue'],
      sources: [docs('sessions', 'Sessions')],
    },

    /* ============================================================== Quy trình */
    {
      id: 'plan-mode',
      topic: 'quy-trinh',
      level: 'co-ban',
      title: 'Bật Plan mode trước những việc lớn',
      summary: 'Claude đọc code và đưa ra kế hoạch, nhưng chưa sửa gì cho đến khi bạn đồng ý.',
      why: 'Ở Plan mode, Claude chỉ đọc và phân tích. Bạn xem kế hoạch, góp ý, đổi hướng khi còn rẻ, rồi mới cho làm. Với thay đổi chạm nhiều file, vài phút đọc kế hoạch tiết kiệm được nhiều vòng sửa đi sửa lại.',
      flow: {
        title: 'Một vòng Plan mode',
        steps: [
          { label: 'Shift+Tab', note: 'chuyển sang plan mode' },
          { label: 'Claude đọc code', note: 'chỉ đọc, chưa sửa' },
          { label: 'Bạn góp ý', note: 'đổi hướng khi còn rẻ' },
          { label: 'Chấp nhận', note: 'Claude bắt đầu làm' },
        ],
      },
      steps: [
        'Nhấn `Shift+Tab` cho đến khi chỉ báo chế độ dưới ô nhập hiện plan mode.',
        'Mô tả việc cần làm.',
        'Đọc kế hoạch, góp ý đến khi ưng.',
        'Chấp nhận kế hoạch để Claude bắt đầu làm.',
      ],
      prompt: 'Lên kế hoạch để thêm chức năng xuất báo cáo ra CSV. Liệt kê file cần sửa, thứ tự thực hiện, và những chỗ bạn chưa chắc cần mình quyết định.',
      tags: ['plan mode', 'kế hoạch', 'phím tắt'],
      sources: [docs('permission-modes', 'Permission modes')],
    },
    {
      id: 'commit-nho-thuong-xuyen',
      topic: 'quy-trinh',
      level: 'co-ban',
      title: 'Commit nhỏ, commit thường xuyên',
      summary: 'Git là lưới an toàn rẻ nhất khi làm việc cùng AI.',
      why: 'Claude có thể sửa hàng chục file trong vài phút. Commit sau mỗi bước chạy được giúp bạn so sánh dễ, quay lại dễ, và review từng phần nhỏ thay vì một khối thay đổi khổng lồ. Claude viết commit message khá tốt, cứ nhờ nó.',
      steps: [
        'Xong một bước chạy được, xem nhanh thay đổi.',
        'Nhờ Claude commit kèm message mô tả.',
        'Nếu bước sau hỏng, quay về commit trước.',
      ],
      prompt: 'Xem các thay đổi chưa commit, chia thành các commit nhỏ theo từng ý, và viết message rõ ràng cho mỗi commit.',
      tags: ['git', 'commit', 'an toàn'],
      sources: [docs('checkpointing', 'Checkpointing')],
    },
    {
      id: 'lui-lai-bang-rewind',
      topic: 'quy-trinh',
      level: 'co-ban',
      title: 'Lùi lại bằng /rewind khi lỡ đi sai đường',
      summary: 'Khôi phục code và cuộc trò chuyện về một điểm trước đó.',
      why: 'Claude Code lưu điểm khôi phục khi sửa file. `/rewind` (hoặc nhấn `Esc` hai lần khi ô nhập trống) cho bạn chọn một tin nhắn cũ, rồi khôi phục code, cuộc trò chuyện, hoặc cả hai.',
      steps: ['Gõ `/rewind`.', 'Chọn tin nhắn muốn quay lại.', 'Chọn khôi phục code, cuộc trò chuyện, hay cả hai.'],
      code: '/rewind',
      note: 'File chỉ bị thay đổi bởi lệnh shell, chưa từng được Claude sửa bằng công cụ sửa file, sẽ không được theo dõi. Vì vậy vẫn cần git.',
      tags: ['rewind', 'checkpoint', 'an toàn'],
      sources: [docs('checkpointing', 'Checkpointing')],
    },
    {
      id: 'worktree-chay-song-song',
      topic: 'quy-trinh',
      level: 'nang-cao',
      title: 'Chạy nhiều phiên song song bằng git worktree',
      summary: 'Mỗi phiên một thư mục riêng, không giẫm chân nhau.',
      why: 'Hai phiên Claude cùng sửa một thư mục sẽ ghi đè lên nhau. `git worktree` tạo thêm một bản làm việc của cùng repo, trên nhánh khác, ở thư mục khác. Mỗi phiên chạy trong một worktree; bạn qua lại xem và merge khi xong.',
      scenario: 'Trong lúc một phiên đang viết tính năng xuất CSV, bạn cần sửa gấp một lỗi production. Tạo worktree mới cho nhánh hotfix và mở phiên thứ hai ở đó; phiên đầu vẫn chạy bình thường.',
      steps: [
        'Tạo worktree mới cho từng việc.',
        'Mở một terminal trong mỗi worktree và chạy `claude`.',
        'Xong việc thì merge nhánh và xoá worktree.',
      ],
      code: 'git worktree add ../app-hotfix -b hotfix/thanh-toan\ncd ../app-hotfix\nclaude\n\n# Xong việc\ngit worktree remove ../app-hotfix',
      tags: ['git', 'worktree', 'chạy song song'],
      sources: [docs('best-practices', 'Best practices')],
    },

    /* ============================================================= Kiểm chứng */
    {
      id: 'bon-nac-kiem-chung',
      topic: 'kiem-chung',
      level: 'co-ban',
      title: 'Bốn nấc kiểm chứng, chọn nấc hợp với việc',
      summary: 'Việc nhỏ chỉ cần Claude tự kiểm tra; việc lớn mới cần /goal hay người soát thứ hai.',
      why: 'Khi tạo ra code đã rẻ, kỹ năng đáng giá nhất là biết kết quả có đúng không. Không có bước kiểm chứng thì chính bạn là người phát hiện lỗi, thường là muộn. Tài liệu Best practices của Claude Code cũng đặt việc cho Claude một phép kiểm tra để chạy lên hàng đầu. Hãy tăng dần mức kiểm chứng theo độ lớn của việc.',
      flow: {
        title: 'Bốn nấc kiểm chứng',
        steps: [
          { label: 'Tự kiểm tra', note: 'dặn tiêu chí ngay trong lời nhắn' },
          { label: 'Hỏi lại', note: '"Kiểm tra lại, đã xong hết chưa?"' },
          { label: '/goal', note: 'làm tiếp đến khi đạt điều kiện' },
          { label: 'Người soát thứ hai', note: 'subagent chưa tham gia làm' },
        ],
      },
      scenario: 'Claude báo đã chuyển xong module thanh toán sang API mới. Bạn hỏi thêm đúng một câu, "kiểm tra lại mọi chỗ gọi API cũ, đã xong hết chưa?", và Claude tìm ra hai chỗ gọi trong job chạy nền mà nó đã bỏ sót.',
      prompt: [
        {
          label: 'Nấc 1: tự kiểm tra trước khi báo xong',
          text: 'Trước khi báo xong, kiểm tra lại kết quả theo [tiêu chí]. Liệt kê những gì bạn đã kiểm tra kèm bằng chứng (lệnh đã chạy và kết quả), và những gì bạn chưa kiểm tra được.',
        },
        { label: 'Nấc 2: hỏi lại', text: 'Kiểm tra lại một lượt và xác nhận: việc này đã xong hết chưa? Chỗ nào chưa chắc thì nói rõ.' },
      ],
      tags: ['kiểm chứng', 'eval', 'test', 'review'],
      sources: [docs('best-practices', 'Best practices'), nhatAnh(14)],
    },
    {
      id: 'cho-claude-cach-tu-kiem-tra',
      topic: 'kiem-chung',
      level: 'co-ban',
      title: 'Cho Claude một cách để tự kiểm tra',
      summary: 'Claude làm tốt hơn hẳn khi có thể tự chạy thử và thấy kết quả.',
      why: 'Không có cách kiểm chứng, Claude chỉ có thể đoán code đã đúng. Có lệnh test, lệnh lint, hay ảnh mẫu để so, nó sẽ tự chạy, thấy lỗi và sửa tiếp trước khi báo cho bạn. Sau khi Claude báo xong, `/verify` còn cho nó build và chạy ứng dụng thật để xem kết quả, bắt những lỗi mà test và kiểm tra kiểu bỏ sót.',
      steps: [
        'Ghi lệnh test và lint vào `CLAUDE.md`.',
        'Trong yêu cầu, nói rõ phải chạy lệnh nào sau khi sửa.',
        'Với giao diện, đưa ảnh mẫu và nhờ Claude so với kết quả thật.',
        'Claude báo xong thì chạy `/verify` để kiểm tra trên ứng dụng đang chạy.',
      ],
      prompt: 'Sau mỗi thay đổi, chạy `npm run lint` và `npm test`. Nếu có lỗi thì tự sửa và chạy lại. Chỉ báo xong khi cả hai đều qua.',
      tags: ['test', 'kiểm chứng', 'lint', 'verify'],
      sources: [docs('best-practices', 'Best practices'), docs('skills', 'Skills')],
    },
    {
      id: 'dat-dieu-kien-bang-goal',
      topic: 'kiem-chung',
      level: 'nang-cao',
      title: 'Đặt điều kiện hoàn thành bằng /goal',
      summary: 'Mô tả kết quả cuối và cách chứng minh; Claude tự làm tiếp cho tới khi đạt.',
      why: [
        'Với việc lớn như chuyển một module sang API mới, Claude thường làm được một phần rồi báo xong. `/goal` đặt một điều kiện hoàn thành: sau mỗi lượt, một model khác đọc cuộc trò chuyện và chấm xem điều kiện đã đạt chưa. Chưa đạt thì Claude làm tiếp, đạt thì dừng.',
        'Model chấm không tự chạy lệnh hay đọc file; nó chỉ đọc những gì xuất hiện trong cuộc trò chuyện. Vì vậy điều kiện phải là thứ Claude chứng minh được bằng kết quả hiện ra, như output của lệnh test.',
      ],
      flow: {
        title: 'Một goal chạy như thế nào',
        steps: [
          { label: '/goal + điều kiện', note: 'bắt đầu lượt đầu tiên' },
          { label: 'Claude làm một lượt', note: 'chạy test, in bằng chứng' },
          { label: 'Model khác chấm', note: 'chưa đạt thì làm tiếp' },
          { label: 'Đạt điều kiện', note: 'goal tự kết thúc' },
        ],
      },
      cards: [
        { icon: 'check', title: 'Một trạng thái đo được', text: 'Test qua, build trả về 0, hàng đợi trống.' },
        { icon: 'terminal', title: 'Cách chứng minh', text: '"`npm test` thoát với mã 0", "`git status` sạch".' },
        { icon: 'lock', title: 'Ràng buộc', text: 'Những gì không được đổi, như "không sửa file test nào".' },
        { icon: 'alert', title: 'Giới hạn', text: 'Thêm "hoặc dừng sau 20 lượt" để goal không chạy mãi.' },
      ],
      commands: [
        { cmd: '/goal <điều kiện>', desc: 'Đặt điều kiện và bắt đầu làm ngay' },
        { cmd: '/goal', desc: 'Xem goal đang chạy: số lượt, token đã dùng, lý do lần chấm gần nhất' },
        { cmd: '/goal clear', desc: 'Huỷ goal đang chạy' },
      ],
      code: '/goal mọi test trong test/auth đều qua và npm run lint không còn lỗi; không sửa file test nào; sau mỗi lượt in kết quả test làm bằng chứng; hoặc dừng sau 20 lượt',
      note: 'Goal không đổi chế độ quyền. Muốn các lượt chạy mà không hỏi từng lệnh, hãy dùng auto mode; ở chế độ thủ công, Claude vẫn hỏi trước những lệnh chưa được cho phép.',
      tags: ['goal', 'kiểm chứng', 'tự động', 'test'],
      sources: [docs('goal', 'Keep Claude working toward a goal'), nhatAnh(13)],
    },
    {
      id: 'subagent-soat-lai',
      topic: 'kiem-chung',
      level: 'nang-cao',
      title: 'Nhờ một subagent chưa tham gia soát lại',
      summary: 'Người soát không viết code thì không bị cuốn theo giả định của người viết.',
      why: 'Claude vừa viết code dễ tin rằng code đó đúng, giống như ta tự review PR của chính mình. Một subagent có ngữ cảnh riêng, chưa tham gia làm, sẽ đọc kết quả với con mắt mới. Hai điều quan trọng: chỉ dùng cho việc đủ lớn, và nói rõ chỉ báo lỗi làm sai yêu cầu. Nếu chỉ bảo "tìm lỗi", nó luôn tìm ra thứ để chê và bạn sửa mãi không xong.',
      steps: [
        'Chuẩn bị spec hoặc tiêu chí rõ ràng, ví dụ `SPEC.md`.',
        'Gửi lời nhắn mẫu, nêu đúng phạm vi cần soát.',
        'Sửa những lỗi ảnh hưởng tới yêu cầu; góp ý tuỳ chọn để sau.',
      ],
      prompt: 'Dùng một subagent chưa tham gia việc này để soát diff hiện tại theo @SPEC.md. Kiểm tra từng yêu cầu đã được làm và đã có test chưa. Chỉ báo những lỗi làm sai yêu cầu hoặc làm hỏng hành vi; các góp ý khác ghi riêng ở mục tuỳ chọn.',
      tags: ['review', 'subagent', 'kiểm chứng', 'spec'],
      sources: [docs('best-practices', 'Best practices'), nhatAnh(14)],
    },
    {
      id: 'test-truoc-code-sau',
      topic: 'kiem-chung',
      level: 'nang-cao',
      title: 'Viết test trước, code sau',
      summary: 'Test đóng vai trò bản đặc tả mà Claude không thể "lách".',
      why: 'Khi test có trước, mục tiêu trở nên rõ ràng và kiểm chứng được. Điều quan trọng là tách thành hai bước: viết test và xác nhận chúng đang fail, rồi mới viết code. Dặn rõ Claude không được sửa test cho qua.',
      flow: {
        title: 'Hai bước tách biệt',
        steps: [
          { label: 'Viết test', note: 'chưa viết code' },
          { label: 'Xác nhận fail', note: 'fail đúng lý do' },
          { label: 'Commit test', note: 'khoá lại đặc tả' },
          { label: 'Viết code', note: 'đến khi test qua' },
        ],
      },
      prompt: 'Viết test cho hàm tinhPhiShip theo các trường hợp sau: [liệt kê]. Chưa viết code. Chạy test và cho mình xem chúng fail. Sau khi mình đồng ý, viết code cho test qua và không được sửa file test.',
      tags: ['test', 'TDD', 'kiểm chứng'],
      sources: [docs('best-practices', 'Best practices')],
    },

    /* ======================================================= Model và chi phí */
    {
      id: 'opus-ke-hoach-sonnet-lam',
      topic: 'model',
      level: 'nang-cao',
      title: 'Lên kế hoạch bằng Opus, thực thi bằng Sonnet',
      summary: 'Model mạnh cho phần cần nghĩ, model nhanh hơn cho phần làm theo kế hoạch.',
      why: [
        'Phần khó nhất của việc lớn là nghĩ đúng: chia bước, thứ tự, chỗ dễ vỡ. Phần đó đáng dùng model mạnh nhất. Còn làm theo một kế hoạch đã rõ thì model nhỏ hơn làm tốt, nhanh hơn và tốn ít hạn mức hơn.',
        'Tránh đổi model giữa một cuộc trò chuyện dài: mỗi model có bộ nhớ đệm (prompt cache) riêng, nên lượt ngay sau khi đổi phải xử lý lại toàn bộ cuộc trò chuyện. Lưu kế hoạch ra file rồi mở phiên mới với model kia sẽ gọn hơn. Muốn tự động, chọn `opusplan`: Opus khi ở plan mode, Sonnet khi thực thi.',
      ],
      flow: {
        title: 'Hai phiên, một file kế hoạch',
        steps: [
          { label: 'Phiên 1: Opus', note: 'plan mode, lên kế hoạch' },
          { label: 'PLAN.md', note: 'mỗi bước có điều kiện xong' },
          { label: 'Phiên 2: Sonnet', note: 'làm từng bước, đánh dấu' },
        ],
      },
      prompt: [
        {
          label: 'Phiên 1: lên kế hoạch thành file',
          text: 'Lên kế hoạch chi tiết cho [việc]. Chia thành các bước nhỏ; mỗi bước ghi rõ làm gì, sửa file nào, và thế nào là xong (kèm lệnh kiểm tra). Lưu vào PLAN.md để một phiên khác làm theo được.',
        },
        {
          label: 'Phiên 2: làm theo kế hoạch',
          text: 'Đọc @PLAN.md và làm lần lượt từng bước. Xong bước nào thì chạy kiểm tra của bước đó, đánh dấu [x] trong file, rồi mới sang bước tiếp theo.',
        },
      ],
      commands: [
        { cmd: '/model opus', desc: 'Chọn Opus cho phiên lên kế hoạch' },
        { cmd: '/model sonnet', desc: 'Chọn Sonnet cho phiên thực thi' },
        { cmd: '/model opusplan', desc: 'Tự dùng Opus trong plan mode và Sonnet khi thực thi' },
      ],
      tags: ['model', 'Opus', 'Sonnet', 'opusplan', 'kế hoạch', 'chi phí'],
      sources: [docs('model-config', 'Model configuration'), docs('prompt-caching', 'Prompt caching'), nhatAnh(11)],
    },
    {
      id: 'haiku-cho-subagent',
      topic: 'model',
      level: 'nang-cao',
      title: 'Cho subagent tìm kiếm dùng Haiku',
      summary: 'Việc đọc, tìm, tóm tắt không cần model mạnh nhất: Haiku nhanh hơn và rẻ hơn nhiều.',
      why: 'Subagent thường làm những việc nặng về đọc: lục codebase, đọc tài liệu dài, tóm tắt log. Nếu không chỉ định, subagent dùng cùng model với phiên chính, tức là tốn model mạnh cho việc không cần nhiều suy luận. Đặt `model: haiku` cho những subagent này, còn phiên chính giữ phần suy nghĩ và quyết định.',
      cards: [
        { icon: 'cpu', title: 'Phiên chính: Opus hoặc Sonnet', text: 'Suy nghĩ, lên kế hoạch, ra quyết định, ghép kết quả.' },
        { icon: 'layers', title: 'Subagent: Haiku', text: 'Đọc tài liệu dài, tìm trong codebase, tóm tắt và trả về kết luận.' },
      ],
      code: [
        {
          label: '.claude/agents/doc-tim.md',
          text: '---\nname: doc-tim\ndescription: Đọc, tìm kiếm và tóm tắt trong codebase hoặc tài liệu dài. Dùng khi cần lục nhiều file để trả lời một câu hỏi.\ntools: Read, Grep, Glob\nmodel: haiku\n---\n\nBạn chuyên tìm thông tin. Trả về kết luận ngắn gọn, kèm đường dẫn file và số dòng làm bằng chứng. Không sửa file.',
        },
        { label: 'Hoặc đặt cho mọi subagent bạn tạo', text: 'export CLAUDE_CODE_SUBAGENT_MODEL=haiku' },
      ],
      note: 'Biến `CLAUDE_CODE_SUBAGENT_MODEL` một mình không đổi model của subagent có sẵn là Explore và Plan. Muốn Explore dùng Haiku, tạo một subagent tên `Explore` với `model: haiku`.',
      tags: ['subagent', 'Haiku', 'model', 'chi phí'],
      sources: [docs('sub-agents', 'Subagents'), nhatAnh(12)],
    },

    /* ============================================================ Tự động hoá */
    {
      id: 'bien-prompt-thanh-lenh',
      topic: 'tu-dong-hoa',
      level: 'co-ban',
      title: 'Biến prompt hay dùng thành lệnh riêng',
      summary: 'Một file markdown trong .claude/commands/ là có ngay một lệnh /ten-lenh.',
      why: 'Nếu bạn gõ đi gõ lại cùng một yêu cầu, hãy lưu nó thành file. Tên file trở thành tên lệnh, và `$ARGUMENTS` được thay bằng phần bạn gõ sau lệnh. Đặt trong `.claude/commands/` của dự án để chia sẻ với cả nhóm qua git.',
      steps: [
        'Tạo thư mục `.claude/commands/` trong dự án.',
        'Tạo file, ví dụ `giai-thich.md`, chứa nội dung prompt.',
        'Gõ `/giai-thich src/utils/date.ts` để dùng.',
      ],
      code: 'Giải thích $ARGUMENTS cho người mới vào dự án:\n1. File này làm gì, trong một câu\n2. Các hàm chính và nơi gọi chúng\n3. Những chỗ dễ sửa nhầm',
      codeLabel: '.claude/commands/giai-thich.md',
      tags: ['slash command', 'lệnh', 'tự động'],
      sources: [docs('skills', 'Skills')],
    },
    {
      id: 'dong-goi-thanh-skill',
      topic: 'tu-dong-hoa',
      level: 'nang-cao',
      title: 'Đóng gói quy trình thành skill',
      summary: 'Skill là bộ hướng dẫn Claude tự lấy ra dùng khi gặp đúng loại việc.',
      why: 'Khác với lệnh phải tự gõ, skill có phần `description` để Claude nhận ra lúc nào nên dùng, và chỉ được nạp khi cần nên không chiếm ngữ cảnh thường trực. Mỗi skill là một thư mục chứa `SKILL.md`, có thể kèm script hay file mẫu. Hợp với quy trình lặp lại như viết release note hay làm báo cáo theo mẫu.',
      steps: [
        'Tạo thư mục `.claude/skills/<ten-skill>/`.',
        'Viết `SKILL.md`, phần đầu có `name` và `description`.',
        'Mô tả các bước bên dưới. Claude sẽ dùng skill khi yêu cầu khớp với description.',
      ],
      code:
        '---\nname: release-note\ndescription: Viết release note từ các commit kể từ tag gần nhất. Dùng khi được nhờ viết release note hoặc changelog.\n---\n\n1. Chạy git log từ tag gần nhất đến HEAD.\n2. Nhóm commit theo: Tính năng mới, Sửa lỗi, Khác.\n3. Viết bằng tiếng Việt, mỗi mục một dòng, bỏ qua commit chỉ sửa format.',
      codeLabel: '.claude/skills/release-note/SKILL.md',
      tags: ['skill', 'tự động'],
      sources: [docs('skills', 'Skills')],
    },
    {
      id: 'giao-viec-cho-subagent',
      topic: 'tu-dong-hoa',
      level: 'nang-cao',
      title: 'Giao việc tìm kiếm cho subagent',
      summary: 'Subagent làm việc trong ngữ cảnh riêng và chỉ gửi về kết luận.',
      why: 'Tìm hiểu một codebase lớn đòi hỏi đọc rất nhiều file, và tất cả sẽ lấp đầy ngữ cảnh chính. Subagent chạy trong ngữ cảnh riêng, đọc bao nhiêu tuỳ ý, rồi chỉ trả về bản tóm tắt. Bạn có thể nhờ Claude dùng subagent, hoặc tạo subagent riêng bằng `/agents`.',
      steps: [
        'Với việc cần đọc nhiều, nói rõ "dùng subagent".',
        'Muốn có subagent chuyên trách, như một người review code, chạy `/agents` để tạo.',
        'Subagent của dự án nằm trong `.claude/agents/`; commit để cả nhóm dùng.',
      ],
      prompt: 'Dùng subagent để tìm tất cả những chỗ đang gọi API thanh toán cũ. Chỉ trả về danh sách file, số dòng, và một câu mô tả cho mỗi chỗ.',
      tags: ['subagent', 'ngữ cảnh', 'agents', 'chạy song song'],
      sources: [docs('sub-agents', 'Subagents')],
    },
    {
      id: 'hook-tu-format',
      topic: 'tu-dong-hoa',
      level: 'nang-cao',
      title: 'Dùng hook để tự format sau mỗi lần sửa',
      summary: 'Hook là lệnh luôn chạy, không phụ thuộc Claude có nhớ hay không.',
      why: 'Ghi "nhớ chạy prettier" vào `CLAUDE.md` thì Claude vẫn có thể quên. Hook thì luôn chạy: ví dụ sau mỗi lần Claude sửa hoặc tạo file, chạy formatter trên đúng file đó. Thông tin về lần sửa được gửi vào hook dưới dạng JSON qua stdin.',
      flow: {
        title: 'Hook chạy ở đâu',
        steps: [
          { label: 'Claude sửa file', note: 'công cụ Edit hoặc Write' },
          { label: 'PostToolUse', note: 'hook khớp matcher Edit|Write' },
          { label: 'Prettier chạy', note: 'trên đúng file vừa sửa' },
        ],
      },
      steps: [
        'Cài `jq` nếu máy chưa có, để đọc JSON.',
        'Thêm hook `PostToolUse` với matcher `Edit|Write` vào `.claude/settings.json`.',
        'Nhờ Claude sửa thử một file và kiểm tra file đã được format.',
      ],
      code: String.raw`{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "f=$(jq -r '.tool_input.file_path') && npx prettier --write --ignore-unknown \"$f\""
          }
        ]
      }
    ]
  }
}`,
      codeLabel: '.claude/settings.json',
      tags: ['hook', 'format', 'settings', 'prettier'],
      sources: [docs('hooks-guide', 'Hooks guide')],
    },
    {
      id: 'goi-claude-tu-script',
      topic: 'tu-dong-hoa',
      level: 'nang-cao',
      title: 'Gọi Claude từ script với -p',
      summary: 'Chế độ không tương tác: đưa đầu vào, nhận kết quả, thoát.',
      why: '`claude -p "yêu cầu"` chạy một lần rồi in kết quả ra, không mở giao diện chat. Bạn có thể nối nó với lệnh khác bằng pipe, dùng trong script hay CI. Thêm `--output-format json` khi cần xử lý kết quả bằng code.',
      steps: ['Thử một lệnh đơn giản với `-p`.', 'Nối đầu vào bằng pipe, ví dụ log lỗi.', 'Đưa vào script khi đã chạy ổn.'],
      code: 'cat error.log | claude -p "Tóm tắt nguyên nhân lỗi trong 3 dòng"\n\ngit diff main --name-only | claude -p "Những file này có cần cập nhật tài liệu không?"',
      tags: ['headless', 'script', 'CI', 'pipe'],
      sources: [docs('headless', 'Run Claude Code programmatically')],
    },
    {
      id: 'chay-tren-may-chu',
      topic: 'tu-dong-hoa',
      level: 'nang-cao',
      title: 'Chạy Claude Code trên máy chủ, theo dõi từ điện thoại',
      summary: 'Gập laptop thì việc dài vẫn chạy; giao việc và xem tiến độ qua Remote Control.',
      why: 'Laptop gập lại thì phiên Claude Code cũng dừng. Đặt Claude Code trên một máy luôn bật (VPS hoặc máy dev từ xa), chạy trong `tmux` để không tắt khi mất kết nối SSH, rồi bật Remote Control để xem và nhắn tiếp phiên đó từ app Claude trên điện thoại hoặc trình duyệt.',
      flow: {
        title: 'Máy chủ làm, bạn theo dõi từ xa',
        steps: [
          { label: 'Máy chủ', note: 'Claude Code chạy trong tmux' },
          { label: 'Remote Control', note: 'claude rc hoặc /remote-control' },
          { label: 'Điện thoại', note: 'giao việc, xem kết quả' },
        ],
      },
      steps: [
        'Cài Claude Code trên máy chủ và đăng nhập bằng `/login`.',
        'Mở một phiên `tmux` để phiên không tắt khi bạn ngắt SSH.',
        'Chạy `claude remote-control` trong thư mục dự án, rồi mở phiên từ app Claude.',
        'Giao việc dài, gập laptop, theo dõi từ điện thoại.',
      ],
      code: '# Trên máy chủ\ntmux new -s claude\ncd ~/du-an\nclaude remote-control      # hoặc: claude rc\n\n# Rời phiên tmux mà vẫn giữ nó chạy: Ctrl+B rồi D\n# Quay lại sau: tmux attach -t claude',
      commands: [{ cmd: '/remote-control', desc: 'Bật Remote Control cho phiên đang mở' }],
      note: 'Remote Control cần đăng nhập bằng tài khoản Claude.ai. Trên máy chủ, cấp cho Claude ít quyền nhất có thể: không dùng tài khoản root, không đặt khoá production, và không bật chế độ bỏ qua hỏi quyền.',
      tags: ['máy chủ', 'VPS', 'remote control', 'tmux', 'chạy nền'],
      sources: [docs('remote-control', 'Remote Control'), nhatAnh(15)],
    },

    /* ===================================================== Kết nối và an toàn */
    {
      id: 'ket-noi-mcp',
      topic: 'an-toan',
      level: 'nang-cao',
      title: 'Kết nối công cụ ngoài qua MCP',
      summary: 'Cho Claude đọc issue, tài liệu hay cơ sở dữ liệu ngay trong phiên.',
      why: 'MCP là chuẩn để nối Claude với dịch vụ bên ngoài như hệ thống quản lý công việc, tài liệu nội bộ hay trình duyệt. Thêm server bằng `claude mcp add`, kiểm tra và đăng nhập bằng `/mcp`. Mỗi server thêm công cụ vào ngữ cảnh, nên chỉ bật cái bạn thật sự dùng.',
      steps: [
        'Lấy địa chỉ MCP server từ tài liệu của dịch vụ.',
        'Chạy `claude mcp add` như ví dụ.',
        'Trong phiên, gõ `/mcp` để xem trạng thái và đăng nhập nếu cần.',
      ],
      code: '# Server từ xa qua HTTP\nclaude mcp add --transport http ten-server https://example.com/mcp\n\n# Server chạy trên máy\nclaude mcp add ten-server -- npx -y ten-goi-mcp\n\nclaude mcp list',
      tags: ['MCP', 'kết nối', 'công cụ'],
      sources: [docs('mcp', 'MCP')],
    },
    {
      id: 'cho-phep-lenh-an-toan',
      topic: 'an-toan',
      level: 'co-ban',
      title: 'Cho phép sẵn những lệnh an toàn',
      summary: 'Bớt bị hỏi lại với những lệnh mà đằng nào bạn cũng đồng ý.',
      why: 'Mặc định, Claude hỏi trước khi chạy lệnh hay sửa file. Với lệnh vô hại và hay dùng như chạy test hay xem git, bạn có thể cho phép sẵn bằng `/permissions` hoặc mục `allow` trong settings. Dấu `*` khớp với mọi thứ theo sau, nên `Bash(git diff *)` cho phép mọi lệnh bắt đầu bằng `git diff`.',
      steps: [
        'Gõ `/permissions` để xem và sửa quy tắc.',
        'Hoặc thêm vào `.claude/settings.json` như ví dụ.',
        'Chỉ cho phép lệnh chỉ đọc hoặc dễ hoàn tác.',
      ],
      code: '{\n  "permissions": {\n    "allow": [\n      "Bash(npm run test *)",\n      "Bash(npm run lint)",\n      "Bash(git status)",\n      "Bash(git diff *)"\n    ]\n  }\n}',
      codeLabel: '.claude/settings.json',
      tags: ['quyền', 'permissions', 'settings'],
      sources: [docs('permissions', 'Permissions')],
    },
    {
      id: 'chan-doc-file-bi-mat',
      topic: 'an-toan',
      level: 'co-ban',
      title: 'Chặn Claude đọc file bí mật',
      summary: 'Thêm quy tắc deny cho .env và thư mục chứa khoá.',
      why: 'Claude chỉ đọc file khi cần, nhưng "khi cần" có thể bao gồm `.env` lúc đang gỡ lỗi kết nối. Quy tắc `deny` trong settings chặn hẳn việc đọc những file này. Đặt trong settings của dự án để áp dụng cho cả nhóm.',
      steps: [
        'Mở `.claude/settings.json`.',
        'Thêm các mẫu đường dẫn cần chặn vào `deny`.',
        'Thử nhờ Claude đọc `.env`: yêu cầu phải bị từ chối.',
      ],
      code: '{\n  "permissions": {\n    "deny": [\n      "Read(./.env)",\n      "Read(./.env.*)",\n      "Read(./secrets/**)"\n    ]\n  }\n}',
      codeLabel: '.claude/settings.json',
      tags: ['bảo mật', 'quyền', '.env'],
      sources: [docs('permissions', 'Permissions')],
    },
    {
      id: 'khong-bo-qua-hoi-quyen',
      topic: 'an-toan',
      level: 'co-ban',
      title: 'Không bỏ qua hỏi quyền trên máy thật',
      summary: 'Chế độ bỏ qua mọi xác nhận chỉ dành cho môi trường cách ly.',
      why: 'Cờ `--dangerously-skip-permissions` cho Claude chạy mọi lệnh mà không hỏi. Tiện, nhưng một lệnh sai, hay một chỉ dẫn độc hại giấu trong file Claude đọc vào, cũng sẽ được chạy luôn. Nếu cần chạy dài không giám sát, hãy dùng container hoặc máy ảo không chứa dữ liệu thật và khoá bí mật.',
      compare: {
        before: 'Bật bỏ qua hỏi quyền trên laptop làm việc cho đỡ phiền.',
        after: 'Cho phép sẵn từng lệnh an toàn; chỉ chạy không giám sát trong container cách ly.',
      },
      steps: [
        'Trên máy làm việc hằng ngày, giữ chế độ mặc định và cho phép sẵn từng lệnh an toàn.',
        'Muốn bớt hỏi khi sửa file, chuyển sang chế độ tự chấp nhận sửa file bằng `Shift+Tab`, thay vì bỏ qua tất cả.',
        'Chỉ dùng cờ bỏ qua quyền trong container hoặc máy ảo cách ly.',
      ],
      tags: ['bảo mật', 'quyền', 'chế độ'],
      sources: [docs('permission-modes', 'Permission modes')],
    },
  ];

  return { site, topics, tips };
})();
