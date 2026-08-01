/**
 * HATECHNO HRM - Bootstrap Layout Shared JS
 * Tích hợp từ repo PhamVanVu + kết nối API backend
 */

// ===== API Client =====
const API = {
    BASE: '/api',
    getToken: () => localStorage.getItem('hrm_token'),
    getUser: () => { try { return JSON.parse(localStorage.getItem('hrm_user')); } catch { return null; } },
    saveSession: (token, user) => { localStorage.setItem('hrm_token', token); localStorage.setItem('hrm_user', JSON.stringify(user)); },
    clearSession: () => { localStorage.removeItem('hrm_token'); localStorage.removeItem('hrm_user'); },

    req: async (method, endpoint, body = null) => {
        const token = API.getToken();
        const opts = {
            method,
            headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
        };
        if (body instanceof FormData) { opts.body = body; }
        else if (body) { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
        try {
            const res = await fetch(API.BASE + endpoint, opts);
            const data = await res.json();
            if (res.status === 403) { API.clearSession(); window.location.href = '/login'; return null; }
            return { ok: res.ok, status: res.status, data };
        } catch(e) { showToast('Lỗi kết nối máy chủ', 'danger'); return null; }
    },
    get: (ep) => API.req('GET', ep),
    post: (ep, b) => API.req('POST', ep, b),
    put: (ep, b) => API.req('PUT', ep, b),
    del: (ep) => API.req('DELETE', ep)
};

// ===== Auth Check =====
function requireAuth() {
    const token = API.getToken();
    const user = API.getUser();
    if (!token || !user) { window.location.href = '/login'; return null; }
    return user;
}

function hasRole(roles) {
    const user = API.getUser();
    return user && roles.includes(user.tenQuyen);
}

// ===== Toast =====
function showToast(msg, type = 'primary', title = '') {
    const titles = { primary:'Thông báo', success:'Thành công', danger:'Lỗi', warning:'Cảnh báo' };
    const icons = { primary:'fa-circle-info', success:'fa-circle-check', danger:'fa-circle-xmark', warning:'fa-triangle-exclamation' };
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
    }
    const id = 'toast_' + Date.now();
    container.insertAdjacentHTML('beforeend', `
        <div id="${id}" class="toast align-items-center text-bg-${type} border-0" role="alert" aria-live="assertive">
            <div class="d-flex">
                <div class="toast-body d-flex align-items-center gap-2">
                    <i class="fa-solid ${icons[type]||icons.primary}"></i>
                    <div><strong>${title || titles[type]}</strong><br><small>${msg}</small></div>
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `);
    const el = document.getElementById(id);
    new bootstrap.Toast(el, { delay: 3500 }).show();
    el.addEventListener('hidden.bs.toast', () => el.remove());
}

// ===== Confirm Dialog =====
function showConfirm(message, title, onConfirm) {
    let modal = document.getElementById('confirmModal');
    if (!modal) {
        document.body.insertAdjacentHTML('beforeend', `
            <div class="modal fade" id="confirmModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered modal-sm">
                    <div class="modal-content">
                        <div class="modal-header bg-danger text-white">
                            <h6 class="modal-title" id="confirmTitle"><i class="fa-solid fa-triangle-exclamation me-2"></i>Xác nhận</h6>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body" id="confirmMsg"></div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Hủy</button>
                            <button class="btn btn-danger btn-sm" id="confirmOkBtn">Xác nhận</button>
                        </div>
                    </div>
                </div>
            </div>
        `);
        modal = document.getElementById('confirmModal');
    }
    document.getElementById('confirmTitle').innerHTML = `<i class="fa-solid fa-triangle-exclamation me-2"></i>${title || 'Xác nhận'}`;
    document.getElementById('confirmMsg').innerHTML = message;
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    const okBtn = document.getElementById('confirmOkBtn');
    const newBtn = okBtn.cloneNode(true);
    okBtn.parentNode.replaceChild(newBtn, okBtn);
    newBtn.addEventListener('click', () => { bsModal.hide(); if (onConfirm) onConfirm(); });
}

