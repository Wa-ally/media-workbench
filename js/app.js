/* ==================== 新媒体爆款工作台 - 主应用 ==================== */

/* ====== 数据存储层 ====== */
const DB = {
  keys: {
    videos: 'mw_videos',
    streams: 'mw_streams',
    categories: 'mw_categories',
    settings: 'mw_settings'
  },

  init() {
    if (!localStorage.getItem(this.keys.categories)) {
      localStorage.setItem(this.keys.categories, JSON.stringify(DEFAULT_CATEGORIES));
    }
    if (!localStorage.getItem(this.keys.videos)) {
      localStorage.setItem(this.keys.videos, JSON.stringify(DEMO_VIDEOS));
    }
    if (!localStorage.getItem(this.keys.streams)) {
      localStorage.setItem(this.keys.streams, JSON.stringify(DEMO_STREAMS));
    }
    if (!localStorage.getItem(this.keys.settings)) {
      localStorage.setItem(this.keys.settings, JSON.stringify({ lastBreakdown: null }));
    }
  },

  getCategories() { return JSON.parse(localStorage.getItem(this.keys.categories) || '[]'); },
  getCategory(id) { return this.getCategories().find(c => c.id === id); },

  getVideos() { return JSON.parse(localStorage.getItem(this.keys.videos) || '[]'); },
  getVideo(id) { return this.getVideos().find(v => v.id === id); },
  addVideo(data) {
    const videos = this.getVideos();
    const video = { id: 'v' + Date.now().toString(36), date: new Date().toISOString().slice(0, 10), ...data };
    videos.unshift(video);
    localStorage.setItem(this.keys.videos, JSON.stringify(videos));
    return video;
  },
  updateVideo(id, data) {
    const videos = this.getVideos();
    const i = videos.findIndex(v => v.id === id);
    if (i >= 0) { videos[i] = { ...videos[i], ...data }; localStorage.setItem(this.keys.videos, JSON.stringify(videos)); }
  },
  deleteVideo(id) {
    localStorage.setItem(this.keys.videos, JSON.stringify(this.getVideos().filter(v => v.id !== id)));
  },

  getStreams() { return JSON.parse(localStorage.getItem(this.keys.streams) || '[]'); },
  getStream(id) { return this.getStreams().find(s => s.id === id); },
  addStream(data) {
    const streams = this.getStreams();
    const stream = { id: 's' + Date.now().toString(36), date: new Date().toISOString().slice(0, 10), ...data };
    streams.unshift(stream);
    localStorage.setItem(this.keys.streams, JSON.stringify(streams));
    return stream;
  },
  deleteStream(id) {
    localStorage.setItem(this.keys.streams, JSON.stringify(this.getStreams().filter(s => s.id !== id)));
  },

  getSettings() { return JSON.parse(localStorage.getItem(this.keys.settings) || '{}'); },
  saveSettings(data) { localStorage.setItem(this.keys.settings, JSON.stringify({ ...this.getSettings(), ...data })); },

  clearAll() {
    localStorage.removeItem(this.keys.videos);
    localStorage.removeItem(this.keys.streams);
    localStorage.removeItem(this.keys.categories);
    localStorage.removeItem(this.keys.settings);
  },

  exportData() {
    return JSON.stringify({
      videos: this.getVideos(),
      streams: this.getStreams(),
      categories: this.getCategories(),
      settings: this.getSettings(),
      exportDate: new Date().toISOString()
    }, null, 2);
  },

  importData(json) {
    const data = JSON.parse(json);
    if (data.videos) localStorage.setItem(this.keys.videos, JSON.stringify(data.videos));
    if (data.streams) localStorage.setItem(this.keys.streams, JSON.stringify(data.streams));
    if (data.categories) localStorage.setItem(this.keys.categories, JSON.stringify(data.categories));
    if (data.settings) localStorage.setItem(this.keys.settings, JSON.stringify(data.settings));
  }
};

