// =====================================================
// HATECHNO HRM - Shared main.js
// Dùng cho các trang: salary, leaves, profile, reports, rewards
// Cung cấp: API, AuthCheck, Toast, Confirm, Layout (sidebar/dropdown/theme/logout)
// =====================================================

// ===== API Client =====
const API = {
    BASE: '/api',

    getToken: () => localStorage.getItem('hrm_token'),
    getUser: () => {
        try { return JSON.parse(localStorage.getItem('hrm_user')); }
        catch { return null; }
    },
    saveSession: (token, user) => {
        localStorage.setItem('hrm_token', token);
        localStorage.setItem('hrm_user', JSON.stringify(user));
    },
    clearSession: () => {
        localStorage.removeItem('hrm_token');
        localStorage.removeItem('hrm_user');
    },

    /**
     * Gọi API chung. Hỗ trợ cả JSON body và FormData (upload file).
     * options: { method, body, headers }
     */
    request: async (endpoint, options = {}) => {
        const token = API.getToken();
        const opts = {
            method: options.method || 'GET',
            headers: { ...(options.headers || {}) }
        };
        if (token) opts.headers['Authorization'] = `Bearer ${token}`;

        const body = options.body;
        if (body instanceof FormData) {
            opts.body = body; // để browser tự set Content-Type multipart
        } else if (body !== undefined && body !== null) {
            opts.headers['Content-Type'] = 'application/json';
            opts.body = JSON.stringify(body);
        }

        try {
            const res = await fetch(API.BASE + endpoint, opts);

            if (res.status === 401 || res.status === 403) {
                API.clearSession();
                window.location.href = '/login';
                return null;
            }

            let data = null;
            try { data = await res.json(); } catch { data = null; }

            return { ok: res.ok, status: res.status, data };
        } catch (err) {
            Toast.error('Lỗi kết nối máy chủ');
            return null;
        }
    },

    get: (ep) => API.request(ep, { method: 'GET' }),
    post: (ep, body) => API.request(ep, { method: 'POST', body }),
    put: (ep, body) => API.request(ep, { method: 'PUT', body }),
    delete: (ep) => API.request(ep, { method: 'DELETE' })
};

// ===== Auth Check =====
const AuthCheck = {
    require: () => {
        const token = API.getToken();
        const user = API.getUser();
        if (!token || !user) {
            window.location.href = '/login';
            return null;
        }
        Layout.applyUser(user);
        return user;
    },
    hasRole: (roles) => {
        const user = API.getUser();
        return !!(user && roles.includes(user.tenQuyen));
    }
};

// ===== Toast Notification =====
const Toast = {
    _container: null,
    _ensureContainer() {
        if (this._container && document.body.contains(this._container)) return this._container;
        const c = document.createElement('div');
        c.id = 'toastStack';
        c.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:10px;max-width:340px';
        document.body.appendChild(c);
        this._container = c;
        return c;
    },
    _show(msg, type) {
        const cfg = {
            success: { icon: 'fa-circle-check', color: '#16a34a' },
            error: { icon: 'fa-circle-xmark', color: '#dc2626' },
            warning: { icon: 'fa-triangle-exclamation', color: '#d97706' },
            info: { icon: 'fa-circle-info', color: '#2563eb' }
        }[type] || { icon: 'fa-circle-info', color: '#2563eb' };

        const container = this._ensureContainer();
        const el = document.createElement('div');
        el.className = 'hrm-toast';
        el.style.borderLeftColor = cfg.color;
        el.innerHTML = `<i class="fa-solid ${cfg.icon}" style="color:${cfg.color}"></i><span>${msg}</span>`;
        container.appendChild(el);

        requestAnimationFrame(() => el.classList.add('show'));
        setTimeout(() => {
            el.classList.remove('show');
            setTimeout(() => el.remove(), 250);
        }, 3200);
    },
    success(msg) { this._show(msg, 'success'); },
    error(msg) { this._show(msg, 'error'); },
    warning(msg) { this._show(msg, 'warning'); },
    info(msg) { this._show(msg, 'info'); }
};