// ===== Format helpers =====
const fmt = {
    money: (n) => n == null ? '0 ₫' : new Intl.NumberFormat('vi-VN', { style:'currency', currency:'VND', maximumFractionDigits:0 }).format(n),
    date: (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '--',
    esc: (s) => s ? String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') : ''
};

// ===== Render Sidebar + Navbar =====
function renderLayout(activePage) {
    const user = API.getUser();
    if (!user) return;
    const isManager = hasRole(['Admin','NhanSu']);
    const isEmployee = user.tenQuyen === 'NhanVien';
    const avatar = user.avatar
        ? user.avatar
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.hoTen||'U')}&background=2563EB&color=fff&size=36`;

    const navItems = [
        { page:'dashboard', icon:'fa-chart-pie', label:'Dashboard', always:true },
        { page:'employees', icon:'fa-users', label:'Nhân viên', manager:true },
        { page:'departments', icon:'fa-building', label:'Phòng ban', manager:true },
        { page:'positions', icon:'fa-briefcase', label:'Chức vụ', manager:true },
        { page:'attendance', icon:'fa-calendar-check', label:'Chấm công', manager:true },
        { page:'salary', icon:'fa-money-bill-wave', label:'Bảng lương', always:true },
        { page:'rewards', icon:'fa-trophy', label:'Thưởng / KL', manager:true },
        { page:'leaves', icon:'fa-calendar-xmark', label:'Nghỉ phép', always:true },
        { page:'reports', icon:'fa-chart-bar', label:'Báo cáo', manager:true },
        { page:'profile', icon:'fa-circle-user', label:'Hồ sơ cá nhân', always:true },
    ];

    const employeeOnlyPages = ['attendance', 'salary', 'rewards', 'leaves', 'profile'];

    const sidebarItems = navItems
        .filter(n => isEmployee ? employeeOnlyPages.includes(n.page) : (n.always || (isManager && n.manager)))
        .map(n => `
            <li class="nav-item">
                <a href="/${n.page}" class="nav-link px-3 py-2 rounded-2 mx-2 ${activePage===n.page?'active text-white bg-primary':'text-white-50'}">
                    <i class="fa-solid ${n.icon} me-2"></i>${n.label}
                </a>
            </li>
        `).join('');

    const sidebarHTML = `
        <div class="d-flex flex-column h-100">
            <!-- Brand -->
            <div class="px-3 py-4 border-bottom border-white border-opacity-10">
                <div class="d-flex align-items-center gap-2">
                    <div style="width:38px;height:38px;background:linear-gradient(135deg,#2563EB,#7C3AED);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;color:white;flex-shrink:0">
                        <i class="fa-solid fa-shield-halved"></i>
                    </div>
                    <div>
                        <div class="text-white fw-bold" style="font-size:14px;line-height:1.2">HATECHNO</div>
                        <div class="text-white-50" style="font-size:10px;letter-spacing:1px">HR MANAGEMENT</div>
                    </div>
                </div>
            </div>

            <!-- Nav -->
            <ul class="nav flex-column py-2 flex-grow-1">
                ${sidebarItems}
            </ul>

            <!-- User -->
            <div class="px-3 py-3 border-top border-white border-opacity-10">
                <div class="d-flex align-items-center gap-2">
                    <img src="${fmt.esc(avatar)}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,0.2)" alt="">
                    <div class="overflow-hidden">
                        <div class="text-white fw-semibold" style="font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${fmt.esc(user.hoTen||user.tenDangNhap)}</div>
                        <div class="text-white-50" style="font-size:10px">${fmt.esc(user.tenQuyen)}</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const navbarHTML = `
        <nav class="navbar navbar-expand-lg navbar-white bg-white shadow-sm px-3" style="height:60px">
            <button class="btn btn-sm btn-outline-secondary d-lg-none me-2" id="mobileSidebarToggle">
                <i class="fa-solid fa-bars"></i>
            </button>
            <span class="navbar-brand fw-bold text-primary mb-0 h5" id="pageTitle"></span>

            <div class="ms-auto d-flex align-items-center gap-2">
                <!-- Theme toggle -->
                <button class="btn btn-sm btn-outline-secondary rounded-circle" id="themeToggleBtn" title="Đổi giao diện" style="width:36px;height:36px">
                    <i class="fa-solid fa-moon" id="themeIcon"></i>
                </button>

                <!-- Notifications -->
                <a href="/leaves" class="btn btn-sm btn-outline-secondary rounded-circle position-relative" style="width:36px;height:36px;display:flex;align-items:center;justify-content:center">
                    <i class="fa-solid fa-bell"></i>
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" id="notifyBadge" style="display:none;font-size:9px">0</span>
                </a>

                <!-- User dropdown -->
                <div class="dropdown">
                    <img src="${fmt.esc(avatar)}" alt="Avatar" class="rounded-circle border" id="navAvatar"
                         style="width:36px;height:36px;object-fit:cover;cursor:pointer"
                         data-bs-toggle="dropdown">
                    <ul class="dropdown-menu dropdown-menu-end shadow-sm">
                        <li><h6 class="dropdown-header">${fmt.esc(user.hoTen||'User')}</h6></li>
                        <li><a class="dropdown-item" href="/profile"><i class="fa-solid fa-user me-2 text-primary"></i>Hồ sơ cá nhân</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item text-danger" href="#" id="logoutBtn"><i class="fa-solid fa-right-from-bracket me-2"></i>Đăng xuất</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    `;

    // Inject
    const sidebarEl = document.getElementById('sidebar');
    const navbarEl = document.getElementById('topNavbar');
    if (sidebarEl) sidebarEl.innerHTML = sidebarHTML;
    if (navbarEl) navbarEl.innerHTML = navbarHTML;

    // Events
    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        showConfirm('Bạn có chắc muốn đăng xuất?', 'Đăng xuất', async () => {
            await API.post('/auth/logout', {});
            API.clearSession();
            window.location.href = '/login';
        });
    });

    document.getElementById('mobileSidebarToggle')?.addEventListener('click', () => {
        document.querySelector('.sidebar-wrapper')?.classList.toggle('show');
    });

    // Theme
    const savedTheme = localStorage.getItem('hrm_theme') || 'light';
    applyTheme(savedTheme);
    document.getElementById('themeToggleBtn')?.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-bs-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem('hrm_theme', next);
    });
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    const icon = document.getElementById('themeIcon');
    if (icon) icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