/* ====== 工具函数 ====== */
const Utils = {
  formatNum(n) {
    if (!n) return '0';
    if (n >= 100000000) return (n / 100000000).toFixed(1) + '亿';
    if (n >= 10000) return (n / 10000).toFixed(1) + '万';
    return n.toString();
  },
  formatDuration(sec) {
    if (!sec) return '--';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return m > 0 ? `${m}分${s}秒` : `${s}秒`;
  },
  formatDurationMin(min) {
    if (!min) return '--';
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h > 0 ? `${h}小时${m}分` : `${m}分钟`;
  },
  escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  },
  getPlatform(key) { return PLATFORMS[key] || { name: key, icon: '📱', color: '#666' }; },
  getCategory(id) { return DB.getCategories().find(c => c.id === id); },

  /* 获取观看链接：有直链用直链，没有则生成平台搜索链接 */
  getWatchUrl(item) {
    if (item.videoUrl) return item.videoUrl;
    if (item.streamUrl) return item.streamUrl;
    const title = encodeURIComponent(item.title || '');
    const searchUrls = {
      douyin:    `https://www.douyin.com/search/${title}`,
      kuaishou:  `https://www.kuaishou.com/search/video?searchKey=${title}`,
      xhs:       `https://www.xiaohongshu.com/search_result?keyword=${title}`,
      bilibili:  `https://search.bilibili.com/all?keyword=${title}`,
      wechat:    `https://channels.weixin.qq.com/web/pages/search?query=${title}`,
      youtube:   `https://www.youtube.com/results?search_query=${title}`,
      tiktok:    `https://www.tiktok.com/search?q=${title}`,
      toutiao:   `https://so.toutiao.com/search?keyword=${title}`,
    };
    return searchUrls[item.platform] || `https://www.baidu.com/s?wd=${title}`;
  },

  /* 判断是否有可观看链接 */
  hasWatchUrl(item) {
    return !!(item.videoUrl || item.streamUrl || item.title);
  }
};

/* ====== Toast ====== */
const Toast = {
  show(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(this._timer);
    this._timer = setTimeout(() => el.classList.remove('show'), 2500);
  }
};

/* ====== Modal ====== */
const Modal = {
  open(id) {
    document.getElementById(id).classList.add('active');
    document.getElementById(id).setAttribute('aria-hidden', 'false');
  },
  close(id) {
    document.getElementById(id).classList.remove('active');
    document.getElementById(id).setAttribute('aria-hidden', 'true');
  }
};