// ===== Confirm Dialog =====
const Confirm = {
    show(message, title = 'Xác nhận', confirmText = 'Đồng ý', onConfirm) {
        let modal = document.getElementById('globalConfirmModal');
        if (!modal) {
            document.body.insertAdjacentHTML('beforeend', `
                <div class="modal-overlay" id="globalConfirmModal">
                    <div class="modal-box" style="max-width:380px">
                        <div class="modal-header">
                            <div class="modal-title" id="confirmModalTitle"></div>
                            <button class="modal-close" id="confirmModalClose"><i class="fa-solid fa-xmark"></i></button>
                        </div>
                        <div class="modal-body" id="confirmModalMsg"></div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" id="confirmModalCancel">Hủy</button>
                            <button class="btn btn-danger" id="confirmModalOk"></button>
                        </div>
                    </div>
                </div>`);
            modal = document.getElementById('globalConfirmModal');
            document.getElementById('confirmModalClose').addEventListener('click', () => modal.classList.remove('active'));
            document.getElementById('confirmModalCancel').addEventListener('click', () => modal.classList.remove('active'));
            modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });
        }

        document.getElementById('confirmModalTitle').textContent = title;
        document.getElementById('confirmModalMsg').textContent = message;

        const okBtn = document.getElementById('confirmModalOk');
        okBtn.textContent = confirmText;
        // Xóa listener cũ bằng cách clone lại nút
        const newOk = okBtn.cloneNode(true);
        okBtn.parentNode.replaceChild(newOk, okBtn);
        newOk.addEventListener('click', () => {
            modal.classList.remove('active');
            onConfirm && onConfirm();
        });

        modal.classList.add('active');
    }
};

// ===== Layout: sidebar, dropdown, theme, logout, user info =====
const Layout = {
    applyUser(user) {
        if (!user) return;
        const displayName = user.hoTen || user.tenDangNhap || 'User';
        const avatarUrl = user.avatar
            ? user.avatar
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=2563EB&color=fff`;

        ['sidebarAvatar', 'navAvatar'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.src = avatarUrl;
        });

        const nameEl = document.getElementById('sidebarUserName');
        if (nameEl) nameEl.textContent = displayName;

        const roleMap = { Admin: 'Quản trị viên', NhanSu: 'Nhân sự', NhanVien: 'Nhân viên' };
        const roleEl = document.getElementById('sidebarUserRole');
        if (roleEl) roleEl.textContent = roleMap[user.tenQuyen] || user.tenQuyen || '';

        // Ẩn các nút/khu vực chỉ dành cho Admin/NhanSu
        if (!['Admin', 'NhanSu'].includes(user.tenQuyen)) {
            document.querySelectorAll('[data-manager-only]').forEach(el => el.style.display = 'none');
        }

        // Tài khoản "Nhân viên" (quyền NhanVien) chỉ thấy các mục làm việc tương ứng
        if (user.tenQuyen === 'NhanVien') {
            const employeeOnlyPages = ['/attendance', '/salary', '/rewards', '/leaves', '/profile'];
            document.querySelectorAll('.sidebar-nav .nav-item').forEach(link => {
                const href = link.getAttribute('href') || '';
                if (!employeeOnlyPages.includes(href)) link.style.display = 'none';
            });
        }
    },

    initTheme() {
        const btn = document.getElementById('themeToggle');
        const saved = localStorage.getItem('hrm_theme') || 'light';
        document.documentElement.setAttribute('data-theme', saved);
        if (!btn) return;
        btn.innerHTML = saved === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        btn.addEventListener('click', () => {
            const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', cur);
            localStorage.setItem('hrm_theme', cur);
            btn.innerHTML = cur === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        });
    },

    initSidebar() {
        const toggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const mainContent = document.getElementById('mainContent');

        toggle?.addEventListener('click', () => {
            if (window.innerWidth <= 900) {
                sidebar?.classList.toggle('show');
                overlay?.classList.toggle('show');
            } else {
                sidebar?.classList.toggle('collapsed');
                mainContent?.classList.toggle('expanded');
            }
        });

        overlay?.addEventListener('click', () => {
            sidebar?.classList.remove('show');
            overlay.classList.remove('show');
        });
    },

    initDropdown() {
        document.querySelectorAll('[data-dropdown-toggle]').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const menu = document.getElementById(trigger.dataset.dropdownToggle);
                document.querySelectorAll('.dropdown-menu.show').forEach(m => {
                    if (m !== menu) m.classList.remove('show');
                });
                menu?.classList.toggle('show');
            });
        });
        document.addEventListener('click', () => {
            document.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
        });
    },

    initLogout() {
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            API.clearSession();
            window.location.href = '/login';
        });
    }
};

// Khởi tạo các hành vi layout ngay khi file này được load
// (script được đặt cuối trang nên DOM đã sẵn sàng)
Layout.initTheme();
Layout.initSidebar();
Layout.initDropdown();
Layout.initLogout();

const _currentUser = API.getUser();
if (_currentUser) Layout.applyUser(_currentUser);

// Xuất toàn cục để các trang khác sử dụng
window.API = API;
window.AuthCheck = AuthCheck;
window.Toast = Toast;
window.Confirm = Confirm;
window.Layout = Layout;