// ===== Debounce =====
function debounce(fn, delay = 400) {
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

// ===== Status Badges =====
const badges = {
    status: (s) => s === 'DangLam'
        ? '<span class="badge bg-success-subtle text-success border border-success-subtle"><i class="fa-solid fa-circle me-1" style="font-size:6px"></i>Đang làm</span>'
        : '<span class="badge bg-danger-subtle text-danger border border-danger-subtle"><i class="fa-solid fa-circle me-1" style="font-size:6px"></i>Nghỉ việc</span>',
    leave: (s) => ({ ChoDuyet:'<span class="badge bg-warning-subtle text-warning border border-warning-subtle">⏳ Chờ duyệt</span>', DaDuyet:'<span class="badge bg-success-subtle text-success border border-success-subtle">✅ Đã duyệt</span>', TuChoi:'<span class="badge bg-danger-subtle text-danger border border-danger-subtle">❌ Từ chối</span>' })[s] || s,
    reward: (s) => s === 'Thuong' ? '<span class="badge bg-success-subtle text-success border border-success-subtle">🏆 Thưởng</span>' : '<span class="badge bg-danger-subtle text-danger border border-danger-subtle">⚠️ Kỷ luật</span>',
    salary: (s) => s === 'DaChot' ? '<span class="badge bg-primary-subtle text-primary border border-primary-subtle">✅ Đã chốt</span>' : '<span class="badge bg-warning-subtle text-warning border border-warning-subtle">⏳ Chưa chốt</span>',
    avatar: (avatar, name, size=36) => avatar
        ? `<img src="${fmt.esc(avatar)}" style="width:${size}px;height:${size}px;border-radius:8px;object-fit:cover;border:1px solid #dee2e6" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
            + `<div style="width:${size}px;height:${size}px;border-radius:8px;background:linear-gradient(135deg,#2563EB,#7C3AED);display:none;align-items:center;justify-content:center;color:white;font-weight:700;font-size:${Math.round(size*0.4)}px;flex-shrink:0">${(name||'?')[0].toUpperCase()}</div>`
        : `<div style="width:${size}px;height:${size}px;border-radius:8px;background:linear-gradient(135deg,#2563EB,#7C3AED);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:${Math.round(size*0.4)}px;flex-shrink:0">${(name||'?')[0].toUpperCase()}</div>`
};

// Export
window.API = API;
window.requireAuth = requireAuth;
window.hasRole = hasRole;
window.showToast = showToast;
window.showConfirm = showConfirm;
window.fmt = fmt;
window.badges = badges;
window.renderLayout = renderLayout;
window.debounce = debounce;