/* ====== 主应用 ====== */
const App = {
  currentPage: 'home',
  currentPlatform: 'all',
  currentCategory: 'all',
  searchQuery: '',
  currentBreakdown: null,

  init() {
    DB.init();
    this.registerSW();
    this.bindEvents();
    this.renderPage('home');
  },

  registerSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  },

  bindEvents() {
    // Bottom nav
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const page = btn.dataset.page;
        if (page === 'add') {
          this.toggleAddMenu();
        } else {
          this.renderPage(page);
        }
      });
    });

    // Close buttons
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => Modal.close(btn.dataset.close));
    });

    // Overlay click to close
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) Modal.close(overlay.id);
      });
    });
    document.getElementById('addMenuOverlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.toggleAddMenu(false);
    });

    // Add menu items
    document.querySelectorAll('.add-menu-item').forEach(item => {
      item.addEventListener('click', () => {
        this.toggleAddMenu(false);
        const action = item.dataset.action;
        if (action === 'add-video') Modal.open('addVideoModal');
        else if (action === 'add-stream') Modal.open('addStreamModal');
        else if (action === 'go-studio') this.renderPage('studio');
      });
    });

    // Search
    document.getElementById('searchBtn').addEventListener('click', () => this.openSearch());
    document.getElementById('closeSearchBtn').addEventListener('click', () => this.closeSearch());
    document.getElementById('searchInput').addEventListener('input', (e) => {
      this.searchQuery = e.target.value.trim().toLowerCase();
      this.renderSearchResults();
    });

    // Forms
    document.getElementById('videoForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveVideoForm();
    });
    document.getElementById('streamForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveStreamForm();
    });

    // Prevent context menu on long press
    document.addEventListener('contextmenu', (e) => {
      if (e.target.closest('.video-card, .nav-item, .chip')) e.preventDefault();
    });
  },

  toggleAddMenu(force) {
    const el = document.getElementById('addMenuOverlay');
    if (force === false) el.classList.remove('active');
    else el.classList.toggle('active');
  },

  /* ====== Page Router ====== */
  renderPage(page) {
    this.currentPage = page;
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelector(`.nav-item[data-page="${page}"]`)?.classList.add('active');
    const container = document.getElementById('pageContainer');
    container.scrollTop = 0;

    const renderers = {
      home: () => this.renderHome(),
      videos: () => this.renderVideos(),
      streams: () => this.renderStreams(),
      studio: () => this.renderStudio(),
    };
    if (renderers[page]) renderers[page]();
    this.toggleAddMenu(false);
  },

  /* ====== 首页 ====== */
  renderHome() {
    const videos = DB.getVideos();
    const streams = DB.getStreams();
    const categories = DB.getCategories();
    const totalViews = videos.reduce((s, v) => s + (v.views || 0), 0);
    const totalLikes = videos.reduce((s, v) => s + (v.likes || 0), 0);
    const totalGMV = streams.reduce((s, st) => s + (st.gmv || 0), 0);

    const recentVideos = [...videos].sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 5);
    const aigcVideos = videos.filter(v => v.categoryId === 'aigc');

    document.getElementById('pageContainer').innerHTML = `
      <div class="page-section">
        <div class="hero-card">
          <h2>爆款工作台</h2>
          <p>全网爆款视频 · 爆款直播 · 拆解仿写</p>
          <div class="hero-stats">
            <div class="hero-stat"><div class="num">${Utils.formatNum(totalViews)}</div><div class="label">总播放量</div></div>
            <div class="hero-stat"><div class="num">${Utils.formatNum(totalLikes)}</div><div class="label">总点赞</div></div>
            <div class="hero-stat"><div class="num">¥${Utils.formatNum(totalGMV)}</div><div class="label">直播GMV</div></div>
          </div>
        </div>

        <div class="stat-grid">
          <div class="stat-card" onclick="App.renderPage('videos')">
            <div class="stat-icon">🎬</div>
            <div class="stat-num">${videos.length}</div>
            <div class="stat-label">爆款视频</div>
          </div>
          <div class="stat-card" onclick="App.renderPage('streams')">
            <div class="stat-icon">📡</div>
            <div class="stat-num">${streams.length}</div>
            <div class="stat-label">爆款直播</div>
          </div>
          <div class="stat-card" onclick="App.renderPage('videos'); App.currentCategory='aigc'; App.renderVideos();">
            <div class="stat-icon">🤖</div>
            <div class="stat-num">${aigcVideos.length}</div>
            <div class="stat-label">AIGC爆款</div>
          </div>
          <div class="stat-card" onclick="App.renderPage('studio')">
            <div class="stat-icon">✍️</div>
            <div class="stat-num">拆解</div>
            <div class="stat-label">仿写工具</div>
          </div>
        </div>

        <div class="data-source-banner">
          <div class="banner-title">📡 爆款数据汇总中心</div>
          <div>当前已收录 <strong>${videos.length}</strong> 条爆款视频，其中 <strong>${DATA_SOURCE_INFO.realVideos}</strong> 条为真实全网数据</div>
          <div class="banner-list">
            数据来源：${DATA_SOURCE_INFO.sources.join(' · ')}
          </div>
          <div class="banner-limit">
            ⚠️ 说明：抖音/快手/小红书等平台无公开搜索API，无法自动实时爬取。当前数据为公开报道整理，可通过「我的」页面手动添加新爆款。
          </div>
        </div>

        <div class="section-title">分类导航</div>
        <div class="filter-chips">
          ${categories.map(cat => `
            <div class="chip" onclick="App.currentCategory='${cat.id}'; App.renderPage('videos');">
              <span style="color: ${cat.color}">${cat.icon}</span>
              <span>${cat.name}</span>
            </div>
          `).join('')}
        </div>

        <div class="section-title">最近爆款 <span class="count">${recentVideos.length}条</span></div>
        <div class="video-list">
          ${recentVideos.map(v => this.renderVideoCard(v)).join('')}
        </div>

        ${recentVideos.length === 0 ? '<div class="empty-state"><div class="emoji">📭</div><p>还没有爆款视频，点击下方+添加</p></div>' : ''}
      </div>
    `;
  },

  /* ====== 爆款视频页 ====== */
  renderVideos() {
    const videos = DB.getVideos();
    const categories = DB.getCategories();
    const platforms = Object.entries(PLATFORMS);

    let filtered = videos;
    if (this.currentCategory !== 'all') filtered = filtered.filter(v => v.categoryId === this.currentCategory);
    if (this.currentPlatform !== 'all') filtered = filtered.filter(v => v.platform === this.currentPlatform);

    document.getElementById('pageContainer').innerHTML = `
      <div class="page-section">
        <div class="section-title">爆款视频 <span class="count">${filtered.length}条</span></div>

        <div class="filter-chips">
          <div class="chip ${this.currentPlatform === 'all' ? 'active' : ''}" onclick="App.currentPlatform='all'; App.renderVideos();">全部平台</div>
          ${platforms.map(([key, p]) => `
            <div class="chip ${this.currentPlatform === key ? 'active' : ''}" onclick="App.currentPlatform='${key}'; App.renderVideos();">
              ${p.icon} ${p.name}
            </div>
          `).join('')}
        </div>

        <div class="filter-chips">
          <div class="chip ${this.currentCategory === 'all' ? 'active' : ''}" onclick="App.currentCategory='all'; App.renderVideos();">全部分类</div>
          ${categories.map(cat => `
            <div class="chip ${this.currentCategory === cat.id ? 'active' : ''}" onclick="App.currentCategory='${cat.id}'; App.renderVideos();">
              <span class="dot" style="background:${cat.color}"></span> ${cat.name}
            </div>
          `).join('')}
        </div>

        <div class="video-list">
          ${filtered.map(v => this.renderVideoCard(v)).join('')}
        </div>

        ${filtered.length === 0 ? '<div class="empty-state"><div class="emoji">🎬</div><p>没有符合条件的视频，试试其他筛选条件</p></div>' : ''}
      </div>
    `;
  },

  renderVideoCard(v) {
    const cat = Utils.getCategory(v.categoryId);
    const platform = Utils.getPlatform(v.platform);
    const realBadge = v.isReal ? '<span class="real-badge">📊 真实数据</span>' : '';
    const watchUrl = Utils.getWatchUrl(v);
    return `
      <div class="video-card" onclick="App.openVideoDetail('${v.id}')">
        <div class="video-card-header">
          <div class="video-card-title">${Utils.escapeHTML(v.title)}</div>
          <div class="video-card-meta">
            <span class="platform-badge ${v.platform}">${platform.icon} ${platform.name}</span>
            ${cat ? `<span class="category-badge"><span style="color:${cat.color}">${cat.icon}</span> ${cat.name}</span>` : ''}
            ${realBadge}
            <span style="font-size:12px;color:var(--text-muted)">@${Utils.escapeHTML(v.author || '未知')}</span>
          </div>
        </div>
        <div class="video-card-stats">
          <span>▶ ${Utils.formatNum(v.views)}</span>
          <span>❤ ${Utils.formatNum(v.likes)}</span>
          <span>💬 ${Utils.formatNum(v.comments)}</span>
          <span>⏱ ${Utils.formatDuration(v.duration)}</span>
        </div>
        ${v.tags && v.tags.length ? `<div class="video-card-footer">${v.tags.map(t => `<span class="tag">${Utils.escapeHTML(t)}</span>`).join('')}</div>` : ''}
        <div class="card-watch-btn" onclick="event.stopPropagation();window.open('${watchUrl}','_blank');">
          ▶️ 观看视频
        </div>
      </div>
    `;
  },

  /* ====== 视频详情 ====== */
  openVideoDetail(id) {
    const v = DB.getVideo(id);
    if (!v) return;
    const cat = Utils.getCategory(v.categoryId);
    const platform = Utils.getPlatform(v.platform);
    const breakdown = v.script ? CopyEngine.breakdown(v.script) : null;

    document.getElementById('videoDetailTitle').textContent = '视频详情';
    document.getElementById('videoDetailBody').innerHTML = `
      <h2 style="font-size:18px;margin-bottom:8px;line-height:1.4;">${Utils.escapeHTML(v.title)}</h2>
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">
        <span class="platform-badge ${v.platform}">${platform.icon} ${platform.name}</span>
        ${cat ? `<span class="category-badge"><span style="color:${cat.color}">${cat.icon}</span> ${cat.name}</span>` : ''}
        <span style="font-size:13px;color:var(--text-muted)">@${Utils.escapeHTML(v.author || '未知')} · ${v.date || ''}</span>
      </div>
      <div class="detail-stats">
        <div class="detail-stat"><div class="num">${Utils.formatNum(v.views)}</div><div class="label">播放</div></div>
        <div class="detail-stat"><div class="num">${Utils.formatNum(v.likes)}</div><div class="label">点赞</div></div>
        <div class="detail-stat"><div class="num">${Utils.formatNum(v.comments)}</div><div class="label">评论</div></div>
        <div class="detail-stat"><div class="num">${Utils.formatNum(v.shares)}</div><div class="label">分享</div></div>
      </div>
      <a href="${Utils.getWatchUrl(v)}" target="_blank" class="watch-btn-big">
        ▶️ 点击观看视频 · ${platform.name}
      </a>
      ${v.source ? `<div style="font-size:11px;color:var(--text-muted);margin-bottom:12px;padding:6px 10px;background:var(--bg-elevated);border-radius:6px;">📡 数据来源：${Utils.escapeHTML(v.source)}</div>` : ''}
      ${v.script ? `
        <div class="section-title" style="margin-top:16px;">视频文案</div>
        <div class="detail-script">${Utils.escapeHTML(v.script)}</div>
      ` : ''}
      ${v.tags && v.tags.length ? `
        <div class="section-title" style="margin-top:8px;">标签</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;">
          ${v.tags.map(t => `<span class="tag">${Utils.escapeHTML(t)}</span>`).join('')}
        </div>
      ` : ''}
      ${breakdown && !breakdown.error ? `
        <div class="section-title" style="margin-top:8px;">拆解分析</div>
        <div class="breakdown-summary">
          <h4>📋 框架：${breakdown.framework.name}</h4>
          <p>${breakdown.summary}</p>
        </div>
      ` : ''}
      <div class="detail-actions" style="margin-top:16px;">
        ${breakdown && !breakdown.error ? `<button class="btn-sm btn-primary" onclick="App.openStudioWithVideo('${v.id}')">✍️ 拆解仿写</button>` : ''}
        <button class="btn-sm btn-outline" onclick="if(confirm('删除这条视频？')){DB.deleteVideo('${v.id}');Modal.close('videoModal');App.renderPage(App.currentPage);}">🗑 删除</button>
      </div>
    `;
    Modal.open('videoModal');
  },

  /* ====== 爆款直播页 ====== */
  renderStreams() {
    const streams = DB.getStreams();
    const categories = DB.getCategories();

    let filtered = streams;
    if (this.currentCategory !== 'all') filtered = filtered.filter(s => s.categoryId === this.currentCategory);

    document.getElementById('pageContainer').innerHTML = `
      <div class="page-section">
        <div class="section-title">爆款直播 <span class="count">${filtered.length}场</span></div>

        <div class="filter-chips">
          <div class="chip ${this.currentCategory === 'all' ? 'active' : ''}" onclick="App.currentCategory='all'; App.renderStreams();">全部分类</div>
          ${categories.map(cat => `
            <div class="chip ${this.currentCategory === cat.id ? 'active' : ''}" onclick="App.currentCategory='${cat.id}'; App.renderStreams();">
              <span class="dot" style="background:${cat.color}"></span> ${cat.name}
            </div>
          `).join('')}
        </div>

        ${filtered.map(s => this.renderStreamCard(s)).join('')}

        ${filtered.length === 0 ? '<div class="empty-state"><div class="emoji">📡</div><p>没有符合条件的直播，点击下方+添加</p></div>' : ''}
      </div>
    `;
  },

  renderStreamCard(s) {
    const cat = Utils.getCategory(s.categoryId);
    const platform = Utils.getPlatform(s.platform);
    const highlights = (s.highlights || []).map(h => `<li>${Utils.escapeHTML(h)}</li>`).join('');
    const watchUrl = Utils.getWatchUrl(s);
    return `
      <div class="stream-card" onclick="App.openStreamDetail('${s.id}')">
        <div class="stream-card-header">
          <div class="stream-card-title">${Utils.escapeHTML(s.title)}</div>
          <div class="stream-card-host">
            <span class="platform-badge ${s.platform}">${platform.icon} ${platform.name}</span>
            @${Utils.escapeHTML(s.host || '未知')}
            ${cat ? ` · <span style="color:${cat.color}">${cat.icon} ${cat.name}</span>` : ''}
          </div>
        </div>
        <div class="stream-card-stats">
          <div class="stream-stat"><div class="num">${Utils.formatNum(s.peakViewers)}</div><div class="label">峰值人数</div></div>
          <div class="stream-stat"><div class="num">${Utils.formatNum(s.gmv)}</div><div class="label">GMV(元)</div></div>
          <div class="stream-stat"><div class="num">${Utils.formatNum(s.orders)}</div><div class="label">订单数</div></div>
        </div>
        ${highlights ? `<ul class="stream-highlights">${highlights}</ul>` : ''}
        ${s.tags ? `<div class="video-card-footer">${s.tags.map(t => `<span class="tag">${Utils.escapeHTML(t)}</span>`).join('')}</div>` : ''}
        <div class="card-watch-btn" onclick="event.stopPropagation();window.open('${watchUrl}','_blank');">
          📺 观看直播回放
        </div>
      </div>
    `;
  },

  openStreamDetail(id) {
    const s = DB.getStream(id);
    if (!s) return;
    const cat = Utils.getCategory(s.categoryId);
    const platform = Utils.getPlatform(s.platform);
    const highlights = (s.highlights || []).map(h => `<li>${Utils.escapeHTML(h)}</li>`).join('');

    document.getElementById('videoDetailTitle').textContent = '直播详情';
    document.getElementById('videoDetailBody').innerHTML = `
      <h2 style="font-size:18px;margin-bottom:8px;">${Utils.escapeHTML(s.title)}</h2>
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">
        <span class="platform-badge ${s.platform}">${platform.icon} ${platform.name}</span>
        ${cat ? `<span class="category-badge"><span style="color:${cat.color}">${cat.icon}</span> ${cat.name}</span>` : ''}
        <span style="font-size:13px;color:var(--text-muted)">@${Utils.escapeHTML(s.host)} · ${s.date}</span>
      </div>
      <div class="detail-stats">
        <div class="detail-stat"><div class="num">${Utils.formatNum(s.peakViewers)}</div><div class="label">峰值人数</div></div>
        <div class="detail-stat"><div class="num">${Utils.formatNum(s.avgViewers)}</div><div class="label">平均人数</div></div>
        <div class="detail-stat"><div class="num">${Utils.formatNum(s.orders)}</div><div class="label">订单数</div></div>
        <div class="detail-stat"><div class="num">¥${Utils.formatNum(s.gmv)}</div><div class="label">GMV</div></div>
      </div>
      <div class="detail-stat" style="text-align:left;margin-bottom:12px;">
        <div class="num" style="font-size:14px;">${Utils.formatDurationMin(s.duration)}</div>
        <div class="label">直播时长</div>
      </div>
      <a href="${Utils.getWatchUrl(s)}" target="_blank" class="watch-btn-big">
        📺 观看直播回放 · ${platform.name}
      </a>
      ${highlights ? `
        <div class="section-title">直播亮点</div>
        <ul class="stream-highlights" style="padding:0 0 12px 16px;">${highlights}</ul>
      ` : ''}
      ${s.tags ? `<div class="video-card-footer">${s.tags.map(t => `<span class="tag">${Utils.escapeHTML(t)}</span>`).join('')}</div>` : ''}
      <div class="detail-actions" style="margin-top:16px;">
        <button class="btn-sm btn-outline" onclick="if(confirm('删除这条直播？')){DB.deleteStream('${s.id}');Modal.close('videoModal');App.renderPage(App.currentPage);}">🗑 删除</button>
      </div>
    `;
    Modal.open('videoModal');
  },

  /* ====== 拆解仿写工作台 ====== */
  renderStudio() {
    document.getElementById('pageContainer').innerHTML = `
      <div class="page-section">
        <div class="hero-card" style="background:linear-gradient(135deg,#7c6cff 0%,#5b8def 100%);">
          <h2>拆解 & 仿写工作台</h2>
          <p>拆解爆款视频结构 → 仿写去人机感文案 → 符合平台爆款逻辑</p>
        </div>

        <div class="section-title">第一步：输入爆款视频文案</div>
        <div class="studio-input-area">
          <textarea id="studioScriptInput" placeholder="粘贴爆款视频的完整文案/脚本...&#10;&#10;例如：说真的，我以前做一张设计图至少3小时。直到我发现了这个AI工作流。第一步..."></textarea>
        </div>
        <div class="studio-actions">
          <button class="btn-primary" onclick="App.runBreakdown()">🔍 拆解分析</button>
          <button class="btn-sm btn-outline" onclick="App.loadSampleScript()">📋 加载示例</button>
          <button class="btn-sm btn-outline" onclick="document.getElementById('studioScriptInput').value='';document.getElementById('breakdownResult').innerHTML='';">清空</button>
        </div>

        <div id="breakdownResult" class="breakdown-result"></div>
      </div>
    `;
  },

  loadSampleScript() {
    const sample = DEMO_VIDEOS[0].script;
    document.getElementById('studioScriptInput').value = sample;
    Toast.show('已加载示例文案');
  },

  runBreakdown() {
    const script = document.getElementById('studioScriptInput').value.trim();
    if (!script) { Toast.show('请先输入视频文案'); return; }

    const result = CopyEngine.breakdown(script);
    this.currentBreakdown = result;
    DB.saveSettings({ lastBreakdown: result });

    if (result.error) {
      document.getElementById('breakdownResult').innerHTML = `<div class="breakdown-summary"><p style="color:var(--danger);">${result.error}</p></div>`;
      return;
    }

    document.getElementById('breakdownResult').innerHTML = this.renderBreakdown(result);
  },

  renderBreakdown(result) {
    const segments = result.segments.map(seg => `
      <div class="breakdown-segment" style="border-left-color:${this.getSegmentColor(seg.id)}">
        <div class="seg-header">
          <span style="font-size:16px;">${seg.icon}</span>
          <span class="seg-label">${seg.label}</span>
          <span class="seg-timing">${seg.timing}</span>
          <span style="font-size:11px;color:var(--text-muted);margin-left:auto;">${seg.wordCount}字</span>
        </div>
        <div class="seg-content">${Utils.escapeHTML(seg.content)}</div>
        ${seg.elements.length ? `<div class="seg-elements">${seg.elements.map(e => `<span class="element-tag">${e.icon} ${e.name}</span>`).join('')}</div>` : ''}
        ${seg.analysis ? `<div class="seg-analysis">${seg.analysis}</div>` : ''}
      </div>
    `).join('');

    const rhythmBar = `
      <div class="rhythm-bar">
        <div class="fast" style="width:${result.rhythm.fast}%"></div>
        <div class="medium" style="width:${result.rhythm.medium}%"></div>
        <div class="slow" style="width:${result.rhythm.slow}%"></div>
      </div>
      <div style="display:flex;gap:12px;font-size:11px;color:var(--text-muted);">
        <span>🔴 快句 ${result.rhythm.fast}%</span>
        <span>🟡 中句 ${result.rhythm.medium}%</span>
        <span>🟢 长句 ${result.rhythm.slow}%</span>
        <span style="margin-left:auto;">平均${result.rhythm.avgLength}字/句</span>
      </div>
    `;

    const topElements = result.topElements.map(e => `<span class="element-tag">${e.icon} ${e.name} ×${e.count}</span>`).join('');

    return `
      <div class="breakdown-summary">
        <h4>📊 拆解报告</h4>
        <p><strong>框架：</strong>${result.framework.name}（${result.framework.desc}）</p>
        <p style="margin-top:6px;"><strong>爆款元素：</strong></p>
        <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px;">${topElements}</div>
        <p style="margin-top:8px;"><strong>节奏分析：</strong>${result.rhythm.verdict}</p>
        <div style="margin-top:8px;">${rhythmBar}</div>
        <p style="margin-top:8px;"><strong>总结：</strong>${result.summary}</p>
      </div>
      <div class="section-title" style="margin-top:20px;">六段结构拆解</div>
      ${segments}

      <div class="section-title" style="margin-top:20px;">第二步：仿写文案</div>
      <div class="studio-input-area">
        <input type="text" id="imitateTopic" placeholder="输入你的主题/领域/产品（如：AI写作工具、减肥餐、英语课...）" style="width:100%;background:var(--bg-elevated);border:1px solid var(--border);border-radius:8px;padding:10px 12px;color:var(--text);font-size:14px;margin-bottom:10px;">
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
          <label style="font-size:13px;color:var(--text-secondary);">目标平台：</label>
          <select id="imitatePlatform" style="background:var(--bg-elevated);border:1px solid var(--border);border-radius:6px;padding:4px 8px;color:var(--text);font-size:13px;">
            ${Object.entries(PLATFORMS).map(([k,p]) => `<option value="${k}">${p.icon} ${p.name}</option>`).join('')}
          </select>
          <label style="font-size:13px;color:var(--text-secondary);margin-left:8px;">语气版本：</label>
          <select id="imitateTone" style="background:var(--bg-elevated);border:1px solid var(--border);border-radius:6px;padding:4px 8px;color:var(--text);font-size:13px;">
            <option value="aggressive">🔥 激进版</option>
            <option value="gentle">🌿 温和版</option>
            <option value="story">📖 故事版</option>
          </select>
        </div>
      </div>
      <div class="studio-actions">
        <button class="btn-primary" onclick="App.runImitate()">✍️ 生成仿写文案</button>
      </div>
      <div id="imitateResult"></div>
    `;
  },

  getSegmentColor(id) {
    const colors = { hook:'#ff5577', setup:'#ffb547', twist:'#7c6cff', value:'#00d4aa', engage:'#4facfe', cta:'#2dca73' };
    return colors[id] || '#7c6cff';
  },

  runImitate() {
    if (!this.currentBreakdown || this.currentBreakdown.error) {
      Toast.show('请先完成拆解'); return;
    }
    const topic = document.getElementById('imitateTopic').value.trim();
    const platform = document.getElementById('imitatePlatform').value;
    const tone = document.getElementById('imitateTone').value;

    if (!topic) { Toast.show('请输入你的主题'); return; }

    const result = CopyEngine.imitate(this.currentBreakdown, { topic, platform, tone });
    if (result.error) { Toast.show(result.error); return; }

    document.getElementById('imitateResult').innerHTML = this.renderImitateResult(result);
  },

  renderImitateResult(result) {
    const segments = result.segments.map(seg => `
      <div class="copy-segment">
        <div class="seg-label">${seg.icon} ${seg.label}（${seg.timing}）</div>
        <div class="seg-content">${Utils.escapeHTML(seg.content)}</div>
      </div>
    `).join('');

    const checks = result.antiAICheck.checks.map(c => `
      <div style="display:flex;align-items:center;gap:6px;font-size:12px;margin-bottom:4px;">
        <span>${c.score === 'good' ? '✅' : '⚠️'}</span>
        <span style="color:var(--text-secondary);">${c.item}：</span>
        <span>${c.detail}</span>
      </div>
    `).join('');

    const fullScript = result.segments.map(s => s.content).join('\n\n');

    return `
      <div class="copy-result-section">
        <h4>📝 ${result.tone} · ${result.platform.name}</h4>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:10px;">框架：${result.framework.name} | 字数：${result.wordCount}字</div>
        ${segments}
      </div>

      <div class="copy-result-section">
        <h4>📄 完整文案</h4>
        <div class="detail-script" id="fullScriptText">${Utils.escapeHTML(fullScript)}</div>
        <button class="btn-sm btn-primary" onclick="App.copyToClipboard('fullScriptText')">📋 复制文案</button>
      </div>

      <div class="copy-result-section">
        <h4>🤖 去人机感检测</h4>
        <div class="anti-ai-score">
          <span class="score-num" style="color:${result.antiAICheck.score >= 75 ? 'var(--success)' : result.antiAICheck.score >= 50 ? 'var(--warning)' : 'var(--danger)'};">${result.antiAICheck.score}</span>
          <div class="score-bar"><div class="fill" style="width:${result.antiAICheck.score}%"></div></div>
        </div>
        <p style="font-size:13px;color:var(--text-secondary);">${result.antiAICheck.verdict}</p>
        <div style="margin-top:8px;">${checks}</div>
      </div>

      <div class="copy-result-section">
        <h4>🔄 变体参考</h4>
        ${result.variations.map(v => `
          <div style="margin-bottom:6px;">
            <span style="font-size:11px;color:var(--text-muted);">${v.type}：</span>
            <span style="font-size:13px;color:var(--text-secondary);">${Utils.escapeHTML(v.content)}</span>
          </div>
        `).join('')}
      </div>
    `;
  },

  copyToClipboard(elementId) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text).then(() => {
      Toast.show('已复制到剪贴板');
    }).catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      Toast.show('已复制到剪贴板');
    });
  },

  openStudioWithVideo(videoId) {
    Modal.close('videoModal');
    this.renderPage('studio');
    setTimeout(() => {
      const v = DB.getVideo(videoId);
      if (v && v.script) {
        document.getElementById('studioScriptInput').value = v.script;
        this.runBreakdown();
      }
    }, 300);
  },

  /* ====== 表单保存 ====== */
  saveVideoForm() {
    const tags = document.getElementById('videoTagsInput').value.trim();
    const data = {
      title: document.getElementById('videoTitleInput').value.trim(),
      platform: document.getElementById('videoPlatformInput').value,
      categoryId: document.getElementById('videoCategoryInput').value,
      author: document.getElementById('videoAuthorInput').value.trim(),
      duration: parseInt(document.getElementById('videoDurationInput').value) || 60,
      views: parseInt(document.getElementById('videoViewsInput').value) || 0,
      likes: parseInt(document.getElementById('videoLikesInput').value) || 0,
      comments: 0,
      shares: 0,
      videoUrl: document.getElementById('videoUrlInput').value.trim(),
      script: document.getElementById('videoScriptInput').value.trim(),
      tags: tags ? tags.split(/[,，、\s]+/).map(t => t.trim()).filter(Boolean) : []
    };
    if (!data.title) { Toast.show('请输入标题'); return; }
    DB.addVideo(data);
    Toast.show('✅ 已添加爆款视频');
    Modal.close('addVideoModal');
    document.getElementById('videoForm').reset();
    this.renderPage(this.currentPage);
  },

  saveStreamForm() {
    const highlightsText = document.getElementById('streamHighlightsInput').value.trim();
    const tags = document.getElementById('streamTagsInput').value.trim();
    const data = {
      title: document.getElementById('streamTitleInput').value.trim(),
      platform: document.getElementById('streamPlatformInput').value,
      categoryId: document.getElementById('streamCategoryInput').value,
      host: document.getElementById('streamHostInput').value.trim(),
      duration: parseInt(document.getElementById('streamDurationInput').value) || 0,
      peakViewers: parseInt(document.getElementById('streamPeakInput').value) || 0,
      avgViewers: 0,
      gmv: parseInt(document.getElementById('streamGmvInput').value) || 0,
      orders: 0,
      highlights: highlightsText ? highlightsText.split('\n').map(h => h.trim()).filter(Boolean) : [],
      tags: tags ? tags.split(/[,，、\s]+/).map(t => t.trim()).filter(Boolean) : []
    };
    if (!data.title) { Toast.show('请输入标题'); return; }
    DB.addStream(data);
    Toast.show('✅ 已添加爆款直播');
    Modal.close('addStreamModal');
    document.getElementById('streamForm').reset();
    this.renderPage(this.currentPage);
  },

  /* ====== 搜索 ====== */
  openSearch() {
    document.getElementById('searchOverlay').classList.add('active');
    document.getElementById('searchInput').focus();
  },
  closeSearch() {
    document.getElementById('searchOverlay').classList.remove('active');
    document.getElementById('searchInput').value = '';
    this.searchQuery = '';
  },
  renderSearchResults() {
    const q = this.searchQuery;
    const container = document.getElementById('searchResults');
    if (!q) { container.innerHTML = ''; return; }

    const videos = DB.getVideos().filter(v =>
      v.title.toLowerCase().includes(q) ||
      (v.author && v.author.toLowerCase().includes(q)) ||
      (v.tags && v.tags.some(t => t.toLowerCase().includes(q)))
    ).slice(0, 10);

    const streams = DB.getStreams().filter(s =>
      s.title.toLowerCase().includes(q) ||
      (s.host && s.host.toLowerCase().includes(q))
    ).slice(0, 5);

    let html = '';
    if (videos.length) {
      html += '<div class="section-title">视频</div>' + videos.map(v => this.renderVideoCard(v)).join('');
    }
    if (streams.length) {
      html += '<div class="section-title">直播</div>' + streams.map(s => this.renderStreamCard(s)).join('');
    }
    if (!html) html = '<div class="empty-state"><div class="emoji">🔍</div><p>没有找到相关内容</p></div>';
    container.innerHTML = html;
  },

  /* ====== 初始化分类下拉 ====== */
  initCategorySelects() {
    const cats = DB.getCategories();
    const options = cats.map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join('');
    ['videoCategoryInput', 'streamCategoryInput'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = options;
    });
  }
};

// ====== 启动 ======
document.addEventListener('DOMContentLoaded', () => {
  App.init();
  App.initCategorySelects();
});
