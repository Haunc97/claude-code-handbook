/*
 * Sổ tay Claude Code: hiển thị, tìm kiếm, lọc và trang đọc mẹo.
 * Nội dung nằm trong data/tips.js; file này không cần sửa khi thêm mẹo.
 */
(() => {
  'use strict';

  const { site, topics, tips } = window.SOTAY;
  const LEVELS = { 'co-ban': 'Cơ bản', 'nang-cao': 'Nâng cao' };
  const topicById = Object.fromEntries(topics.map((t) => [t.id, t]));

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const motionOK = () => !matchMedia('(prefers-reduced-motion: reduce)').matches;
  const asList = (v) => (v == null ? [] : [].concat(v));

  // `prompt` và `code` nhận chuỗi hoặc mảng { label, text }; đưa về một dạng.
  const asItems = (v, label = '') => (v == null ? [] : Array.isArray(v) ? v : [{ label, text: v }]);

  const el = {
    q: $('#q'),
    clear: $('.ask-clear'),
    topics: $('#topics'),
    levels: $('#levels'),
    status: $('#status'),
    list: $('#list'),
    resultsBar: $('.results-bar'),
    reader: $('#reader'),
    sheet: $('.sheet'),
    readerBody: $('#reader-body'),
  };

  /* ------------------------------------------------------------- Icon */

  const ICONS = {
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    terminal: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 9 3 3-3 3M12.5 15H17"/>',
    message: '<path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-5 3.5V17H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/><path d="M8 10h8M8 13h5"/>',
    book: '<path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v15H7.5A2.5 2.5 0 0 0 5 20.5z"/><path d="M5 20.5A2.5 2.5 0 0 1 7.5 18H19v3H7.5M9 7.5h6"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 12.5 9 5 9-5"/><path d="m3 17 9 5 9-5" opacity=".55"/>',
    route: '<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5"/>',
    check: '<path d="M12 3 5 6v5.5c0 4.3 2.9 8 7 9.5 4.1-1.5 7-5.2 7-9.5V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
    cpu: '<rect x="6" y="6" width="12" height="12" rx="2.5"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M10 2.5V6M14 2.5V6M10 18v3.5M14 18v3.5M2.5 10H6M2.5 14H6M18 10h3.5M18 14h3.5"/>',
    bolt: '<path d="M13 2.5 4.5 13.5H11l-1 8 8.5-11H12z"/>',
    lock: '<rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3M12 14.5v2"/>',
    bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3Z"/>',
    alert: '<path d="M10.3 4.3 2.8 17.5A2 2 0 0 0 4.5 20.5h15a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z"/><path d="M12 9.5v4M12 17h.01"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    tick: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    replay: '<path d="M4 12a8 8 0 1 0 2.3-5.6"/><path d="M4 4v4.5h4.5"/>',
  };

  const icon = (name, cls = 'ico') =>
    ICONS[name]
      ? `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`
      : '';

  /* ------------------------------------------------------------- Chữ */

  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

  // Bỏ dấu tiếng Việt để "bo nho" vẫn tìm ra "bộ nhớ".
  const fold = (s) =>
    String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd').toLowerCase();

  // Tô dạ quang những đoạn khớp từ khoá, giữ nguyên chữ có dấu gốc.
  function highlight(text, terms) {
    text = String(text);
    if (!terms.length) return esc(text);

    let folded = '';
    const map = []; // vị trí trong chuỗi bỏ dấu -> vị trí trong chuỗi gốc
    for (let i = 0; i < text.length; i++) {
      for (const c of fold(text[i])) {
        folded += c;
        map.push(i);
      }
    }

    const ranges = [];
    for (const term of terms) {
      let from = 0;
      let at;
      while ((at = folded.indexOf(term, from)) !== -1) {
        ranges.push([map[at], map[at + term.length - 1] + 1]);
        from = at + term.length;
      }
    }
    if (!ranges.length) return esc(text);

    ranges.sort((a, b) => a[0] - b[0]);
    const merged = [];
    for (const r of ranges) {
      const last = merged[merged.length - 1];
      if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
      else merged.push([...r]);
    }

    let out = '';
    let pos = 0;
    for (const [a, b] of merged) {
      out += esc(text.slice(pos, a)) + '<mark>' + esc(text.slice(a, b)) + '</mark>';
      pos = b;
    }
    return out + esc(text.slice(pos));
  }

  // `chữ trong backtick` thành <code>, có tô từ khoá nếu cần.
  const rich = (text, terms = []) =>
    String(text)
      .split('`')
      .map((part, i) => (i % 2 ? `<code>${highlight(part, terms)}</code>` : highlight(part, terms)))
      .join('');

  const fmtDate = (iso) => iso.split('-').reverse().join('/');

  /* ------------------------------------------------------- Tìm và lọc */

  // Gom mọi chữ của một mẹo (kể cả sơ đồ, thẻ, lệnh, nguồn) để tìm kiếm.
  const tipText = (t) =>
    [
      t.title,
      t.summary,
      topicById[t.topic]?.name,
      ...asList(t.tags),
      ...asList(t.why),
      ...asList(t.steps),
      t.scenario,
      t.note,
      t.compare?.before,
      t.compare?.after,
      t.flow?.title,
      ...asList(t.flow?.steps).flatMap((s) => [s.label, s.note]),
      ...asList(t.cards).flatMap((c) => [c.title, c.text]),
      ...asList(t.commands).flatMap((c) => [c.cmd, c.desc]),
      ...asItems(t.prompt).flatMap((p) => [p.label, p.text]),
      ...asItems(t.code, t.codeLabel).flatMap((c) => [c.label, c.text]),
      ...asList(t.sources).map((s) => s.label),
    ]
      .filter(Boolean)
      .join(' ');

  const index = new Map(tips.map((t) => [t.id, fold(tipText(t))]));

  // Thứ tự hiển thị: theo thứ tự chủ đề, trong mỗi chủ đề theo thứ tự trong file dữ liệu.
  const ordered = topics.flatMap((tp) => tips.filter((t) => t.topic === tp.id));

  const state = { q: '', topic: 'all', level: 'all' };
  let shown = ordered; // các mẹo đang hiện, dùng cho nút mẹo trước / mẹo sau

  const terms = () => fold(state.q).split(/\s+/).filter(Boolean);

  function filterTips({ ignoreTopic = false } = {}) {
    const ts = terms();
    return ordered.filter(
      (t) =>
        (ignoreTopic || state.topic === 'all' || t.topic === state.topic) &&
        (state.level === 'all' || t.level === state.level) &&
        ts.every((term) => index.get(t.id).includes(term))
    );
  }

  /* ---------------------------------------------------------- Vẽ trang */

  function fillSiteText() {
    $$('[data-site]').forEach((n) => (n.textContent = site[n.dataset.site]));
    $('#docs-link').href = site.docsUrl;
    $('#hero-meta').textContent = `${tips.length} mẹo trong ${topics.length} chủ đề. Cập nhật ngày ${fmtDate(site.updated)}.`;
    const credit = site.credit
      ? `<p>${esc(site.credit.text)} (<a href="${esc(site.credit.url)}" target="_blank" rel="noopener">xem bài gốc</a>); mỗi mẹo đều ghi nguồn ở cuối.</p>`
      : '';
    $('#footer').innerHTML = `
      <p>${esc(site.name)}, viết và cập nhật bởi ${esc(site.author)}.</p>
      ${credit}
      <p>Đây là trang cá nhân, không phải tài liệu của Anthropic. Claude Code thay đổi khá nhanh; nếu một mẹo không còn đúng,
      hãy đối chiếu với <a href="${esc(site.docsUrl)}" target="_blank" rel="noopener">tài liệu chính thức</a>.</p>`;
  }

  function buildTopics() {
    const items = [{ id: 'all', name: 'Tất cả', icon: 'grid' }, ...topics];
    el.topics.innerHTML = items
      .map(
        (t) => `<button class="topic" type="button" data-topic="${t.id}" aria-pressed="false">
          <span class="topic-name">${icon(t.icon, 'topic-icon')}${esc(t.name)}</span>
          <span class="topic-count"><span class="n"></span><span class="sr-only"> mẹo</span></span>
        </button>`
      )
      .join('');
  }

  // Cập nhật số đếm và trạng thái nút tại chỗ, để nét dạ quang có thể chuyển động.
  function syncControls() {
    const base = filterTips({ ignoreTopic: true });
    const counts = { all: base.length };
    base.forEach((t) => (counts[t.topic] = (counts[t.topic] || 0) + 1));

    $$('.topic', el.topics).forEach((b) => {
      const n = counts[b.dataset.topic] || 0;
      b.setAttribute('aria-pressed', String(b.dataset.topic === state.topic));
      b.classList.toggle('is-empty', n === 0);
      $('.n', b).textContent = n;
    });
    $$('[data-level]', el.levels).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.level === state.level)));
    el.clear.hidden = !state.q;
  }

  const levelBadge = (lv) =>
    `<span class="level" data-level="${lv}"><span class="level-bars" aria-hidden="true"><i></i><i></i></span>${LEVELS[lv]}</span>`;

  const tipRow = (t, ts) => `
    <li><a class="tip" href="#${t.id}" style="view-transition-name: t-${t.id}">
      <span class="tip-title">${rich(t.title, ts)}</span>
      <span class="tip-summary">${rich(t.summary, ts)}</span>
      ${levelBadge(t.level)}
    </a></li>`;

  function statusHTML(n) {
    const parts = [];
    if (state.q) parts.push(`khớp với “${esc(state.q)}”`);
    if (state.topic !== 'all') parts.push(`trong chủ đề ${esc(topicById[state.topic].name)}`);
    if (state.level !== 'all') parts.push(`ở mức ${LEVELS[state.level].toLowerCase()}`);
    if (!parts.length) return `${n} mẹo`;
    return `${n} mẹo ${parts.join(', ')}. <button class="link-btn" type="button" data-action="reset">Xoá bộ lọc</button>`;
  }

  const emptyHTML = () => `
    <div class="empty">
      <p class="empty-title">Chưa có mẹo nào ${state.q ? `khớp với “${esc(state.q)}”` : 'trong bộ lọc này'}.</p>
      <p>Thử một từ khoá ngắn hơn, hoặc bỏ bớt bộ lọc chủ đề và mức độ. Gõ có dấu hay không dấu đều được.</p>
      <button class="btn" type="button" data-action="reset">Xoá bộ lọc</button>
    </div>`;

  function renderList() {
    const ts = terms();
    const visible = filterTips();
    const groups = topics
      .map((tp) => ({ tp, items: visible.filter((t) => t.topic === tp.id) }))
      .filter((g) => g.items.length);
    shown = groups.flatMap((g) => g.items);

    el.list.innerHTML = groups.length
      ? groups
          .map(
            ({ tp, items }) => `
        <section class="group" aria-labelledby="g-${tp.id}" style="view-transition-name: g-${tp.id}">
          <header class="group-head">
            <span class="group-icon">${icon(tp.icon)}</span>
            <h2 id="g-${tp.id}">${esc(tp.name)}</h2>
            <p class="group-count">${items.length} mẹo</p>
            <p class="group-desc">${esc(tp.desc)}</p>
          </header>
          <ul class="tips">${items.map((t) => tipRow(t, ts)).join('')}</ul>
        </section>`
          )
          .join('')
      : emptyHTML();

    el.status.innerHTML = statusHTML(shown.length);
    syncControls();
    syncURL();
  }

  // Chạy thay đổi kèm hiệu ứng chuyển cảnh nếu trình duyệt hỗ trợ.
  // Bấm liên tục sẽ bỏ qua hiệu ứng cũ; lỗi AbortError lúc đó là bình thường nên bỏ qua.
  function withTransition(fn) {
    if (!document.startViewTransition || !motionOK()) return fn();
    document.startViewTransition(fn).ready.catch(() => {});
  }

  // Lọc theo chủ đề hoặc mức độ có hiệu ứng chuyển cảnh; gõ tìm kiếm thì cập nhật tức thì.
  function update({ animate = false } = {}) {
    if (animate) withTransition(renderList);
    else renderList();
  }

  function setFilters(next, opts) {
    Object.assign(state, next);
    el.q.value = state.q;
    update(opts);
  }

  function scrollToList() {
    const top = el.resultsBar.getBoundingClientRect().top;
    if (top < 0 || top > innerHeight * 0.6) {
      el.resultsBar.scrollIntoView({ behavior: motionOK() ? 'smooth' : 'auto', block: 'start' });
    }
  }

  /* ------------------------------------------------------ Địa chỉ trang */

  function syncURL() {
    const p = new URLSearchParams();
    if (state.q) p.set('q', state.q);
    if (state.topic !== 'all') p.set('chu-de', state.topic);
    if (state.level !== 'all') p.set('muc-do', state.level);
    const qs = p.toString();
    const url = location.pathname + (qs ? `?${qs}` : '') + location.hash;
    if (url === location.pathname + location.search + location.hash) return;
    try {
      history.replaceState(history.state, '', url);
    } catch {
      /* Một số trình duyệt chặn đổi địa chỉ khi mở file trực tiếp; bỏ qua. */
    }
  }

  function readURL() {
    const p = new URLSearchParams(location.search);
    state.q = p.get('q') || '';
    state.topic = topicById[p.get('chu-de')] ? p.get('chu-de') : 'all';
    state.level = LEVELS[p.get('muc-do')] ? p.get('muc-do') : 'all';
    el.q.value = state.q;
  }

  /* ------------------------------------------------- Các khối trong trang đọc */

  const section = (title, body, cls = '') => `<section class="r-sec ${cls}"><h3>${title}</h3>${body}</section>`;

  function snippet(item, { prompt = false } = {}) {
    const text = item.text;
    const typed = !prompt && /^[/!]/.test(text); // lệnh gõ trong ô nhập của Claude Code
    const hasBlanks = prompt && /\[[^\]\n]{2,}\]/.test(text);
    const title = item.label || (prompt ? 'Chép và dán vào Claude Code' : typed ? 'Gõ trong Claude Code' : 'Terminal');
    const hint = hasBlanks ? '<span class="snippet-hint">Sửa phần trong ngoặc vuông</span>' : '';
    const body = prompt ? esc(text).replace(/\[([^\]\n]{2,})\]/g, '<span class="fill">[$1]</span>') : esc(text);
    // Lời nhắn và lệnh gõ trong Claude Code thì xuống dòng; code và file mẫu thì giữ nguyên dòng.
    return `
      <div class="snippet${prompt || typed ? ' snippet--wrap' : ''}${prompt ? ' snippet--prompt' : ''}">
        <div class="snippet-head">
          <span class="snippet-title">${esc(title)}${hint}</span>
          <button class="copy-btn" type="button" data-action="copy">Chép</button>
        </div>
        <pre><code>${body}</code></pre>
      </div>`;
  }

  const snippets = (items, opts) => `<div class="snippets">${items.map((it) => snippet(it, opts)).join('')}</div>`;

  const flowHTML = (flow) => `
    <figure class="flow">
      <div class="flow-head">
        <figcaption>${esc(flow.title || 'Sơ đồ')}</figcaption>
        <button class="flow-replay" type="button" data-action="replay">${icon('replay')}Chạy lại</button>
      </div>
      <ol class="flow-steps">
        ${flow.steps
          .map(
            (s, i) => `<li class="flow-step" style="--i: ${i}">
              <span class="flow-dot">${i + 1}</span>
              <span class="flow-label">${rich(s.label)}</span>
              ${s.note ? `<span class="flow-note">${rich(s.note)}</span>` : ''}
            </li>`
          )
          .join('')}
      </ol>
    </figure>`;

  const cardsHTML = (cards) => `
    <div class="cards" data-n="${cards.length}">
      ${cards
        .map(
          (c) => `<div class="mini-card">
            ${c.icon ? `<span class="mini-card-icon">${icon(c.icon)}</span>` : ''}
            <p class="mini-card-title">${rich(c.title)}</p>
            <p class="mini-card-text">${rich(c.text)}</p>
          </div>`
        )
        .join('')}
    </div>`;

  const callout = (kind, iconName, title, text) => `
    <aside class="callout callout--${kind}">
      <span class="callout-icon">${icon(iconName)}</span>
      <div><p class="callout-title">${title}</p><p>${rich(text)}</p></div>
    </aside>`;

  const compareHTML = (c) => `
    <div class="compare">
      <div class="compare-card compare-card--before">
        <p class="compare-label">${icon('x')}Thay vì</p>
        <p>${rich(c.before)}</p>
      </div>
      <div class="compare-card compare-card--after">
        <p class="compare-label">${icon('tick')}Nên</p>
        <p>${rich(c.after)}</p>
      </div>
    </div>`;

  const commandsHTML = (cmds) => `
    <div class="cmds">
      ${cmds
        .map(
          (c) => `<div class="cmd">
            <code class="cmd-code">${esc(c.cmd)}</code>
            <span class="cmd-desc">${rich(c.desc)}</span>
            <button class="copy-btn copy-btn--quiet" type="button" data-action="copy" data-text="${esc(c.cmd)}">Chép</button>
          </div>`
        )
        .join('')}
    </div>`;

  const sourcesHTML = (sources) => `
    <ul class="sources">
      ${sources
        .map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${icon('link')}<span>${esc(s.label)}</span></a></li>`)
        .join('')}
    </ul>`;

  const pagerLink = (t, dir) => `
    <a class="pager-link pager-${dir}" href="#${t.id}" data-action="goto" data-id="${t.id}">
      <span class="pager-label">${dir === 'prev' ? 'Mẹo trước' : 'Mẹo sau'}</span>
      <span class="pager-title">${rich(t.title)}</span>
    </a>`;

  // Mẹo trước/sau đi theo danh sách đang lọc; nếu mẹo không nằm trong đó thì theo toàn bộ.
  const sequenceFor = (tip) => (shown.includes(tip) ? shown : ordered);

  function readerHTML(t) {
    const tp = topicById[t.topic];
    const seq = sequenceFor(t);
    const i = seq.indexOf(t);
    const prev = seq[i - 1];
    const next = seq[i + 1];
    const prompts = asItems(t.prompt);
    const codes = asItems(t.code, t.codeLabel);

    return `
      <p class="r-meta">
        <button class="r-topic" type="button" data-action="topic" data-topic="${tp.id}">${icon(tp.icon)}${esc(tp.name)}</button>
        ${levelBadge(t.level)}
      </p>
      <h2 class="r-title" id="reader-title">${rich(t.title)}</h2>
      <p class="r-summary">${rich(t.summary)}</p>
      ${t.why ? section('Vì sao', asList(t.why).map((p) => `<p>${rich(p)}</p>`).join('')) : ''}
      ${t.flow ? `<div class="r-sec">${flowHTML(t.flow)}</div>` : ''}
      ${t.cards?.length ? `<div class="r-sec">${cardsHTML(t.cards)}</div>` : ''}
      ${t.scenario ? `<div class="r-sec">${callout('scenario', 'bulb', 'Tình huống áp dụng', t.scenario)}</div>` : ''}
      ${t.compare ? section('So sánh', compareHTML(t.compare)) : ''}
      ${t.steps?.length ? section('Cách làm', `<ol class="r-steps">${t.steps.map((s) => `<li>${rich(s)}</li>`).join('')}</ol>`) : ''}
      ${prompts.length ? section('Lời nhắn mẫu', snippets(prompts, { prompt: true })) : ''}
      ${t.commands?.length ? section('Lệnh', commandsHTML(t.commands)) : ''}
      ${codes.length ? section(codes.some((c) => c.label) ? 'Ví dụ' : 'Lệnh mẫu', snippets(codes)) : ''}
      ${t.note ? `<div class="r-sec">${callout('note', 'alert', 'Lưu ý', t.note)}</div>` : ''}
      ${
        t.tags?.length
          ? `<div class="r-tags"><span class="r-tags-label">Từ khoá</span>${t.tags
              .map((tag) => `<button class="tag" type="button" data-action="tag" data-tag="${esc(tag)}">${esc(tag)}</button>`)
              .join('')}</div>`
          : ''
      }
      ${t.sources?.length ? section('Nguồn tham khảo', sourcesHTML(t.sources), 'r-sources') : ''}
      <nav class="pager" aria-label="Chuyển mẹo">
        ${prev ? pagerLink(prev, 'prev') : '<span></span>'}
        ${next ? pagerLink(next, 'next') : ''}
      </nav>`;
  }

  /* ---------------------------------------------------------- Trang đọc */

  let openedFromList = false; // mở bằng cách bấm trong trang, nên đóng bằng history.back()
  let afterClose = null;

  const tipFromHash = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    return tips.find((t) => t.id === id);
  };

  // Sơ đồ chỉ chạy hiệu ứng khi cuộn tới, để người đọc kịp thấy.
  const flowObserver =
    'IntersectionObserver' in window
      ? new IntersectionObserver(
          (entries) =>
            entries.forEach((e) => {
              if (e.isIntersecting) {
                e.target.classList.add('is-visible');
                flowObserver.unobserve(e.target);
              }
            }),
          { root: el.sheet, threshold: 0.35 }
        )
      : null;

  function watchFlows() {
    const flows = $$('.flow', el.readerBody);
    if (!flowObserver) return flows.forEach((f) => f.classList.add('is-visible'));
    flowObserver.disconnect();
    flows.forEach((f) => flowObserver.observe(f));
  }

  function replayFlow(fig) {
    fig.classList.remove('is-visible');
    void fig.offsetWidth; // buộc trình duyệt vẽ lại để hiệu ứng chạy từ đầu
    fig.classList.add('is-visible');
  }

  const isOpen = () => el.reader.classList.contains('is-open');

  // Gọi cb khi panel trượt xong; có thời gian dự phòng phòng khi không có transition nào chạy.
  function whenSheetSettles(cb, fallbackMs) {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      el.sheet.removeEventListener('transitionend', onEnd);
      cb();
    };
    const onEnd = (e) => {
      if (e.target === el.sheet && e.propertyName === 'transform') finish();
    };
    el.sheet.addEventListener('transitionend', onEnd);
    const timer = setTimeout(finish, motionOK() ? fallbackMs : 0);
  }

  // Mở theo hai nhịp để chuyển động không bị khựng:
  // nhịp 1 (khung hình này) dựng nội dung, khoá cuộn trang, tính layout khi panel còn ở ngoài màn hình;
  // nhịp 2 (hai khung hình sau) mới thêm .is-open để panel trượt vào trên một khung hình đã sẵn sàng.
  function openPanel() {
    if (!el.reader.open) {
      el.reader.showModal();
      el.sheet.focus({ preventScroll: true }); // để phím cuộn và Tab bắt đầu từ trang đọc
    }
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        el.reader.classList.add('is-open');
        // Sơ đồ chờ panel dừng hẳn mới chạy hiệu ứng, để mỗi lúc chỉ có một chuyển động.
        whenSheetSettles(() => isOpen() && watchFlows(), 520);
      })
    );
  }

  // Đóng: trượt ra trước, đóng dialog sau khi chuyển động xong, rồi mới chạy việc tiếp theo
  // (như lọc lại danh sách) để không tính layout giữa lúc đang trượt.
  function closePanel(then) {
    if (!el.reader.open) return then?.();
    el.reader.classList.remove('is-open');
    whenSheetSettles(() => {
      if (isOpen()) return; // người dùng mở mẹo khác trong lúc đang đóng
      if (el.reader.open) el.reader.close();
      then?.();
    }, 300);
  }

  function showTip(tip) {
    el.readerBody.innerHTML = readerHTML(tip);
    el.readerBody.dataset.id = tip.id;
    document.title = `${tip.title} | ${site.name}`;
    el.sheet.scrollTop = 0;

    if (!isOpen()) return openPanel();

    // Panel đã mở: chỉ đổi nội dung bên trong.
    if (motionOK()) {
      el.readerBody.animate(
        [
          { opacity: 0, transform: 'translateY(10px)' },
          { opacity: 1, transform: 'none' },
        ],
        { duration: 280, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
      );
    }
    watchFlows();
  }

  function hideReader() {
    flowObserver?.disconnect();
    document.title = site.name;
    openedFromList = false;
    const run = afterClose;
    afterClose = null;
    closePanel(run);
  }

  function requestClose(then = null) {
    afterClose = then;
    if (openedFromList) {
      history.back(); // sự kiện hashchange sẽ đóng trang đọc
      return;
    }
    try {
      history.replaceState(history.state, '', location.pathname + location.search);
    } catch {
      location.hash = '';
    }
    hideReader();
  }

  function goTo(id) {
    location.replace(`#${id}`); // thay thế, để nút Back vẫn quay về danh sách
  }

  function step(delta) {
    const id = el.readerBody.dataset.id;
    const tip = tips.find((t) => t.id === id);
    if (!tip) return;
    const seq = sequenceFor(tip);
    const next = seq[seq.indexOf(tip) + delta];
    if (next) goTo(next.id);
  }

  function route() {
    const tip = tipFromHash();
    if (tip) showTip(tip);
    else if (isOpen() || afterClose) hideReader();
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Dự phòng khi trình duyệt không cho dùng Clipboard API (ví dụ mở file trực tiếp).
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
      (el.reader.open ? el.reader : document.body).appendChild(ta);
      ta.select();
      let ok = false;
      try {
        ok = document.execCommand('copy');
      } catch {}
      ta.remove();
      return ok;
    }
  }

  async function flash(btn, text) {
    const original = btn.dataset.label || btn.textContent;
    btn.dataset.label = original;
    const ok = await copyText(text);
    btn.textContent = ok ? 'Đã chép' : 'Không chép được';
    btn.classList.toggle('is-done', ok);
    clearTimeout(btn._timer);
    btn._timer = setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove('is-done');
    }, 1800);
  }

  /* ----------------------------------------------- Gợi ý trong ô tìm kiếm */

  function typePlaceholder() {
    const narrow = matchMedia('(max-width: 480px)');
    const prefixFor = () => (narrow.matches ? 'Thử: ' : 'Tìm mẹo, ví dụ: ');
    const words = site.searchExamples || [];
    if (!words.length) return;
    if (!motionOK()) {
      el.q.placeholder = prefixFor() + words.slice(0, 3).join(', ');
      return;
    }
    let w = 0;
    let c = 0;
    let deleting = false;
    const tick = () => {
      if (document.activeElement === el.q || el.q.value) {
        el.q.placeholder = 'Gõ từ khoá, có dấu hay không dấu đều được';
        setTimeout(tick, 500);
        return;
      }
      const word = words[w];
      c += deleting ? -1 : 1;
      el.q.placeholder = prefixFor() + word.slice(0, c);
      let delay = deleting ? 35 : 80;
      if (!deleting && c === word.length) {
        deleting = true;
        delay = 1700;
      } else if (deleting && c === 0) {
        deleting = false;
        w = (w + 1) % words.length;
        delay = 350;
      }
      setTimeout(tick, delay);
    };
    tick();
  }

  /* ------------------------------------------------------------ Sáng/tối */

  function isDark() {
    const set = document.documentElement.dataset.theme;
    return set ? set === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function syncThemeButton() {
    $('.theme-toggle').setAttribute('aria-label', isDark() ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối');
  }

  function toggleTheme() {
    const next = isDark() ? 'light' : 'dark';
    const apply = () => {
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem('theme', next);
      } catch {}
      syncThemeButton();
    };
    withTransition(apply);
  }

  /* ------------------------------------------------------------ Sự kiện */

  el.q.form.addEventListener('submit', (e) => {
    e.preventDefault();
    el.q.blur();
    scrollToList();
  });

  el.q.addEventListener('input', () => {
    state.q = el.q.value.trim();
    update();
  });

  el.q.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && el.q.value) {
      e.preventDefault();
      setFilters({ q: '' });
    }
  });

  el.clear.addEventListener('click', () => {
    setFilters({ q: '' });
    el.q.focus();
  });

  el.topics.addEventListener('click', (e) => {
    const btn = e.target.closest('.topic');
    if (!btn) return;
    setFilters({ topic: btn.dataset.topic }, { animate: true });
    btn.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: motionOK() ? 'smooth' : 'auto' });
    scrollToList();
  });

  el.levels.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-level]');
    if (btn) setFilters({ level: btn.dataset.level }, { animate: true });
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-action="reset"]')) {
      setFilters({ q: '', topic: 'all', level: 'all' }, { animate: true });
    }
  });

  el.reader.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;

    if (action === 'close') requestClose();
    else if (action === 'copy') flash(btn, btn.dataset.text ?? btn.closest('.snippet').querySelector('pre').textContent);
    else if (action === 'copy-link') flash(btn, location.href);
    else if (action === 'replay') replayFlow(btn.closest('.flow'));
    else if (action === 'goto') {
      e.preventDefault();
      goTo(btn.dataset.id);
    } else if (action === 'topic') {
      requestClose(() => {
        setFilters({ q: '', topic: btn.dataset.topic, level: 'all' });
        scrollToList();
      });
    } else if (action === 'tag') {
      requestClose(() => {
        setFilters({ q: btn.dataset.tag, topic: 'all', level: 'all' });
        scrollToList();
      });
    }
  });

  // Không cho trang phía sau cuộn khi lăn chuột hay vuốt trên lớp phủ. Cách này thay cho việc
  // đặt overflow: hidden lên <html>, vốn buộc trình duyệt tính lại và vẽ lại cả trang lúc mở panel.
  ['wheel', 'touchmove'].forEach((type) =>
    $('.scrim').addEventListener(type, (e) => e.preventDefault(), { passive: false })
  );

  el.reader.addEventListener('cancel', (e) => {
    e.preventDefault(); // tự đóng để giữ địa chỉ trang đồng bộ
    requestClose();
  });

  el.reader.addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  document.addEventListener('keydown', (e) => {
    if (el.reader.open) return;
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName);
    const slash = e.key === '/' && !typing;
    const cmdK = e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey);
    if (slash || cmdK) {
      e.preventDefault();
      el.q.focus({ preventScroll: true });
      el.q.scrollIntoView({ block: 'center', behavior: motionOK() ? 'smooth' : 'auto' });
    }
  });

  window.addEventListener('hashchange', () => {
    if (!isOpen() && tipFromHash()) openedFromList = true;
    route();
  });

  $('.theme-toggle').addEventListener('click', toggleTheme);
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncThemeButton);

  /* ------------------------------------------------------------ Khởi động */

  // Nạp sẵn các font dùng trong trang đọc khi trình duyệt rảnh, để lần mở panel đầu tiên
  // không phải chờ font rồi vẽ lại chữ giữa lúc đang trượt.
  function warmFonts() {
    if (!document.fonts?.load) return;
    ['400 1em "IBM Plex Mono"', '500 1em "IBM Plex Mono"', '700 1em "Bricolage Grotesque"', '400 1em Literata'].forEach((f) =>
      document.fonts.load(f).catch(() => {})
    );
  }

  // Lần mở panel đầu tiên, trình duyệt phải tính style cho các khối trong trang đọc và GPU phải
  // vẽ chữ, bóng đổ, góc bo lần đầu, gây khựng ~150ms ngay lúc bắt đầu trượt. Làm sẵn việc đó khi
  // trang rảnh: dựng tạm một bản panel gần như vô hình (độ mờ 1%, không bấm được) vài khung hình rồi xoá.
  function warmReader() {
    if (el.reader.open) return;
    const sample = tips.find((t) => t.flow && t.cards && t.commands && t.code) || tips[0];
    const ghost = document.createElement('div');
    ghost.className = 'sheet sheet--warm';
    ghost.setAttribute('aria-hidden', 'true');
    ghost.inert = true;
    ghost.innerHTML = `<article class="sheet-body">${readerHTML(sample).replace(' id="reader-title"', '')}</article>`;
    document.body.appendChild(ghost);
    requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(() => ghost.remove(), 400)));
  }

  const whenIdle = (fn) => (window.requestIdleCallback ? requestIdleCallback(fn, { timeout: 2000 }) : setTimeout(fn, 800));

  readURL();
  fillSiteText();
  buildTopics();
  renderList();
  syncThemeButton();
  route();
  typePlaceholder();
  whenIdle(warmFonts);
  const afterLoad = () => document.fonts.ready.then(() => whenIdle(warmReader));
  if (document.readyState === 'complete') afterLoad();
  else addEventListener('load', afterLoad, { once: true });
})();
